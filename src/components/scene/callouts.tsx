import { Html } from "@react-three/drei";
import { CFG } from "@/lib/sim-config";
import { useSim } from "@/lib/sim-store";

function Tag({
  position,
  title,
  sub,
  tone = "steel",
}: {
  position: [number, number, number];
  title: string;
  sub?: string;
  tone?: "steel" | "danger" | "ok" | "blue";
}) {
  const toneClass =
    tone === "danger"
      ? "border-danger/50 text-danger"
      : tone === "ok"
        ? "border-ok/50 text-ok"
        : tone === "blue"
          ? "border-cheder/50 text-cheder-bright"
          : "border-border text-fg";
  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      zIndexRange={[8, 0]}
      occlude={false}
      pointerEvents="none"
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`pointer-events-none whitespace-nowrap rounded-sm border bg-bg/85 px-2 py-1 backdrop-blur-sm ${toneClass}`}
      >
        <div className="font-display text-[10px] font-semibold uppercase tracking-[0.14em]">{title}</div>
        {sub ? <div className="text-[9px] text-muted">{sub}</div> : null}
      </div>
    </Html>
  );
}

export function Callouts() {
  const labels = useSim((s) => s.labels);
  const mode = useSim((s) => s.mode);
  const step = useSim((s) => s.step);
  if (!labels) return null;

  return (
    <group>
      <Tag position={[0.95, CFG.upperRimY + 0.85, 0]} title="Tubulatură superioară" sub="statică · fabrică" />
      <Tag
        position={[0.95, 0.05, 0.1]}
        title="Compensator flexibil"
        sub="de la țeava de sus până la țeava de jos"
        tone={mode === "problem" && step >= 3 ? "danger" : "steel"}
      />
      {mode === "problem" ? (
        <Tag
          position={[0.85, CFG.lowerRimY, 0.15]}
          title="Muchie ascuțită"
          sub="oțel pe cauciuc · forfecare"
          tone="danger"
        />
      ) : (
        <>
          <Tag
            position={[0.88, CFG.lowerRimY, 0.12]}
            title="Cheder jos"
            sub="profil U · dinți pe muchie"
            tone="blue"
          />
          <Tag
            position={[0.88, CFG.upperRimY, 0.12]}
            title="Cheder sus"
            sub="identic, sub compensator"
            tone="blue"
          />
        </>
      )}
      <Tag position={[0.7, CFG.lowerRimY + 0.055, 0.55]} title="Colier" sub="peste compensator" />
      <Tag
        position={[1.35, CFG.lowerRimY - CFG.lowerPipeH - 0.15, 0.4]}
        title="Sită Niagara"
        sub="sursa vibrației"
        tone="ok"
      />
    </group>
  );
}
