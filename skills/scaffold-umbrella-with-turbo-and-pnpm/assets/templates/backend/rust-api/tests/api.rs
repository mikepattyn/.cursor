use example_calculator::{app, store::Store};
use http_body_util::BodyExt;
use tower::ServiceExt;

#[tokio::test]
async fn empty_get_then_put() {
    let dir = std::env::temp_dir().join(format!("calc-{}", std::process::id()));
    let _ = std::fs::create_dir_all(&dir);
    let db = dir.join("calculator.db");
    let store = Store::open(db.to_str().unwrap()).unwrap();
    let app = app(store);

    let get = app
        .clone()
        .oneshot(
            axum::http::Request::builder()
                .uri("/value")
                .body(axum::body::Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(get.status(), 200);
    let bytes = get.into_body().collect().await.unwrap().to_bytes();
    let json: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert!(json["value"].is_null());

    let put = app
        .oneshot(
            axum::http::Request::builder()
                .method("PUT")
                .uri("/value")
                .header("content-type", "application/json")
                .body(axum::body::Body::from(r#"{"value":7}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(put.status(), 200);
}
