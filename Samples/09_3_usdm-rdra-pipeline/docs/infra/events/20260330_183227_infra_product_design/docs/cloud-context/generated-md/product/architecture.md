# 貸し会議室サービス - AWS アーキテクチャ

## 概要

C2C 会議室シェアリングサービスの AWS インフラストラクチャ設計。
3種のアクター（利用者・オーナー・運営担当者）が利用する Web アプリケーションと月末精算バッチ処理を含む。

| 項目 | 値 |
|------|-----|
| ワークロードタイプ | Web App |
| SLA | 99% |
| フェイルオーバー | Warm Standby |
| レイテンシ p99 | 500ms |
| トラフィック | 50 RPS (定常)、ピーク 100 RPS |
| コスト戦略 | Balanced |
| 月額概算 | $800 - $1,500 |

## ワークロード全体構成図

```mermaid
graph TD
    subgraph "Edge"
        CF["CloudFront<br/>(CDN + WAF)"]
    end

    subgraph "Public"
        AR["App Runner<br/>(Next.js SSR)"]
        APIGW["API Gateway<br/>(HTTP API + JWT)"]
    end

    subgraph "Private"
        ECS["ECS Fargate<br/>(Hono API)"]
        LAMBDA["Lambda<br/>(精算バッチ)"]
    end

    subgraph "Data"
        RDS[("RDS PostgreSQL<br/>(Multi-AZ)")]
        REDIS["ElastiCache<br/>(Redis Serverless)"]
        S3["S3<br/>(画像)"]
    end

    subgraph "Identity"
        COGNITO["Cognito<br/>(IdP)"]
    end

    subgraph "External"
        PAYMENT["決済機関"]
    end

    CF --> AR
    CF --> S3
    CF --> APIGW
    APIGW --> COGNITO
    APIGW --> ECS
    ECS --> RDS
    ECS --> REDIS
    ECS --> PAYMENT
    LAMBDA --> RDS
    LAMBDA --> PAYMENT
```

## リクエストフロー図

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant CF as CloudFront
    participant GW as API Gateway
    participant COG as Cognito
    participant API as ECS (Backend)
    participant DB as RDS PostgreSQL
    participant CACHE as ElastiCache

    U->>CF: HTTPS リクエスト
    CF->>GW: API リクエスト転送
    GW->>COG: JWT トークン検証
    COG-->>GW: 検証結果
    GW->>API: 認証済みリクエスト
    API->>CACHE: 冪等キー確認
    CACHE-->>API: キー存在チェック結果
    API->>DB: ビジネスロジック実行
    DB-->>API: 結果
    API->>CACHE: 冪等キー登録
    API-->>GW: レスポンス
    GW-->>CF: レスポンス転送
    CF-->>U: HTTPS レスポンス
```

## オートスケーリング構成図

```mermaid
graph LR
    subgraph "Triggers"
        CPU["CPU 使用率 > 70%"]
        REQ["同時リクエスト > 100"]
    end

    subgraph "Targets"
        ECS["ECS Tasks<br/>(min:2, max:8)"]
        AR["App Runner<br/>(min:1, max:4)"]
    end

    CPU --> ECS
    REQ --> AR
```

## AWS サービスマッピング

| Canonical 要素 | AWS サービス | 構成 |
|---|---|---|
| Web Frontend | App Runner | Next.js SSR, 0.25 vCPU |
| API Gateway | API Gateway (HTTP API) | JWT + WAF + Rate Limit |
| IdP | Cognito | OAuth2/OIDC, パスワードポリシー |
| Backend API | ECS Fargate | Hono, 0.5 vCPU, 2-8 タスク |
| Batch Worker | Lambda + EventBridge | 月末精算, arm64 |
| RDB | RDS PostgreSQL | Multi-AZ, db.r6g.large |
| Cache | ElastiCache Redis | Serverless |
| Object Storage | S3 | Standard + IA 移行 |
| CDN | CloudFront | PriceClass_200 |
| Network | VPC | 3サブネット層, NAT GW |

## セキュリティ構成

- **認証**: Cognito (OAuth2/OIDC) + API Gateway JWT 検証
- **認可**: RBAC (利用者/オーナー/運営) + Backend 細粒度制御
- **暗号化**: TLS (全通信) + KMS (RDS ストレージ)
- **ネットワーク分離**: Public/Private/DB サブネット
- **WAF**: CloudFront + API Gateway に適用 (OWASP Top10)
- **監査**: CloudWatch Logs (365日保持)

## コスト最適化ポイント

1. ARM64 (Graviton) 採用で ~20% 削減
2. VPC エンドポイントで NAT Gateway コスト削減
3. ElastiCache Serverless で使用量ベース課金
4. S3 ライフサイクルで IA 移行
5. 本番安定後に RI / Savings Plans 適用
