# =============================================================================
# Amazon RDS for PostgreSQL Module
# =============================================================================

variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "instance_class" { type = string }
variable "multi_az" { type = bool }
variable "storage_size" { type = number }
variable "max_storage_size" { type = number }

resource "aws_db_subnet_group" "main" {
  name       = "kashikaigishitsu-${var.environment}"
  subnet_ids = var.private_subnet_ids
}

resource "aws_db_parameter_group" "main" {
  name   = "kashikaigishitsu-pg16-${var.environment}"
  family = "postgres16"

  parameter {
    name  = "max_connections"
    value = "200"
  }

  parameter {
    name  = "log_statement"
    value = "ddl"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }
}

resource "aws_db_instance" "main" {
  identifier     = "kashikaigishitsu-${var.environment}"
  engine         = "postgres"
  engine_version = "16"

  instance_class        = var.instance_class
  allocated_storage     = var.storage_size
  max_allocated_storage = var.max_storage_size
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id            = aws_kms_key.rds.arn

  multi_az               = var.multi_az
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.main.name

  backup_retention_period   = 35
  backup_window             = "19:00-20:00"
  copy_tags_to_snapshot     = true
  deletion_protection       = var.environment == "production"
  skip_final_snapshot       = var.environment != "production"
  final_snapshot_identifier = var.environment == "production" ? "kashikaigishitsu-final-${var.environment}" : null

  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  monitoring_interval                   = 60
  monitoring_role_arn                   = aws_iam_role.rds_monitoring.arn
}

resource "aws_kms_key" "rds" {
  description = "KMS key for kashikaigishitsu RDS ${var.environment}"
}

resource "aws_kms_alias" "rds" {
  name          = "alias/kashikaigishitsu-rds-${var.environment}"
  target_key_id = aws_kms_key.rds.key_id
}

resource "aws_security_group" "rds" {
  name_prefix = "kashikaigishitsu-rds-${var.environment}-"
  vpc_id      = var.vpc_id

  # Ingress rules will reference EKS node and Lambda security groups
}

resource "aws_iam_role" "rds_monitoring" {
  name = "kashikaigishitsu-rds-monitoring-${var.environment}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "monitoring.rds.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

output "endpoint" {
  value = aws_db_instance.main.address
}
