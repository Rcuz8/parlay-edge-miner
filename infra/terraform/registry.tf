resource "digitalocean_container_registry" "edge" {
  name                   = "parlay-edge"
  region                 = "nyc3"
  subscription_tier_slug = "starter"
}
