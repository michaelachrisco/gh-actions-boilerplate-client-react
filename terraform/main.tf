provider "aws" {
  # version = "4.8.0"
  profile = var.profile
  region  = var.region
  // Using the new SuperDev SSO profile we should no longer need this line - done!
}

// For our branch this should be pointed at the DevOps Sandbox Account
// This key and bucket should match our project tests here:
// https://github.com/Shift3/terraform-modules/blob/main/project-tests/boilerplate-client-react-angular/main.tf
// Ensure you deploy with your initials as a prefix: mw-boilerplate-client-react/terraform.tfstate
terraform {
  backend "s3" {
    bucket  = "new-devops-terraform-state"
    key     = "mw-test-boilerplate-client-react/terraform.tfstate"
    region  = "us-west-2"
    profile = "bwtc-devops-sandbox-sso"
  }
}

locals {
  workspace_name = terraform.workspace
}

// This module references a local module and should be changed to use the Git module references
// in our Terraform modules repo, for reference use the angular boilerplate: https://github.com/Shift3/boilerplate-client-angular/tree/main/terraform
// Reference Terraform modules repo project tests here: https://github.com/Shift3/terraform-modules/tree/main/project-tests/boilerplate-client-react-angular
// This will give you an idea of what variables are required, and difference resource ARNs you will need
module "cloudfront" {
  source                        = "git@github.com:Shift3/terraform-modules.git//modules/aws/cloudfront?ref=v1.2.1"
  web_domain_name               = var.web_domain_name
  profile                       = var.profile
  secure_response_headers_id    = var.secure_response_headers_id
  route53_zone                  = var.route53_zone
  environment                   = local.workspace_name
}