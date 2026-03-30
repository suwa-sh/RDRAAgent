# 貸し会議室サービス ターゲットアーキテクチャ

## 概要

貸し会議室サービスは、会議室オーナーと利用者をマッチングするWebアプリケーションとしてAWS上に構築する。共有プラットフォームのEKSランタイムを基盤とし、RDS for PostgreSQLとElastiCache for Redisをデータ層に配置する。

## ワークロード全体構成図

```mermaid
graph TD
    subgraph "エッジ層"
        CF[CloudFront<br/>CDN]
        WAF[AWS WAF<br/>OWASP Top 10]
    end

    subgraph "API 層"
        APIGW[API Gateway<br/>JWT 検証 + RBAC]
    end

    subgraph "認証層"
        COGNITO[Amazon Cognito<br/>OAuth2/OIDC + MFA]
    end

    subgraph "共有プラットフォーム EKS クラスタ"
        subgraph "kashikaigishitsu Namespace"
            FE[Frontend Pod<br/>Next.js SSR]
            BE[Backend API Pod<br/>NestJS]
            WK[Worker CronJob<br/>月末精算バッチ]
        end
    end

    subgraph "データ層"
        RDS[(RDS PostgreSQL<br/>マルチ AZ)]
        REDIS[(ElastiCache Redis<br/>マルチ AZ)]
        SQS[Amazon SQS<br/>精算キュー]
    end

    subgraph "外部連携"
        PAY[決済機関 API]
    end

    subgraph "オブザーバビリティ"
        PROM[Managed Prometheus]
        GRAFANA[Managed Grafana]
        XRAY[AWS X-Ray]
        CWL[CloudWatch Logs]
    end

    CF -->|HTTPS| WAF
    WAF --> APIGW
    APIGW -->|トークン検証| COGNITO
    APIGW -->|REST| FE
    FE -->|API 呼出| BE
    BE --> RDS
    BE --> REDIS
    BE -->|メッセージ| SQS
    SQS --> WK
    WK --> RDS
    WK -->|精算 API| PAY
    BE -->|決済 API| PAY

    BE -.->|メトリクス| PROM
    BE -.->|ログ| CWL
    BE -.->|トレース| XRAY
    PROM -.-> GRAFANA
```

## リクエストフロー図

```mermaid
sequenceDiagram
    participant U as 利用者
    participant CF as CloudFront
    participant WAF as AWS WAF
    participant GW as API Gateway
    participant COG as Cognito
    participant FE as Frontend (EKS)
    participant BE as Backend API (EKS)
    participant RDS as RDS PostgreSQL
    participant REDIS as ElastiCache Redis

    U->>CF: HTTPS リクエスト
    CF->>WAF: リクエスト転送
    WAF->>WAF: OWASP ルールチェック
    WAF->>GW: 許可されたリクエスト

    Note over GW,COG: 認証フロー
    GW->>COG: JWT トークン検証
    COG-->>GW: 検証結果 + ユーザー情報

    GW->>FE: SSR リクエスト
    FE->>BE: API 呼出（trace_id + 冪等キー付き）

    Note over BE,REDIS: 冪等性チェック
    BE->>REDIS: 冪等キー確認
    REDIS-->>BE: キー未登録

    BE->>RDS: トランザクション実行
    RDS-->>BE: 結果
    BE->>REDIS: 冪等キー登録（TTL 付き）
    BE-->>FE: API レスポンス
    FE-->>CF: HTML レスポンス
    CF-->>U: レスポンス
```

## オートスケーリング構成図

```mermaid
graph LR
    subgraph "スケーリングトリガー"
        CPU[CPU 使用率 > 70%]
        MEM[メモリ使用率 > 80%]
    end

    subgraph "HPA"
        HPA_FE[Frontend HPA<br/>min:2, max:6]
        HPA_BE[Backend HPA<br/>min:2, max:10]
    end

    subgraph "ノード管理"
        KARP[Karpenter<br/>ノード自動プロビジョニング]
    end

    CPU --> HPA_FE
    CPU --> HPA_BE
    MEM --> HPA_FE
    MEM --> HPA_BE
    HPA_FE --> KARP
    HPA_BE --> KARP
```

## AWS デプロイメント図

```mermaid
graph TD
    subgraph "AWS ap-northeast-1"
        subgraph "VPC: shared-services"
            subgraph "AZ-a"
                EKS_A[EKS ノード]
                RDS_P[(RDS プライマリ)]
                REDIS_P[(Redis プライマリ)]
            end
            subgraph "AZ-c"
                EKS_C[EKS ノード]
                RDS_S[(RDS スタンバイ)]
                REDIS_R[(Redis レプリカ)]
            end
        end
        APIGW[API Gateway]
        CF[CloudFront]
        COG[Cognito]
        SQS[SQS]
        S3[(S3 静的アセット)]
    end

    CF --> APIGW
    APIGW --> EKS_A
    APIGW --> EKS_C
    EKS_A --> RDS_P
    EKS_A --> REDIS_P
    EKS_C --> RDS_P
    EKS_C --> REDIS_P
    RDS_P -.->|同期レプリケーション| RDS_S
    REDIS_P -.->|非同期レプリケーション| REDIS_R
    CF --> S3
```

## 主要設計判断

| # | 判断内容 | 選択 | 根拠 |
|---|---------|------|------|
| 1 | コンピュートモデル | EKS コンテナ中心 | 共有プラットフォーム活用 + 精算バッチ 8 時間制約 |
| 2 | データベース | RDS for PostgreSQL | コスト効率 + UPSERT 対応 + マルチ AZ |
| 3 | キャッシュ | ElastiCache for Redis | セッション + 冪等キー管理の高速処理 |
| 4 | 認証 | Amazon Cognito | マネージド IdP + MFA + OAuth2/OIDC |
| 5 | CDN | CloudFront | 静的アセット配信 + HTTPS 強制 |

## コスト概算（月額）

| サービス | カテゴリ | 月額 (USD) |
|---------|---------|-----------|
| EKS（共有クラスタ利用分） | コンピュート | 350 |
| RDS for PostgreSQL | データベース | 450 |
| ElastiCache for Redis | キャッシュ | 280 |
| API Gateway | ネットワーク | 50 |
| CloudFront | ネットワーク | 30 |
| SQS | メッセージング | 5 |
| Cognito | セキュリティ | 50 |
| WAF | セキュリティ | 20 |
| CloudWatch + S3 | オブザーバビリティ | 80 |
| その他 | その他 | 30 |
| **合計** | | **1,345** |
