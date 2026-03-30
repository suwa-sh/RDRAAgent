# RDS for PostgreSQL モジュール
# マルチ AZ 同期レプリケーション、KMS 暗号化、35 日バックアップ

variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }

# TODO: 以下のリソースを実装
# - aws_db_subnet_group
# - aws_security_group (RDS 用)
# - aws_kms_key (RDS 暗号化用)
# - aws_db_parameter_group (PostgreSQL 16)
# - aws_db_instance (db.r6g.large, マルチ AZ, 暗号化, 35 日バックアップ)
# - aws_cloudwatch_metric_alarm (接続数、IOPS)

output "endpoint" {
  description = "RDS エンドポイント"
  value       = "" # aws_db_instance.main.endpoint
}
