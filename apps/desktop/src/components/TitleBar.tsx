// Barra de título custom (janela Tauri sem bordas). Arrastável + botões.
// No browser (dev) os botões de janela ficam ocultos.
import { isTauri } from "../repositories";

async function win() {
  // import dinâmico: API só existe no contexto Tauri
  const pkg = ["@tauri-apps", "api/window"].join("/");
  const mod = (await import(/* @vite-ignore */ pkg)) as {
    getCurrentWindow: () => {
      minimize(): Promise<void>;
      close(): Promise<void>;
    };
  };
  return mod.getCurrentWindow();
}

export function TitleBar({ title }: { title: string }) {
  const tauri = isTauri();
  return (
    <div
      data-tauri-drag-region
      className="flex items-center justify-between px-3 py-2"
    >
      <div className="flex items-center gap-2" data-tauri-drag-region>
        <span className="text-base">🌙</span>
        <span className="text-xs font-semibold tracking-wide text-luma-muted">
          {title}
        </span>
      </div>
      {tauri && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => void win().then((w) => w.minimize())}
            className="grid h-6 w-6 place-items-center rounded-lg text-luma-muted transition hover:bg-white/10"
            aria-label="Minimizar"
          >
            –
          </button>
          <button
            type="button"
            onClick={() => void win().then((w) => w.close())}
            className="grid h-6 w-6 place-items-center rounded-lg text-luma-muted transition hover:bg-red-400/30 hover:text-white"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
