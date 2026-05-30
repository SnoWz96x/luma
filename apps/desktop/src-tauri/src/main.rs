// Ponto de entrada do binário. A lógica fica em lib.rs (padrão Tauri v2).
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    luma_desktop_lib::run()
}
