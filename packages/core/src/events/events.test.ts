import { describe, it, expect } from "vitest";
import { activeEvent } from "./events.js";

describe("activeEvent", () => {
  it("Natal em 25/12", () => {
    expect(activeEvent(new Date(2026, 11, 25))?.id).toBe("christmas");
  });

  it("Halloween em 31/10", () => {
    expect(activeEvent(new Date(2026, 9, 31))?.id).toBe("halloween");
  });

  it("Ano Novo em 01/01", () => {
    expect(activeEvent(new Date(2026, 0, 1))?.id).toBe("new_year");
  });

  it("dia comum sem evento -> null", () => {
    expect(activeEvent(new Date(2026, 2, 15))).toBeNull();
  });

  it("aniversário do usuário tem prioridade", () => {
    const ev = activeEvent(new Date(2026, 9, 31), { userBirthday: "10-31" });
    expect(ev?.id).toBe("user_birthday");
  });

  it("aniversário do pet", () => {
    const ev = activeEvent(new Date(2026, 2, 15), { petBirthday: "03-15" });
    expect(ev?.id).toBe("pet_birthday");
  });

  it("evento tem saudação e emoji", () => {
    const ev = activeEvent(new Date(2026, 11, 25))!;
    expect(ev.greeting.length).toBeGreaterThan(0);
    expect(ev.emoji.length).toBeGreaterThan(0);
  });
});
