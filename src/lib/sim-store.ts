import { create } from "zustand";
import { STEPS } from "./sim-config";

export type Mode = "problem" | "solution";

type SimState = {
  intro: boolean;
  mode: Mode;
  step: number;
  playing: boolean;
  presenting: boolean;
  section: boolean;
  labels: boolean;
  photos: boolean;
  speed: number;
  time: number;
  cut: number;
  heat: number;
  chederOn: number;
  dismissIntro: () => void;
  setMode: (mode: Mode) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePlay: () => void;
  setPlaying: (v: boolean) => void;
  togglePresent: () => void;
  toggleSection: () => void;
  toggleLabels: () => void;
  togglePhotos: () => void;
  setSpeed: (v: number) => void;
  tick: (dt: number) => void;
  reset: () => void;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const useSim = create<SimState>((set, get) => ({
  intro: true,
  mode: "problem",
  step: 0,
  playing: true,
  presenting: false,
  section: false,
  labels: true,
  photos: false,
  speed: 1,
  time: 0,
  cut: 0,
  heat: 0,
  chederOn: 0,

  dismissIntro: () => set({ intro: false, playing: true }),

  setMode: (mode) => {
    if (mode === "solution") {
      set({
        mode,
        cut: 0,
        heat: 0,
        step: get().step < 4 ? 4 : get().step,
        section: true,
      });
    } else {
      set({ mode, chederOn: 0, step: get().step > 3 ? 2 : get().step });
    }
  },

  setStep: (step) => {
    const s = Math.max(0, Math.min(STEPS.length - 1, step));
    const mode: Mode = s >= 4 ? "solution" : "problem";
    set({
      step: s,
      mode,
      section: s === 2 || s === 4 || get().section,
      cut: s === 3 ? Math.max(get().cut, 0.15) : s > 3 ? 0 : get().cut,
    });
  },

  nextStep: () => get().setStep(get().step + 1),
  prevStep: () => get().setStep(get().step - 1),

  togglePlay: () => set({ playing: !get().playing }),
  setPlaying: (v) => set({ playing: v }),

  togglePresent: () => {
    const presenting = !get().presenting;
    set({
      presenting,
      playing: true,
      step: presenting ? 0 : get().step,
      mode: presenting ? "problem" : get().mode,
      cut: presenting ? 0 : get().cut,
      heat: presenting ? 0 : get().heat,
      chederOn: presenting ? 0 : get().chederOn,
      time: presenting ? 0 : get().time,
    });
  },

  toggleSection: () => set({ section: !get().section }),
  toggleLabels: () => set({ labels: !get().labels }),
  togglePhotos: () => set({ photos: !get().photos }),
  setSpeed: (v) => set({ speed: v }),

  tick: (dt) => {
    const d = Math.min(dt, 0.08);
    const st = get();
    if (!st.playing) return;

    const time = st.time + d * st.speed;
    let { cut, heat, chederOn, step, mode, presenting } = st;

    if (mode === "problem") {
      chederOn = Math.max(0, chederOn - d * 2.4);
      if (step >= 2) heat = clamp01(heat + d * 0.35);
      else heat = clamp01(heat - d * 0.2);
      if (step >= 3) cut = clamp01(cut + d * 0.22);
      else if (step < 3) cut = clamp01(cut - d * 0.15);
    } else {
      heat = clamp01(heat - d * 0.8);
      cut = clamp01(cut - d * 1.2);
      chederOn = clamp01(chederOn + d * 1.8);
    }

    if (presenting) {
      const dwell = [6.5, 7.2, 8.2, 8.8, 9.2, 10];
      let acc = 0;
      let next = step;
      for (let i = 0; i < dwell.length; i++) {
        acc += dwell[i];
        if (time < acc) {
          next = i;
          break;
        }
        next = i;
      }
      if (time > acc + 0.05) {
        set({ presenting: false, step: 5, mode: "solution" });
        return;
      }
      if (next !== step) {
        mode = next >= 4 ? "solution" : "problem";
        step = next;
      }
    }

    set({ time, cut, heat, chederOn, step, mode });
  },

  reset: () =>
    set({
      mode: "problem",
      step: 0,
      playing: true,
      presenting: false,
      section: false,
      time: 0,
      cut: 0,
      heat: 0,
      chederOn: 0,
    }),
}));
