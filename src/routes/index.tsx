import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { AppOverlay } from "@/components/overlay/app-overlay";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [Scene, setScene] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    void import("@/components/scene/canvas-root").then((m) => {
      if (alive) setScene(() => m.CanvasRoot);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="relative h-dvh overflow-hidden bg-bg text-fg">
      {Scene ? (
        <Scene />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-muted">
            Se încarcă simularea 3D
          </p>
        </div>
      )}
      <AppOverlay />
    </main>
  );
}
