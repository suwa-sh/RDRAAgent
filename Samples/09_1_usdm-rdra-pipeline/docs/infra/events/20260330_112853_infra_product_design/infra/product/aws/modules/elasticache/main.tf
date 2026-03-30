# ElastiCache for Redis モジュール
# マルチ AZ レプリケーション、TLS 暗号化

variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }

# TODO: 以下のリソースを実装
# - aws_elasticache_subnet_group
# - aws_security_group (Redis 用)
# - aws_kms_key (Redis 暗号化用)
# - aws_elasticache_parameter_group (Redis 7.1)
# - aws_elasticache_replication_group (cache.r6g.large, マルチ AZ, TLS, KMS)
# - aws_cloudwatch_metric_alarm (メモリ使用率、接続数)

output "endpoint" {
  description = "ElastiCache Redis エンドポイント"
  value       = "" # aws_elasticache_replication_group.main.primary_endpoint_address
}
