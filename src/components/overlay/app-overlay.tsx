import {
  ChevronLeft,
  ChevronRight,
  Images,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Scissors,
  Shield,
  Tag,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SectionDiagram } from "./section-diagram";
import { PHOTOS, STEPS } from "@/lib/sim-config";
import { useSim } from "@/lib/sim-store";
import { cn } from "@/lib/utils";

export function Intro() {
  const dismiss = useSim((s) => s.dismissIntro);
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-end justify-center bg-bg p-4 md:items-center">
      <div className="max-w-xl rounded-xl border border-border bg-surface p-6 shadow-lg md:p-8">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-danger">
          Holcim România · Internship Expediție
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-fg md:text-4xl text-balance">
          Compensatori site Niagara
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted text-pretty">
          Simulare 3D a problemei reale din fabrică: muchia ascuțită a tubulaturii taie compensatorul sub vibrație.
          Soluția: cheder profil U cu perete metalic și dinți, montat pe ambele buze — sus și jos — sub compensator.
        </p>
        <ul className="mt-5 grid gap-2 text-sm text-fg">
          <li className="flex gap-2">
            <Scissors className="mt-0.5 size-4 shrink-0 text-danger" />
            Fără cheder: oțel pe cauciuc, forfecare, gol în perete.
          </li>
          <li className="flex gap-2">
            <Shield className="mt-0.5 size-4 shrink-0 text-ok" />
            Cu cheder: compensatorul freacă pe muchia îmbrăcată, nu pe oțel.
          </li>
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={dismiss} className="min-h-11">
            Intră în simulare
          </Button>
          <p className="self-center text-xs text-subtle">Juncu Emilian Gabriel · 1 iul. – 30 sept.</p>
        </div>
      </div>
    </div>
  );
}

