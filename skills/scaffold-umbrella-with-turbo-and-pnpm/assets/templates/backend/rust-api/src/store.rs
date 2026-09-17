use crate::error::AppError;
use chrono::Utc;
use rusqlite::Connection;
use serde::Serialize;
use std::{
    path::Path,
    sync::{Arc, Mutex},
};

#[derive(Clone)]
pub struct Store {
    db: Arc<Mutex<Connection>>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StoredValue {
    pub value: Option<f64>,
    pub updated_at: Option<String>,
}

impl Store {
    pub fn open(path: &str) -> Result<Self, AppError> {
        if let Some(parent) = Path::new(path).parent() {
            std::fs::create_dir_all(parent).map_err(|_| AppError::Store("create db dir"))?;
        }
        let conn = Connection::open(path).map_err(|_| AppError::Store("open sqlite"))?;
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS calculator_value (
              id INTEGER PRIMARY KEY CHECK (id = 1),
              value REAL NOT NULL,
              updated_at TEXT NOT NULL
            );",
        )
        .map_err(|_| AppError::Store("migrate"))?;
        Ok(Self {
            db: Arc::new(Mutex::new(conn)),
        })
    }

    pub fn ready(&self) -> bool {
        self.db
            .lock()
            .ok()
            .and_then(|db| db.query_row("SELECT 1", [], |_| Ok(())).ok())
            .is_some()
    }

    pub fn get(&self) -> Result<StoredValue, AppError> {
        let db = self.db.lock().map_err(|_| AppError::Store("db lock"))?;
        let row = db.query_row(
            "SELECT value, updated_at FROM calculator_value WHERE id = 1",
            [],
            |row| Ok((row.get::<_, f64>(0)?, row.get::<_, String>(1)?)),
        );
        match row {
            Ok((value, updated_at)) => Ok(StoredValue {
                value: Some(value),
                updated_at: Some(updated_at),
            }),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(StoredValue {
                value: None,
                updated_at: None,
            }),
            Err(_) => Err(AppError::Store("read failed")),
        }
    }

    pub fn put(&self, value: f64) -> Result<StoredValue, AppError> {
        let updated_at = Utc::now().to_rfc3339();
        let db = self.db.lock().map_err(|_| AppError::Store("db lock"))?;
        db.execute(
            "INSERT INTO calculator_value (id, value, updated_at)
             VALUES (1, ?1, ?2)
             ON CONFLICT(id) DO UPDATE SET
               value = excluded.value,
               updated_at = excluded.updated_at",
            rusqlite::params![value, updated_at],
        )
        .map_err(|_| AppError::Store("write failed"))?;
        Ok(StoredValue {
            value: Some(value),
            updated_at: Some(updated_at),
        })
    }
}
