// Tradução: estados vitais (números internos) -> SINAIS SENSORIAIS.
// O usuário SENTE (luz, clima, ritmo, animação), nunca lê "Humor 70%".
// Veja docs/01-ARQUITETURA.md (seção 6) e docs/09-ARTE.md.
import type { VitalState, SensorySignals } from "@luma/shared";

const norm = (v: number) => Math.max(0, Math.min(1, v / 100));

export function toSensorySignals(state: VitalState): SensorySignals {
  const energy = norm(state.energy);
  const mood = norm(state.mood);
  const sleep = norm(state.sleep);
  const curiosity = norm(state.curiosity);
  const comfort = norm(state.comfort);
  const bond = norm(state.bond);

  // Animação dominante (prioridade por necessidade).
  let animation: SensorySignals["animation"] = "idle";
  if (sleep < 0.25 || energy < 0.2) animation = "sleep";
  else if (comfort < 0.3) animation = "comfort";
  else if (mood > 0.7) animation = "happy";
  else if (curiosity > 0.7) animation = "curious";

  // Luz: combina energia e humor.
  const light = Math.max(0.15, 0.5 * energy + 0.5 * mood);

  // Clima do mundo derivado do humor (sem números).
  let weather: SensorySignals["weather"] = "clear";
  if (mood < 0.35) weather = "soft_rain";
  else if (mood < 0.2) weather = "rain";
  else if (mood > 0.8 && energy > 0.6) weather = "sunny";

  // Paleta: humor alto -> quente; humor baixo -> fria.
  const palette: SensorySignals["palette"] =
    mood > 0.6 ? "warm" : mood < 0.4 ? "cool" : "neutral";

  // Ritmo de movimento (energia + curiosidade).
  const pace = Math.max(0.1, 0.6 * energy + 0.4 * curiosity);

  // Proximidade do pet à tela: vínculo.
  const closeness = bond;

  return { animation, light, weather, palette, pace, closeness };
}
