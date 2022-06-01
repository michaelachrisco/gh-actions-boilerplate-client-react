provider "aws" {
  version = "4.8.0"
  profile = "${var.aws_profile}"
  region  = "${var.aws_region}"
}

terraform {
  backend "s3" {
    bucket  = "new-devops-terraform-state"
    key     = "ar-boilerplate-client-react/terraform.tfstate"
    region  = "us-west-2"
    profile = "devops-sandbox-admin"
  }
}

locals {
  workspace_name = "${terraform.workspace}"
}

module "cloudfront" {
  source                        = "git@github.com:Shift3/terraform-modules.git//modules/aws/cloudfront"
  web_domain_name               = var.web_domain_name
  profile                       = var.aws_profile
  secure_response_headers_id    = var.secure_response_headers_id
  route53_zone                  = var.route53_zone
}