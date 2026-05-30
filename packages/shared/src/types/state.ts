// Estados vitais e sinais sensoriais. Veja docs/01-ARQUITETURA.md (sem barras).

/** Valor interno 0..100. NUNCA exibido como número ao usuário. */
export type Vital = number;

/** Os 8 estados da Tamagotchi Engine. */
export interface VitalState {
  energy: Vital;
  mood: Vital;
  curiosity: Vital;
  bond: Vital;
  comfort: Vital;
  trust: Vital;
  sleep: Vital;
  progress: Vital;
}

export type VitalKey = keyof VitalState;

/**
 * Tradução dos estados internos em SINAIS SENSORIAIS (o usuário sente, não lê).
 * Veja docs/01-ARQUITETURA.md seção 6.
 */
export interface SensorySignals {
  /** animação dominante do pet */
  animation: "idle" | "happy" | "sleep" | "curious" | "comfort";
  /** intensidade de luz 0..1 (energia/humor) */
  light: number;
  /** clima do mundo */
  weather: "clear" | "soft_rain" | "rain" | "stars" | "sunny";
  /** temperatura de cor da paleta: "warm" | "neutral" | "cool" */
  palette: "warm" | "neutral" | "cool";
  /** ritmo de movimento 0..1 (lento↔animado) */
  pace: number;
  /** proximidade do pet à tela 0..1 (vínculo) */
  closeness: number;
}
