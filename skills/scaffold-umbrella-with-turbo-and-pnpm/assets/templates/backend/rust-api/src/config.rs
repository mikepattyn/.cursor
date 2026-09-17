use std::env;

#[derive(Clone)]
pub struct Config {
    pub sqlite_path: String,
    pub port: u16,
}

impl Config {
    pub fn from_env() -> Result<Self, String> {
        let sqlite_path = env::var("SQLITE_PATH").unwrap_or_else(|_| "/data/calculator.db".into());
        let port = env::var("PORT")
            .ok()
            .map(|raw| raw.parse::<u16>().map_err(|_| format!("invalid PORT: {raw}")))
            .transpose()?
            .unwrap_or(8081);
        Ok(Self { sqlite_path, port })
    }
}
