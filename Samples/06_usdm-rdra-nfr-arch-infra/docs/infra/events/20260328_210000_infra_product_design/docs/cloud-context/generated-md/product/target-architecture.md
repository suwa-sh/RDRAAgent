# 貸し会議室SaaS ターゲットアーキテクチャ（AWS）

## 概要

貸し会議室マッチングサービスの AWS インフラアーキテクチャ。共有プラットフォーム（EKS / Lambda / オブザーバビリティ / CI/CD）を活用し、Foundation ガードレール（リージョン制限・タグ強制・暗号化）に準拠する。

| 項目 | 値 |
|------|-----|
| ワークロードタイプ | Web アプリ |
| SLA | 99.9% |
| p99 レイテンシ | 500ms |
| トラフィック | steady（50 RPS baseline、spike 2x） |
| データ機密性 | restricted（PII） |
| 整合性 | 強整合性 |
| コスト月額（本番） | $1,500 - $2,500 |

## ワークロード全体構成図

```mermaid
graph TD
    subgraph "Internet"
        USER[利用者 / オーナー]
        ADMIN[サービス運営担当者]
    end

    subgraph "AWS - ap-northeast-1"
        subgraph "Edge"
            CF[CloudFront CDN]
            WAF[AWS WAF]
        end

        subgraph "VPC - ワークロード"
            subgraph "Public Subnet"
                ALB[Application Load Balancer]
            end

            subgraph "Private Subnet - EKS"
                API[Backend API<br/>Go / EKS Pod]
                WORKER[Worker<br/>EKS CronJob]
                OPENFGA[OpenFGA<br/>ReBAC Service]
            end

            subgraph "Private Subnet - Lambda"
                LAMBDA[Event Worker<br/>Lambda]
            end

            subgraph "Private Subnet - Data"
                RDS[(RDS PostgreSQL<br/>Multi-AZ)]
                REDIS[(ElastiCache<br/>Redis Serverless)]
            end
        end

        subgraph "Managed Services"
            COGNITO[Amazon Cognito<br/>IdP]
            SQS[Amazon SQS<br/>Standard + FIFO]
            S3[Amazon S3<br/>画像 + SPA]
        end

        subgraph "外部"
            PAYMENT[決済機関]
        end
    end

    USER -->|HTTPS| CF
    ADMIN -->|HTTPS + IP制限| CF
    CF --> WAF --> ALB
    CF --> S3
    ALB --> API
    API --> RDS
    API --> REDIS
    API --> SQS
    API --> OPENFGA
    API --> COGNITO
    API -->|REST/TLS| PAYMENT
    SQS --> LAMBDA
    LAMBDA --> RDS
    WORKER --> RDS
    WORKER --> SQS
    WORKER -->|REST/TLS| PAYMENT
    OPENFGA --> RDS
```

## リクエストフロー図

```mermaid
sequenceDiagram
    participant U as 利用者
    participant CF as CloudFront
    participant WAF as WAF
    participant ALB as ALB
    participant API as Backend API
    participant Cognito as Cognito IdP
    participant FGA as OpenFGA
    participant RDS as RDS PostgreSQL
    participant Redis as ElastiCache

    U->>CF: HTTPS リクエスト
    CF->>WAF: WAF チェック
    WAF->>ALB: 許可済みリクエスト
    ALB->>API: HTTP（TLS 終端済み）

    Note over API: JWT トークン検証
    API->>Cognito: トークン検証（キャッシュミス時）
    Cognito-->>API: 検証結果

    Note over API: 認可チェック
    API->>FGA: Check(user:123, viewer, room:456)
    FGA-->>API: allowed/denied

    Note over API: ビジネスロジック
    API->>Redis: キャッシュ検索
    Redis-->>API: ヒット/ミス

    API->>RDS: SQL クエリ
    RDS-->>API: 結果

    API-->>ALB: HTTP レスポンス
    ALB-->>CF: レスポンス
    CF-->>U: HTTPS レスポンス
```

## オートスケーリング構成図

```mermaid
graph LR
    subgraph "EKS オートスケーリング"
        HPA[HPA<br/>CPU 70% target] -->|Pod 増減| POD[Backend API Pods<br/>min:2 / max:10]
        KARPENTER[Karpenter<br/>Consolidation] -->|ノード増減| NODE[EKS Nodes<br/>arm64 優先]
    end

    subgraph "ElastiCache Serverless"
        ECPU[自動 ECPU スケーリング] -->|読み書き負荷| CACHE[Redis Cache<br/>max 5000 ECPU/s]
    end

    subgraph "Lambda"
        SQS_TRIGGER[SQS Event Source] -->|reserved: 20| FN[Lambda Function<br/>batch: 10, concurrency: 5]
    end

    subgraph "RDS"
        RDS_SCALE[手動スケーリング] -->|インスタンスクラス変更| DB[RDS PostgreSQL<br/>db.r6g.large]
    end
```

## 主要サービスマッピング

| アーキテクチャティア | AWS サービス | 備考 |
|---|---|---|
| フロントエンド（利用者） | S3 + CloudFront | SPA 配信 |
| フロントエンド（管理者） | S3 + CloudFront + WAF IP制限 | 社内 IP のみ |
| API Gateway | ALB + WAF | TLS 終端、レート制限 |
| IdP | Amazon Cognito | OIDC、MFA |
| 認可サービス | OpenFGA on EKS | ReBAC |
| バックエンド API | EKS (Go) | 共有ランタイム |
| バックエンドワーカー | EKS CronJob + Lambda | タイマー系 + イベント駆動 |
| RDB | RDS PostgreSQL Multi-AZ | PITR 35日 |
| キャッシュ | ElastiCache Serverless | Redis 7.1 |
| オブジェクトストレージ | S3 | 画像保管 |
| メッセージキュー | SQS (Standard + FIFO) | DLQ 付き |
| オブザーバビリティ | Managed Prometheus + Grafana + X-Ray | 共有プラットフォーム |
| CI/CD | GitHub Actions + ArgoCD | GitOps |
| シークレット | Secrets Manager + ESO | 共有プラットフォーム |

## セキュリティ要件の対応

| 要件 | 対応 |
|------|------|
| TLS 暗号化 | ALB で TLS 終端、ACM 証明書自動更新 |
| 保管時暗号化 | RDS: KMS CMK、S3: SSE-KMS、ElastiCache: at-rest |
| WAF | AWS WAF マネージドルール 3 セット |
| IP 制限（管理画面） | WAF IP セットルール |
| MFA | Cognito TOTP（管理者必須） |
| 監査ログ | 構造化 JSON、1年保管、S3 アーカイブ |
| 決済機関連携 | 決済処理は外部委託のため PCI DSS 対象外。通信ログ記録、機密情報マスク |
