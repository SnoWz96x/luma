// Barra de título custom (janela Tauri sem bordas). Arrastável + botões.
// Usa a API GLOBAL do Tauri (window.__TAURI__), exposta por withGlobalTauri:true —
// mais robusta que import dinâmico (que o Vite externaliza e o webview não resolve).
import { isTauri } from "../repositories";

interface TauriWin {
  minimize(): Promise<void>;
  close(): Promise<void>;
  toggleMaximize(): Promise<void>;
}

function getWin(): TauriWin | null {
  const g = window as unknown as {
    __TAURI__?: { window?: { getCurrentWindow?: () => TauriWin } };
  };
  return g.__TAURI__?.window?.getCurrentWindow?.() ?? null;
}

export function TitleBar({ title }: { title: string }) {
  const tauri = isTauri();

  const act = (fn: (w: TauriWin) => Promise<void>) => () => {
    const w = getWin();
    if (w) void fn(w);
  };

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
            onClick={act((w) => w.minimize())}
            className="grid h-7 w-7 place-items-center rounded-lg text-luma-muted transition hover:bg-white/10"
            aria-label="Minimizar"
            title="Minimizar"
          >
            –
          </button>
          <button
            type="button"
            onClick={act((w) => w.toggleMaximize())}
            className="grid h-7 w-7 place-items-center rounded-lg text-luma-muted transition hover:bg-white/10"
            aria-label="Maximizar"
            title="Maximizar / restaurar"
          >
            ▢
          </button>
          <button
            type="button"
            onClick={act((w) => w.close())}
            className="grid h-7 w-7 place-items-center rounded-lg text-luma-muted transition hover:bg-red-400/40 hover:text-white"
            aria-label="Fechar"
            title="Fechar"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
