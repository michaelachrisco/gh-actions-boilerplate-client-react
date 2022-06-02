variable "profile" {
  default     = "shift3"
  description = "Name of your profile inside ~/.aws/credentials"
}

variable "region" {
  default     = "us-west-2"
  description = "Defines where your app should be deployed"
}

variable "web_domain_name" {
  description = "Domain name for the s3 bucket"
}

variable "secure_response_headers_id" {
  description = "Security response header for the cloudfront module"
}

variable "route53_zone" {
  description = "Route53 Zone where our domain name lives"
}
