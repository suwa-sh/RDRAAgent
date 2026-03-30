# 貸し会議室サービス AWS インフラストラクチャ
# Terraform メインエントリポイント

terraform {
  required_version = ">= 1.5.0"
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
    # バックエンド設定は環境別の .tfbackend ファイルで上書き
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "kashikaigishitsu"
      Environment = var.environment
      ManagedBy   = "terraform"
      CostCenter  = var.cost_center
    }
  }
}

# === 変数定義 ===
variable "aws_region" {
  description = "AWS リージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "environment" {
  description = "環境名（production, staging, development）"
  type        = string
}

variable "cost_center" {
  description = "コストセンター"
  type        = string
  default     = "development"
}

variable "eks_cluster_name" {
  description = "共有プラットフォーム EKS クラスタ名"
  type        = string
}

variable "vpc_id" {
  description = "共有プラットフォーム VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "プライベートサブネット ID（マルチ AZ）"
  type        = list(string)
}

variable "domain_name" {
  description = "サービスドメイン名"
  type        = string
}

# === モジュール呼出し ===

module "rds" {
  source = "./modules/rds"

  environment        = var.environment
  vpc_id             = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
}

module "elasticache" {
  source = "./modules/elasticache"

  environment        = var.environment
  vpc_id             = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
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

module "waf" {
  source = "./modules/waf"

  environment = var.environment
}

module "api_gateway" {
  source = "./modules/api-gateway"

  environment       = var.environment
  cognito_user_pool = module.cognito.user_pool_id
  waf_web_acl_arn   = module.waf.web_acl_arn
}

module "cloudfront" {
  source = "./modules/cloudfront"

  environment     = var.environment
  api_gateway_url = module.api_gateway.invoke_url
  domain_name     = var.domain_name
}

# === 出力 ===
output "rds_endpoint" {
  description = "RDS エンドポイント"
  value       = module.rds.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache Redis エンドポイント"
  value       = module.elasticache.endpoint
  sensitive   = true
}

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = module.api_gateway.invoke_url
}

output "cloudfront_domain" {
  description = "CloudFront ドメイン"
  value       = module.cloudfront.domain_name
}

output "cognito_user_pool_id" {
  description = "Cognito ユーザープール ID"
  value       = module.cognito.user_pool_id
}
