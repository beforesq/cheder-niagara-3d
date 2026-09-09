import { useSim } from "@/lib/sim-store";

export function SectionDiagram() {
  const mode = useSim((s) => s.mode);
  const solution = mode === "solution";

  return (
    <svg viewBox="0 0 280 220" className="h-auto w-full" aria-hidden>
      <text x="140" y="16" textAnchor="middle" fill="currentColor" className="text-muted" fontSize="9" letterSpacing="1.6">
        SECȚIUNE · MUCHIE TUBULATURĂ
      </text>
      {/* pipe wall */}
      <rect x="118" y="40" width="18" height="150" fill="#8b929a" />
      <rect x="118" y="40" width="18" height="150" fill="none" stroke="#d5dbe2" strokeWidth="0.8" />
      <text x="70" y="120" fill="#8b929a" fontSize="8" textAnchor="end">
        ȚEAVĂ
      </text>
      <line x1="74" y1="122" x2="116" y2="122" stroke="#8b929a" strokeWidth="0.7" />

      {solution ? (
        <>
          <path
            d="M108 86 h-10 v44 h10 v-8 h8 v-28 h-8 z"
            fill="#2a4a82"
            stroke="#7ea2e0"
            strokeWidth="1"
          />
          <path
            d="M136 86 h10 v44 h-10 v-8 h-8 v-28 h8 z"
            fill="#2a4a82"
            stroke="#7ea2e0"
            strokeWidth="1"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <polygon points={`108,${94 + i * 7} 102,${97 + i * 7} 108,${100 + i * 7}`} fill="#d7dde4" />
              <polygon points={`136,${94 + i * 7} 142,${97 + i * 7} 136,${100 + i * 7}`} fill="#d7dde4" />
            </g>
          ))}
          <path d="M96 78 h52 v12 h-52 z" fill="#2a4a82" opacity="0.9" />
          <path d="M88 52 h68 v28 h-8 v-16 h-52 v16 h-8 z" fill="#3c4148" stroke="#9aa3ac" strokeWidth="1.2" />
          <text x="210" y="64" fill="#9ec5a0" fontSize="8">
            COMPENSATOR
          </text>
          <line x1="156" y1="62" x2="208" y2="62" stroke="#9ec5a0" strokeWidth="0.8" />
          <text x="210" y="108" fill="#7ea2e0" fontSize="8">
            CHEDER U + DINȚI
          </text>
          <line x1="148" y1="106" x2="208" y2="106" stroke="#7ea2e0" strokeWidth="0.8" />
          <text x="140" y="210" textAnchor="middle" fill="#9ec5a0" fontSize="8">
            Frecare pe cheder, nu pe oțel
          </text>
        </>
      ) : (
        <>
          <path d="M88 52 h68 v28 h-8 v-16 h-52 v16 h-8 z" fill="#3c4148" stroke="#c8102e" strokeWidth="1.4" />
          <path d="M118 86 h18" stroke="#c8102e" strokeWidth="2.4" />
          <text x="210" y="64" fill="#e8e4dc" fontSize="8">
            COMPENSATOR
          </text>
          <line x1="156" y1="62" x2="208" y2="62" stroke="#e8e4dc" strokeWidth="0.8" />
          <text x="210" y="96" fill="#c8102e" fontSize="8">
            MUCHIE ASCUȚITĂ
          </text>
          <line x1="138" y1="88" x2="208" y2="94" stroke="#c8102e" strokeWidth="0.8" />
          <text x="140" y="210" textAnchor="middle" fill="#c8102e" fontSize="8">
            Oțel pe cauciuc → tăiere
          </text>
        </>
      )}
    </svg>
  );
}
