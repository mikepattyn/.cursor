use crate::{error::AppError, store::Store};
use axum::{extract::State, http::StatusCode, Json};
use serde::Deserialize;

#[derive(Clone)]
pub struct AppState {
    pub store: Store,
}

#[derive(Deserialize)]
pub struct ValueBody {
    pub value: f64,
}

pub async fn healthz() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok" }))
}

pub async fn readyz(State(state): State<AppState>) -> Result<Json<serde_json::Value>, StatusCode> {
    if state.store.ready() {
        Ok(Json(serde_json::json!({ "status": "ok" })))
    } else {
        Err(StatusCode::SERVICE_UNAVAILABLE)
    }
}

pub async fn get_value(State(state): State<AppState>) -> Result<Json<crate::store::StoredValue>, AppError> {
    Ok(Json(state.store.get()?))
}

pub async fn put_value(
    State(state): State<AppState>,
    Json(body): Json<ValueBody>,
) -> Result<Json<crate::store::StoredValue>, AppError> {
    Ok(Json(state.store.put(body.value)?))
}
