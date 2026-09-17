pub mod config;
pub mod error;
pub mod routes;
pub mod store;

use axum::{routing::get, Router};
use routes::AppState;
use store::Store;

pub fn app(store: Store) -> Router {
    Router::new()
        .route("/healthz", get(routes::healthz))
        .route("/readyz", get(routes::readyz))
        .route("/value", get(routes::get_value).put(routes::put_value))
        .with_state(AppState { store })
}
