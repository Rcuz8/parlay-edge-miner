variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "openai_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
}

variable "odds_key" {
  description = "The Odds API key"
  type        = string
  sensitive   = true
}

variable "twilio_sid" {
  description = "Twilio SID"
  type        = string
  sensitive   = true
}

variable "twilio_token" {
  description = "Twilio Auth Token"
  type        = string
  sensitive   = true
}

variable "twilio_from" {
  description = "Twilio from number"
  type        = string
}

variable "twilio_to" {
  description = "Subscriber number"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag for function"
  type        = string
}
