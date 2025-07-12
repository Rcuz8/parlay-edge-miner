resource "digitalocean_project_resources" "edge_project_resources" {
  project = var.do_project_id != "" ? var.do_project_id : env("DO_PROJECT_ID")

  resources = [
    digitalocean_container_registry.edge.urn,
    digitalocean_functions_function.edge_miner.urn,
  ]
}
