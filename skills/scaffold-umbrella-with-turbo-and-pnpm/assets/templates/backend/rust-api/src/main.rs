use example_calculator::{app, config::Config, store::Store};
use tokio::signal;

#[tokio::main]
async fn main() {
    let config = Config::from_env().expect("config");
    let store = Store::open(&config.sqlite_path).expect("sqlite");
    let listener = tokio::net::TcpListener::bind(("0.0.0.0", config.port))
        .await
        .expect("bind");
    axum::serve(listener, app(store))
        .with_graceful_shutdown(shutdown())
        .await
        .expect("serve");
}

async fn shutdown() {
    let ctrl_c = async {
        signal::ctrl_c().await.expect("ctrl_c");
    };
    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("sigterm")
            .recv()
            .await;
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();
    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}
