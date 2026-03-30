# Terraform Modules

各モジュールの実装はプロジェクト固有の要件に合わせて作成してください。

| モジュール | 対応 AWS サービス | 説明 |
|-----------|-----------------|------|
| `vpc` | VPC, Subnets, NAT GW | ネットワーク基盤 |
| `waf` | AWS WAF | OWASP Top 10 対策 |
| `cognito` | Cognito User Pool | 認証基盤 (OAuth2/OIDC, MFA) |
| `rds` | RDS PostgreSQL | メインデータベース (Multi-AZ) |
| `elasticache` | ElastiCache Redis | キャッシュ・セッション管理 |
| `sqs` | SQS | 非同期ジョブキュー |
| `ecs-cluster` | ECS Cluster | コンテナ実行基盤 |
| `ecs-service` | ECS Service (Fargate) | バックエンド API |
| `ecs-worker` | ECS Task (Fargate) | ワーカー + バッチ |
| `api-gateway` | API Gateway | JWT 検証、RBAC、レート制限 |
| `cloudfront` | CloudFront | CDN |
| `alb` | ALB | 内部ロードバランシング |
| `app-runner` | App Runner | フロントエンド |
