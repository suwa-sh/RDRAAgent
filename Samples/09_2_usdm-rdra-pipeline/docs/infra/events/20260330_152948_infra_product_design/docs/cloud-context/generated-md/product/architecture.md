# 貸し会議室サービス - AWS ターゲットアーキテクチャ

## 概要

C2C 貸し会議室プラットフォームの AWS インフラアーキテクチャ。
利用者・会議室オーナー・サービス運営担当者の3アクターが利用する Web アプリケーション。

### ワークロード特性

| 項目 | 値 |
|------|-----|
| ワークロードタイプ | Web App |
| SLA | 99% |
| フェイルオーバー | Warm Standby |
| レイテンシ (p99) | 500ms |
| トラフィック | Steady (50 RPS baseline, x2 spike) |
| データ機密性 | Restricted (PII + PCI DSS) |
| 整合性 | Strong |
| RPO / RTO | 24h / 4h |
| コスト方針 | Balanced |

## ワークロード全体構成図

```mermaid
graph TD
    subgraph "Internet"
        USER[利用者/オーナー]
        ADMIN[運営担当者]
    end

    subgraph "Edge"
        CF[CloudFront<br/>CDN]
        WAF[AWS WAF]
    end

    subgraph "Public Subnet"
        APIGW[API Gateway<br/>JWT検証 + RBAC]
        NAT[NAT Gateway]
    end

    subgraph "Private App Subnet"
        AR[App Runner<br/>Next.js SSR]
        ECS_API[ECS Fargate<br/>Hono API x2-6]
        ECS_WK[ECS Fargate<br/>Worker x1-4]
        ALB[Internal ALB]
    end

    subgraph "Private Data Subnet"
        RDS[(RDS PostgreSQL<br/>Multi-AZ)]
        REDIS[(ElastiCache Redis<br/>Primary + Replica)]
        SQS[SQS<br/>Standard Queue]
    end

    subgraph "Auth"
        COGNITO[Cognito<br/>User Pool + MFA]
    end

    subgraph "External"
        PAYMENT[決済機関]
    end

    USER -->|HTTPS| CF
    ADMIN -->|HTTPS + IP制限| CF
    CF --> WAF
    WAF --> AR
    WAF --> APIGW
    APIGW -->|JWT検証| COGNITO
    APIGW -->|VPC Link| ALB
    ALB --> ECS_API
    ECS_API --> RDS
    ECS_API --> REDIS
    ECS_API -->|非同期ジョブ| SQS
    SQS --> ECS_WK
    ECS_WK --> RDS
    ECS_API -->|精算依頼| PAYMENT
    ECS_WK -->|精算バッチ| PAYMENT
```

## リクエストフロー図

```mermaid
sequenceDiagram
    participant U as 利用者
    participant CF as CloudFront
    participant WAF as AWS WAF
    participant GW as API Gateway
    participant COG as Cognito
    participant ALB as Internal ALB
    participant API as ECS API
    participant DB as RDS PostgreSQL
    participant CACHE as ElastiCache Redis

    U->>CF: HTTPS リクエスト
    CF->>WAF: WAF フィルタリング
    WAF->>GW: ルーティング
    GW->>COG: JWT トークン検証
    COG-->>GW: 検証結果 + ユーザー情報
    GW->>ALB: VPC Link 経由
    ALB->>API: ロードバランシング
    API->>CACHE: 冪等キーチェック
    CACHE-->>API: 新規リクエスト確認
    API->>DB: トランザクション実行
    DB-->>API: 結果
    API->>CACHE: 冪等キー登録
    API-->>ALB: レスポンス
    ALB-->>GW: レスポンス
    GW-->>CF: レスポンス
    CF-->>U: レスポンス
```

## オートスケーリング構成図

```mermaid
graph LR
    subgraph "スケーリングトリガー"
        CPU[CPU使用率 > 70%]
        CONC[同時接続数 > 100]
        MSG[SQS メッセージ数]
    end

    subgraph "スケーリング対象"
        API_SCALE[ECS API<br/>2 → 6 タスク]
        FE_SCALE[App Runner<br/>1 → 4 インスタンス]
        WK_SCALE[ECS Worker<br/>1 → 4 タスク]
    end

    CPU --> API_SCALE
    CONC --> FE_SCALE
    MSG --> WK_SCALE
```

## AWS サービス一覧

| カテゴリ | サービス | 用途 |
|---------|---------|------|
| コンピュート | App Runner | フロントエンド (Next.js SSR) |
| コンピュート | ECS Fargate | バックエンド API + ワーカー |
| ネットワーク | API Gateway | JWT 検証、RBAC、レート制限 |
| ネットワーク | CloudFront | CDN、静的アセット配信 |
| ネットワーク | ALB | 内部ロードバランシング |
| ネットワーク | VPC | ネットワーク分離 |
| セキュリティ | WAF | OWASP Top 10 対策 |
| セキュリティ | Cognito | OAuth2/OIDC 認証、MFA |
| データベース | RDS PostgreSQL | メインストレージ (Multi-AZ) |
| キャッシュ | ElastiCache Redis | セッション、冪等キー管理 |
| メッセージング | SQS | 非同期ジョブキュー |
| スケジューリング | EventBridge Scheduler | 月末精算バッチ |
| 監視 | CloudWatch | メトリクス、ログ、アラート |

## コスト見積もり（月額）

| コンポーネント | 見積もり範囲 (USD) |
|--------------|-------------------|
| ECS Fargate | $150 - $300 |
| App Runner | $50 - $100 |
| RDS PostgreSQL | $250 - $400 |
| ElastiCache Redis | $100 - $150 |
| その他 (API GW, CDN, WAF, VPC等) | $115 - $285 |
| **合計** | **$800 - $1,500** |
