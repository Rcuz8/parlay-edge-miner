resource "digitalocean_functions_function" "edge_miner" {
  name               = "edge-mine"
  runtime            = "node-js18"
  region             = "nyc"
  source_archive_url = "docker://registry.digitalocean.com/parlay-edge/edge:${var.image_tag}"

  triggers = [{
    type = "scheduled"
    cron = "0 15 * * *"
  }]

  secrets = {
    OPENAI_API_KEY = var.openai_key
    ODDS_API_KEY   = var.odds_key
    TWILIO_SID     = var.twilio_sid
    TWILIO_TOKEN   = var.twilio_token
    TWILIO_FROM    = var.twilio_from
    TWILIO_TO      = var.twilio_to
  }
}
