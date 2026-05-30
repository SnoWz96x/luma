// LUMA Desktop — lógica de inicialização (Tauri v2).
// Janela transparente, sempre-no-topo (desktop pet). Persistência: SQLite local.
use tauri_plugin_sql::{Builder as SqlBuilder, Migration, MigrationKind};

fn migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "schema inicial do LUMA",
        sql: include_str!("../../../../packages/db/sqlite/schema.sql"),
        kind: MigrationKind::Up,
    }]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            SqlBuilder::default()
                .add_migrations("sqlite:luma.db", migrations())
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("erro ao iniciar o LUMA");
}
