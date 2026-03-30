# =============================================================================
# 貸し会議室サービス - AWS インフラストラクチャ (Terraform)
# =============================================================================
# このファイルは IaC スケルトンです。実際のデプロイ前に変数値の確定が必要です。

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    # bucket = "terraform-state-bucket"
    # key    = "kashi-kaigishitsu/terraform.tfstate"
    # region = "ap-northeast-1"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "kashi-kaigishitsu"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# =============================================================================
# Variables
# =============================================================================

variable "aws_region" {
  default = "ap-northeast-1"
}

variable "environment" {
  default = "production"
}

variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

# =============================================================================
# VPC
# =============================================================================

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "kashi-kaigishitsu-vpc"
  cidr = var.vpc_cidr

  azs              = ["ap-northeast-1a", "ap-northeast-1c"]
  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets  = ["10.0.11.0/24", "10.0.12.0/24"]
  database_subnets = ["10.0.21.0/24", "10.0.22.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true
  enable_dns_support   = true

  enable_flow_log                      = true
  flow_log_destination_type            = "s3"
  create_flow_log_cloudwatch_log_group = false
}

# =============================================================================
# RDS PostgreSQL
# =============================================================================

resource "aws_db_instance" "main" {
  identifier     = "kashi-kaigishitsu-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.r6g.large"

  allocated_storage     = 100
  max_allocated_storage = 500
  storage_type          = "gp3"
  storage_encrypted     = true

  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period  = 7
  backup_window            = "17:00-18:00"
  maintenance_window       = "Sun:18:00-Sun:19:00"
  copy_tags_to_snapshot    = true
  deletion_protection      = true
  skip_final_snapshot      = false
  final_snapshot_identifier = "kashi-kaigishitsu-final"

  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  monitoring_interval                   = 60

  # TODO: Set credentials via Secrets Manager
  # username = "..."
  # password = "..."
}

resource "aws_db_subnet_group" "main" {
  name       = "kashi-kaigishitsu-db-subnet"
  subnet_ids = module.vpc.database_subnets
}

# =============================================================================
# ElastiCache Redis (Serverless)
# =============================================================================

resource "aws_elasticache_serverless_cache" "main" {
  engine = "redis"
  name   = "kashi-kaigishitsu-cache"

  cache_usage_limits {
    data_storage {
      maximum = 5
      unit    = "GB"
    }
    ecpu_per_second {
      maximum = 15000
    }
  }

  subnet_ids         = module.vpc.private_subnets
  security_group_ids = [aws_security_group.elasticache.id]
}

# =============================================================================
# ECS Cluster & Service
# =============================================================================

resource "aws_ecs_cluster" "main" {
  name = "kashi-kaigishitsu-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# TODO: ECS Task Definition, Service, ALB, Auto Scaling

# =============================================================================
# Security Groups
# =============================================================================

resource "aws_security_group" "rds" {
  name_prefix = "kashi-kaigishitsu-rds-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [] # TODO: Reference ECS security group
  }
}

resource "aws_security_group" "elasticache" {
  name_prefix = "kashi-kaigishitsu-cache-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [] # TODO: Reference ECS security group
  }
}

# =============================================================================
# S3 Bucket (Assets)
# =============================================================================

resource "aws_s3_bucket" "assets" {
  bucket = "kashi-kaigishitsu-assets-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket                  = aws_s3_bucket.assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_caller_identity" "current" {}

# =============================================================================
# Cognito User Pool
# =============================================================================

resource "aws_cognito_user_pool" "main" {
  name = "kashi-kaigishitsu-users"

  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  user_attribute_update_settings {
    attributes_require_verification_before_update = ["email"]
  }
}

# TODO: Cognito App Client, Groups, API Gateway, CloudFront, WAF, Lambda, EventBridge
