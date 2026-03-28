# =============================================================================
# 貸し会議室SaaS - AWS Infrastructure (Terraform)
# =============================================================================
# このファイルは IaC スケルトンです。実装時に詳細を追加してください。
# =============================================================================

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
  }

  backend "s3" {
    # バックエンド設定は環境ごとに .tfbackend ファイルで管理
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      cost-center = var.cost_center
      environment = var.environment
      owner       = var.owner
      managed-by  = "terraform"
      project     = "kashikaigishitsu"
    }
  }
}

# =============================================================================
# Variables
# =============================================================================

variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "environment" {
  type = string
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "environment must be one of: production, staging, development"
  }
}

variable "cost_center" {
  type    = string
  default = "development"
}

variable "owner" {
  type    = string
  default = "kashikaigishitsu-team"
}

variable "vpc_id" {
  type        = string
  description = "ワークロード VPC ID（Foundation から提供）"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "プライベートサブネット ID 一覧"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "パブリックサブネット ID 一覧"
}

variable "eks_cluster_name" {
  type        = string
  description = "共有プラットフォーム EKS クラスター名"
}

variable "domain_name" {
  type        = string
  description: "アプリケーションドメイン名"
}

# =============================================================================
# Modules
# =============================================================================

module "rds" {
  source = "./modules/rds-postgresql"

  environment        = var.environment
  vpc_id             = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
  instance_class     = var.environment == "production" ? "db.r6g.large" : "db.t4g.medium"
  multi_az           = var.environment == "production" ? true : false
  storage_size       = 100
  max_storage_size   = 500
}

module "elasticache" {
  source = "./modules/elasticache-redis"

  environment        = var.environment
  vpc_id             = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
  serverless         = var.environment != "development"
}

module "s3" {
  source = "./modules/s3"

  environment = var.environment
}

module "sqs" {
  source = "./modules/sqs"

  environment = var.environment
}

module "cognito" {
  source = "./modules/cognito"

  environment = var.environment
  domain_name = var.domain_name
}

module "cloudfront" {
  source = "./modules/cloudfront"

  environment      = var.environment
  domain_name      = var.domain_name
  alb_dns_name     = module.alb.dns_name
  spa_user_bucket  = module.s3.spa_user_bucket_domain
  spa_admin_bucket = module.s3.spa_admin_bucket_domain
  images_bucket    = module.s3.images_bucket_domain
}

module "alb" {
  source = "./modules/alb-waf"

  environment       = var.environment
  vpc_id            = var.vpc_id
  public_subnet_ids = var.public_subnet_ids
  domain_name       = var.domain_name
}

module "eks_workload" {
  source = "./modules/eks-workload"

  environment      = var.environment
  eks_cluster_name = var.eks_cluster_name
  namespace        = "kashikaigishitsu-${var.environment}"
  rds_endpoint     = module.rds.endpoint
  redis_endpoint   = module.elasticache.endpoint
  sqs_queue_urls   = module.sqs.queue_urls
}

module "lambda_worker" {
  source = "./modules/lambda-worker"

  environment        = var.environment
  vpc_id             = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
  rds_endpoint       = module.rds.endpoint
  redis_endpoint     = module.elasticache.endpoint
  sqs_queue_arn      = module.sqs.notification_queue_arn
}

# =============================================================================
# Outputs
# =============================================================================

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "elasticache_endpoint" {
  value = module.elasticache.endpoint
}

output "cloudfront_domain" {
  value = module.cloudfront.domain_name
}

output "alb_dns_name" {
  value = module.alb.dns_name
}

output "cognito_user_pool_id" {
  value = module.cognito.user_pool_id
}
