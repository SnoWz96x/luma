// Schema de validação (zod) do catálogo de personagens.
// Espelha CharacterDef de @luma/shared. Veja docs/05-CHARACTER-ENGINE.md
import { z } from "zod";
import type { CharacterDef } from "@luma/shared";

export const categorySchema = z.enum([
  "animal",
  "robot",
  "ghost",
  "plant",
  "dragon",
  "alien",
  "star",
  "slime",
  "cloud",
  "mushroom",
  "magical",
  "monster",
  "pixel-mascot",
  "minimal-mascot",
]);

export const raritySchema = z.enum([
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
]);

export const emotionSchema = z.enum([
  "happy",
  "calm",
  "curious",
  "sleepy",
  "comfort",
  "sad",
  "excited",
]);

export const characterDefSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  species: z.string().min(1),
  category: categorySchema,
  rarity: raritySchema,
  biome: z.string().min(1),
  archetype: z.string().min(1),
  personality: z.object({
    traits: z.array(z.string()).min(1),
    tone: z.string().min(1),
    energy: z.enum(["calm", "balanced", "lively"]),
  }),
  story: z.string().min(1),
  phrases: z.object({
    greeting: z.array(z.string()).min(1),
    idle: z.array(z.string()).min(1),
    happy: z.array(z.string()).min(1),
    sleepy: z.array(z.string()).min(1),
    missedYou: z.array(z.string()).min(1),
    encourage: z.array(z.string()).min(1),
  }),
  emotions: z.array(emotionSchema).min(1),
  preferences: z.object({
    likes: z.array(z.string()).min(1),
    dislikes: z.array(z.string()).min(1),
  }),
  animations: z.object({
    idle: z.string(),
    happy: z.string(),
    sleep: z.string(),
    curious: z.string(),
    comfort: z.string(),
  }),
  evolution: z.object({
    stages: z
      .array(
        z.object({
          id: z.number().int().nonnegative(),
          name: z.string().min(1),
          visual: z.string().min(1),
        }),
      )
      .min(1),
    triggers: z.array(
      z.object({
        trait: z.string().min(1),
        minWeight: z.number().min(0).max(1),
        branch: z.string().min(1),
      }),
    ),
  }),
}) satisfies z.ZodType<CharacterDef>;

export const catalogSchema = z.array(characterDefSchema);

/** Garante, em tempo de tipo, que o schema casa com CharacterDef. */
export type CharacterDefSchema = z.infer<typeof characterDefSchema>;