export function AppOverlay() {
  const intro = useSim((s) => s.intro);
  const mode = useSim((s) => s.mode);
  const step = useSim((s) => s.step);
  const playing = useSim((s) => s.playing);
  const presenting = useSim((s) => s.presenting);
  const section = useSim((s) => s.section);
  const labels = useSim((s) => s.labels);
  const photos = useSim((s) => s.photos);
  const cut = useSim((s) => s.cut);
  const heat = useSim((s) => s.heat);
  const speed = useSim((s) => s.speed);
  const s = STEPS[step];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const st = useSim.getState();
      if (st.intro) {
        if (e.code === "Enter" || e.code === "Space") st.dismissIntro();
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        st.togglePlay();
      } else if (e.code === "ArrowRight") st.nextStep();
      else if (e.code === "ArrowLeft") st.prevStep();
      else if (e.key === "1") st.setMode("problem");
      else if (e.key === "2") st.setMode("solution");
      else if (e.key === "s" || e.key === "S") st.toggleSection();
      else if (e.key === "p" || e.key === "P") st.togglePhotos();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {intro ? <Intro /> : null}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 md:p-4">
        <div className="pointer-events-auto rounded-lg border border-border bg-surface/90 px-3 py-2 backdrop-blur-sm">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-danger">Holcim România</p>
          <p className="font-display text-sm font-semibold tracking-tight text-fg">Cheder Niagara · 3D</p>
        </div>
        <div className="pointer-events-auto hidden items-center gap-2 md:flex">
          <Button size="sm" variant={mode === "problem" ? "danger" : "outline"} onClick={() => useSim.getState().setMode("problem")}>
            <Scissors className="size-3.5" />
            Problemă
          </Button>
          <Button size="sm" variant={mode === "solution" ? "ok" : "outline"} onClick={() => useSim.getState().setMode("solution")}>
            <Shield className="size-3.5" />
            Soluție
          </Button>
        </div>
      </header>

      <aside className="pointer-events-none absolute bottom-24 left-3 top-20 z-20 hidden w-[min(100%,20rem)] flex-col gap-3 md:flex lg:w-80">
        <div className="pointer-events-auto overflow-hidden rounded-lg border border-border bg-surface/92 backdrop-blur-sm">
          <div className="border-b border-border px-3 py-2">
            <p className="font-display text-[10px] uppercase tracking-[0.18em] text-muted">{s?.kicker}</p>
            <h2 className="font-display text-lg font-semibold tracking-tight text-fg text-balance">{s?.title}</h2>
          </div>
          <p className="px-3 py-3 text-sm leading-relaxed text-muted text-pretty">{s?.body}</p>
          <ol className="border-t border-border p-2">
            {STEPS.map((st) => (
              <li key={st.id}>
                <button
                  type="button"
                  onClick={() => useSim.getState().setStep(st.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                    st.id === step ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg",
                  )}
                >
                  <span className="font-display tabular-nums text-subtle">0{st.id + 1}</span>
                  {st.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="pointer-events-auto rounded-lg border border-border bg-surface/92 p-3 backdrop-blur-sm">
          <SectionDiagram />
        </div>
      </aside>

      <aside className="pointer-events-none absolute right-3 top-20 z-20 hidden w-52 flex-col gap-2 lg:flex">
        <div className="pointer-events-auto rounded-lg border border-border bg-surface/92 p-3 backdrop-blur-sm">
          <p className="font-display text-[10px] uppercase tracking-[0.16em] text-muted">Stare racord</p>
          <Meter label="Frecare muchie" value={mode === "problem" ? heat : 0} tone="danger" />
          <Meter label="Tăiere compensator" value={mode === "problem" ? cut : 0} tone="danger" />
          <Meter label="Acoperire cheder" value={mode === "solution" ? 1 : 0} tone="ok" />
          <p className="mt-2 text-[11px] leading-snug text-subtle">
            {mode === "problem"
              ? "Contact oțel–cauciuc la buza superioară și inferioară."
              : "Cheder pe ambele muchii. Colierele rămân peste compensator."}
          </p>
        </div>
      </aside>

      {photos ? <PhotoDrawer /> : null}

      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 md:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-5xl flex-col gap-2 rounded-lg border border-border bg-surface/92 p-2 backdrop-blur-sm md:flex-row md:items-center">
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" aria-label="Pasul anterior" onClick={() => useSim.getState().prevStep()}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label={playing ? "Pauză" : "Redare"}
              onClick={() => useSim.getState().togglePlay()}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </Button>
            <Button size="icon" variant="ghost" aria-label="Pasul următor" onClick={() => useSim.getState().nextStep()}>
              <ChevronRight className="size-4" />
            </Button>
            <Button size="sm" variant={presenting ? "primary" : "outline"} onClick={() => useSim.getState().togglePresent()}>
              {presenting ? "Stop tur" : "Tur prezentare"}
            </Button>
          </div>
          <div className="hidden h-8 w-px bg-border md:block" />
          <div className="flex flex-wrap items-center gap-1">
            <Button size="sm" variant={section ? "primary" : "ghost"} onClick={() => useSim.getState().toggleSection()}>
              <Layers className="size-3.5" />
              Secțiune
            </Button>
            <Button size="sm" variant={labels ? "primary" : "ghost"} onClick={() => useSim.getState().toggleLabels()}>
              <Tag className="size-3.5" />
              Etichete
            </Button>
            <Button size="sm" variant={photos ? "primary" : "ghost"} onClick={() => useSim.getState().togglePhotos()}>
              <Images className="size-3.5" />
              Foto teren
            </Button>
            <Button size="sm" variant="ghost" onClick={() => useSim.getState().reset()}>
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>
          <label className="ml-auto flex items-center gap-2 px-2 text-[11px] text-muted">
            Tempo
            <input
              type="range"
              min={0.4}
              max={2}
              step={0.1}
              value={speed}
              onChange={(e) => useSim.getState().setSpeed(Number(e.target.value))}
              className="w-24 accent-fg"
            />
          </label>
          <div className="flex gap-1 md:hidden">
            <Button size="sm" variant={mode === "problem" ? "danger" : "outline"} onClick={() => useSim.getState().setMode("problem")}>
              Problemă
            </Button>
            <Button size="sm" variant={mode === "solution" ? "ok" : "outline"} onClick={() => useSim.getState().setMode("solution")}>
              Soluție
            </Button>
          </div>
        </div>
        <p className="mt-2 hidden text-center text-[10px] uppercase tracking-[0.16em] text-subtle md:block">
          Orbită cu mouse-ul · pinch pe telefon · Expediție · Cost reduction
        </p>
      </footer>

      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 px-3 md:hidden">
        <div className="rounded-lg border border-border bg-surface/92 p-3 backdrop-blur-sm">
          <p className="font-display text-[10px] uppercase tracking-[0.16em] text-muted">{s?.kicker}</p>
          <p className="font-display text-base font-semibold text-fg">{s?.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{s?.body}</p>
        </div>
      </div>
    </div>
  );
}

function Meter({ label, value, tone }: { label: string; value: number; tone: "danger" | "ok" }) {
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-subtle">
        <span>{label}</span>
        <span className="tabular-nums">{Math.round(value * 100)}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-elevated">
        <div
          className={cn("h-full rounded-full", tone === "danger" ? "bg-danger" : "bg-ok")}
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}

function PhotoDrawer() {
  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-24 z-30 mx-auto max-h-[45vh] max-w-5xl overflow-auto rounded-lg border border-border bg-surface/95 p-3 backdrop-blur-sm md:bottom-28">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-muted">Foto din fabrică</p>
        <Button size="sm" variant="ghost" onClick={() => useSim.getState().togglePhotos()}>
          Închide
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {PHOTOS.map((p) => (
          <figure key={p.src} className="overflow-hidden rounded-md border border-border bg-elevated">
            <img src={p.src} alt={p.caption} className="h-28 w-full object-cover md:h-36" />
            <figcaption className="px-2 py-1.5">
              <span className={cn("text-[10px] uppercase tracking-wider", p.tag === "Soluție" ? "text-ok" : "text-danger")}>
                {p.tag}
              </span>
              <p className="text-[11px] leading-snug text-muted">{p.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
