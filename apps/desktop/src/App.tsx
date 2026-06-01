import { useEffect, useState } from "react";
import { usePetStore, findCharacter } from "./stores/petStore";
import { useAppStore } from "./stores/appStore";
import { useChatStore } from "./stores/chatStore";
import { useProgressStore } from "./stores/progressStore";
import { useHabitsStore } from "./stores/habitsStore";
import { useShopStore } from "./stores/shopStore";
import { stageScale, stageLabel } from "@luma/core";
import { PetView } from "./components/PetView";
import { Scene } from "./components/Scene";
import { InteractionBar } from "./components/InteractionBar";
import { Onboarding } from "./components/Onboarding";
import { EggHatch } from "./components/EggHatch";
import { Chat } from "./components/Chat";
import { TitleBar } from "./components/TitleBar";
import { BadgesPanel } from "./components/BadgesPanel";
import { HabitsPanel } from "./components/HabitsPanel";
import { Breathing } from "./components/Breathing";
import { Fishing } from "./components/Fishing";
import { ShopPanel } from "./components/ShopPanel";
import { WorldScene } from "./components/WorldScene";
import { DiaryPanel } from "./components/DiaryPanel";
import { SupportPanel } from "./components/SupportPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { NarrativePanel } from "./components/NarrativePanel";
import { PetSpeech } from "./components/PetSpeech";
import { Celebration } from "./components/Celebration";
import { relationshipLabel } from "./lib/relationshipLabel";

type Tab =
  | "pet"
  | "chat"
  | "world"
  | "story"
  | "diary"
  | "habits"
  | "calm"
  | "fish"
  | "shop"
  | "support"
  | "badges"
  | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "pet", label: "🏡 Casa" },
  { id: "chat", label: "💬 Conversar" },
  { id: "world", label: "🌌 Mundo" },
  { id: "story", label: "📖 História" },
  { id: "diary", label: "📓 Diário" },
  { id: "habits", label: "🌿 Hábitos" },
  { id: "calm", label: "🫧 Respirar" },
  { id: "fish", label: "🎣 Pescar" },
  { id: "shop", label: "🎀 Loja" },
  { id: "support", label: "💛 Apoio" },
  { id: "badges", label: "🏆 Conquistas" },
  { id: "settings", label: "⚙️ Ajustes" },
];

function petLine(animation: string, name: string): string {
  switch (animation) {
    case "happy":
      return `${name} está radiante de te ver!`;
    case "sleep":
      return `${name} está cochilando... shh 💤`;
    case "curious":
      return `${name} está curioso com algo 👀`;
    case "comfort":
      return `${name} quer um aconchego 🫂`;
    default:
      return `${name} está tranquilo, no seu ritmo.`;
  }
}

