provider "aws" {
  version = "4.8.0"
  profile = "${var.profile}"
  region  = "${var.region}"

  // Using the new SuperDev SSO profile we should no longer need this line
  assume_role {
    role_arn = var.assume_role_arn
  }
}

// For our branch this should be pointed at the DevOps Sandbox Account
// This key and bucket should match our project tests here:
// https://github.com/Shift3/terraform-modules/blob/main/project-tests/boilerplate-client-react-angular/main.tf
// Ensure you deploy with your initials as a prefix: mw-boilerplate-client-react/terraform.tfstate
terraform {
  backend "s3" {
    bucket  = "shift3-terraform-state"
    key     = "boilerplate-client-react/staging/terraform.tfstate"
    region  = "us-west-2"
    profile = "shift3"
  }
}

// This module references a local module and should be changed to use the Git module references
// in our Terraform modules repo, for reference use the angular boilerplate: https://github.com/Shift3/boilerplate-client-angular/tree/main/terraform
// Reference Terraform modules repo project tests here: https://github.com/Shift3/terraform-modules/tree/main/project-tests/boilerplate-client-react-angular
// This will give you an idea of what variables are required, and difference resource ARNs you will need
module "cloudfront" {
  source          = "../cloudfront"
  web_domain_name = var.web_domain_name
  assume_role_arn = var.assume_role_arn
}