function Home() {
  const { signals, hydrate, runTick, interact, setCharacter } = usePetStore();
  const { adoptedDefId, petName } = useAppStore();
  const relationship = useChatStore((s) => s.relationship);
  const growth = useProgressStore((s) => s.growth);
  const streak = useProgressStore((s) => s.streak);
  const care = useProgressStore((s) => s.care);
  const dailyCheckin = useProgressStore((s) => s.dailyCheckin);
  const sparks = useHabitsStore((s) => s.sparks);
  const skinColors = useShopStore((s) => s.skinColors());
  const [tab, setTab] = useState<Tab>("pet");

  const character = findCharacter(adoptedDefId);
  const rel = relationshipLabel(relationship);
  const scale = stageScale(growth.stage);

  useEffect(() => {
    if (adoptedDefId) setCharacter(adoptedDefId);
  }, [adoptedDefId, setCharacter]);

  useEffect(() => {
    void hydrate();
    dailyCheckin(); // conta o convívio do dia (alimenta crescimento + streak)
    const id = setInterval(runTick, 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrate, runTick]);

  // interações também alimentam o crescimento (pontos de cuidado)
  const handleInteract = (kind: Parameters<typeof interact>[0]) => {
    interact(kind);
    care(kind === "checkin" ? "checkin" : "interaction");
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-b from-luma-bg to-luma-bg0">
      <TitleBar title="LUMA" />
      <Celebration />

      {/* header do pet */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div>
          <h1 className="text-lg font-extrabold leading-none">{petName}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-luma-muted">
            {character.species.replace(/-/g, " ")}
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">
              {stageLabel(growth.stage)}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] text-luma-muted">
            <span aria-hidden>{rel.emoji}</span>
            {rel.text}
          </div>
          <div className="flex items-center gap-1.5">
            {streak.current > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-orange-300/20 bg-orange-400/10 px-2 py-0.5 text-[10px] text-orange-200">
                🔥 {streak.current}
              </span>
            )}
            <span className="flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-200">
              ✨ {sparks}
            </span>
          </div>
        </div>
      </div>

      {/* abas */}
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-3">
        {TABS.map((t) => (
          <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </TabButton>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4">
        {tab === "pet" && (
          <>
            <div className="min-h-0 flex-1">
              <Scene signals={signals}>
                <div className="flex flex-col items-center gap-2">
                  <PetView
                    character={character}
                    signals={signals}
                    size={184}
                    scale={scale}
                    skinColors={skinColors}
                    stage={growth.stage}
                    branch={growth.branch}
                    onPet={() => handleInteract("comfort")}
                  />
                  <p className="max-w-xs text-center text-sm text-luma-ink/90">
                    {petLine(signals.animation, petName)}
                  </p>
                  <PetSpeech />
                </div>
              </Scene>
            </div>
            <InteractionBar onAction={handleInteract} />
          </>
        )}

        {tab === "chat" && (
          <div className="min-h-0 flex-1">
            <Chat
              character={character}
              petName={petName}
              onEmotion={() => handleInteract("talk")}
            />
          </div>
        )}

        {tab === "world" && (
          <div className="min-h-0 flex-1">
            <WorldScene />
          </div>
        )}

        {tab === "story" && (
          <div className="min-h-0 flex-1">
            <NarrativePanel />
          </div>
        )}

        {tab === "diary" && (
          <div className="min-h-0 flex-1">
            <DiaryPanel />
          </div>
        )}

        {tab === "habits" && (
          <div className="min-h-0 flex-1">
            <HabitsPanel />
          </div>
        )}

        {tab === "calm" && (
          <div className="min-h-0 flex-1">
            <Breathing />
          </div>
        )}

        {tab === "fish" && (
          <div className="min-h-0 flex-1">
            <Fishing />
          </div>
        )}

        {tab === "shop" && (
          <div className="min-h-0 flex-1">
            <ShopPanel />
          </div>
        )}

        {tab === "support" && (
          <div className="min-h-0 flex-1">
            <SupportPanel />
          </div>
        )}

        {tab === "badges" && (
          <div className="min-h-0 flex-1">
            <BadgesPanel />
          </div>
        )}

        {tab === "settings" && (
          <div className="min-h-0 flex-1">
            <SettingsPanel />
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-gradient-to-r from-luma-accent to-luma-accent2 text-luma-bg0 shadow-glow"
          : "border border-white/10 bg-white/[0.05] text-luma-muted hover:bg-white/[0.1]"
      }`}
    >
      {children}
    </button>
  );
}

export default function App() {
  const phase = useAppStore((s) => s.phase);
  const hatched = useAppStore((s) => s.hatched);
  const hatch = useAppStore((s) => s.hatch);
  const adoptedDefId = useAppStore((s) => s.adoptedDefId);
  const petName = useAppStore((s) => s.petName);

  if (phase === "onboarding") return <Onboarding />;

  // ritual de nascimento: após adotar, choca o ovo antes de entrar na Casa
  if (!hatched && adoptedDefId) {
    return (
      <EggHatch
        character={findCharacter(adoptedDefId)}
        petName={petName}
        onHatched={hatch}
      />
    );
  }

  return <Home />;
}
