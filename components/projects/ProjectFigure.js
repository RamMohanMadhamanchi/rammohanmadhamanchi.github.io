import { cx } from "@/lib/content";

/**
 * Line illustrations for project showcases and case study headers —
 * drawn diagrams, not screenshots. The active state (`card-on:` —
 * the parent `.group` is hovered or focused) animates each one:
 *   agents     orchestration lines light up and data flows
 *   nl2sql     a requirement is compiled into SQL
 *   pipeline   records flow from the EHR store to the cloud
 *   excavator  the boom raises about its pivot
 *   helmet     the detection box locks on
 *   v2v        vehicles broadcast to each other
 */
export function ProjectFigure({ kind, className }) {
  const Figure = FIGURES[kind] || Agents;
  return (
    <svg viewBox="0 0 600 400" className={cx("block h-auto w-full", className)} aria-hidden="true">
      <Figure />
    </svg>
  );
}

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.25 };
const thin = { ...line, strokeWidth: 0.75, opacity: 0.55 };
const center = { fill: "none", stroke: "var(--color-signal)", strokeWidth: 0.8, strokeDasharray: "12 4 2 4" };
const ink = { fill: "var(--color-ink)" };
const mono = (size = 11) => ({ font: `500 ${size}px var(--font-mono)`, letterSpacing: "0.1em" });
const ease = "duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]";
const flowOnActive = "flow-line opacity-0 transition-opacity duration-500 card-on:opacity-100";

function Caption({ children }) {
  return (
    <text x="40" y="370" fill="currentColor" opacity="0.55" style={mono()}>
      {children}
    </text>
  );
}

function Agents() {
  const agents = [150, 300, 450];
  return (
    <g>
      {/* orchestrator */}
      <rect x="220" y="46" width="160" height="50" {...line} {...ink} />
      <text x="300" y="76" textAnchor="middle" fill="currentColor" style={mono(10)}>ORCHESTRATOR</text>
      {agents.map((x) => (
        <path key={x} d={`M300 96V120H${x}V160`} {...line} strokeDasharray="4 4" opacity="0.6" />
      ))}
      {agents.map((x) => (
        <path key={`f${x}`} d={`M300 96V120H${x}V160`} fill="none" stroke="var(--color-signal)" strokeWidth="2.5" className={flowOnActive} />
      ))}
      {/* agents */}
      {agents.map((x, i) => (
        <g key={x}>
          <rect x={x - 55} y="160" width="110" height="56" {...line} {...ink} />
          <rect
            x={x - 55}
            y="160"
            width="110"
            height="56"
            fill="var(--color-signal-wash)"
            stroke="var(--color-signal)"
            className="opacity-0 transition-opacity duration-500 card-on:opacity-100"
            style={{ transitionDelay: `${i * 120}ms` }}
          />
          <text x={x} y="193" textAnchor="middle" fill="currentColor" style={mono(10)}>
            {["PARSE", "GENERATE", "VALIDATE"][i]}
          </text>
        </g>
      ))}
      {/* data path */}
      <path d="M40 250H560" {...thin} />
      <path d="M40 250H560" fill="none" stroke="var(--color-signal)" strokeWidth="2.5" className={flowOnActive} />
      {agents.map((x) => (
        <path key={`d${x}`} d={`M${x} 216V250`} {...thin} />
      ))}
      {/* document in, SQL out */}
      <path d="M40 270h40l14 14v50H40z M80 270v14h14" {...line} {...ink} />
      <path d="M50 300h32M50 310h32M50 320h20" {...thin} />
      <rect x="470" y="270" width="90" height="64" {...line} {...ink} />
      <text x="480" y="292" fill="var(--color-signal)" style={mono(9)}>SELECT</text>
      <path d="M480 304h60M480 316h44" {...thin} />
      <Caption>AI-01 · MULTI-AGENT SQL</Caption>
    </g>
  );
}

function Nl2Sql() {
  return (
    <g>
      {/* requirement */}
      <rect x="40" y="110" width="170" height="120" {...line} {...ink} />
      <text x="54" y="134" fill="currentColor" opacity="0.6" style={mono(9)}>REQUIREMENT</text>
      <path d="M54 154h130M54 170h110M54 186h124M54 202h80" {...thin} />
      {/* model */}
      <path d="M300 110l52 30v60l-52 30-52-30v-60z" {...line} {...ink} />
      <path
        d="M300 110l52 30v60l-52 30-52-30v-60z"
        fill="var(--color-signal-wash)"
        stroke="var(--color-signal)"
        className="opacity-0 transition-opacity duration-500 card-on:opacity-100"
      />
      <text x="300" y="175" textAnchor="middle" fill="currentColor" style={mono(9)}>CORTEX</text>
      <path d="M210 170H248M352 170H390" {...line} />
      <path d="M210 170H248M352 170H390" fill="none" stroke="var(--color-signal)" strokeWidth="2.5" className={flowOnActive} />
      {/* SQL */}
      <rect x="390" y="96" width="170" height="148" {...line} {...ink} />
      {["SELECT", "FROM", "WHERE", "GROUP BY"].map((kw, i) => (
        <g key={kw} className={cx("transition-opacity", ease, "opacity-40 card-on:opacity-100")} style={{ transitionDelay: `${150 + i * 120}ms` }}>
          <text x="404" y={126 + i * 30} fill="var(--color-signal)" style={mono(10)}>{kw}</text>
          <path d={`M${404 + kw.length * 8 + 10} ${122 + i * 30}h${80 - i * 12}`} {...thin} />
        </g>
      ))}
      <Caption>AI-02 · NATURAL LANGUAGE → SQL</Caption>
    </g>
  );
}

function Pipeline() {
  return (
    <g>
      {/* on-prem store */}
      <path d="M50 130v110c0 12 30 20 60 20s60-8 60-20V130" {...line} {...ink} />
      <ellipse cx="110" cy="130" rx="60" ry="18" {...line} {...ink} />
      <path d="M50 170c0 12 30 20 60 20s60-8 60-20M50 205c0 12 30 20 60 20s60-8 60-20" {...thin} />
      <text x="110" y="292" textAnchor="middle" fill="currentColor" opacity="0.6" style={mono(9)}>EHR · ON-PREM</text>
      {/* pipe */}
      <path d="M170 180H440" {...line} strokeWidth="10" stroke="var(--color-graphite-700)" />
      <path d="M170 174H440M170 186H440" {...thin} />
      <path d="M170 180H440" fill="none" stroke="var(--color-signal)" strokeWidth="4" className={flowOnActive} />
      {/* quality gate */}
      <rect x="282" y="140" width="46" height="80" {...line} {...ink} />
      <path d="M292 182l8 8 16-18" fill="none" stroke="var(--color-signal)" strokeWidth="2" />
      <text x="305" y="240" textAnchor="middle" fill="currentColor" opacity="0.6" style={mono(9)}>QC</text>
      {/* cloud */}
      <path d="M460 212h80a30 30 0 0 0 0-60 42 42 0 0 0-80-8 34 34 0 0 0 0 68z" {...line} {...ink} />
      <text x="505" y="192" textAnchor="middle" fill="currentColor" style={mono(10)}>AWS</text>
      <text x="505" y="292" textAnchor="middle" fill="currentColor" opacity="0.6" style={mono(9)}>10M+ RECORDS / MO</text>
      <Caption>DE-03 · HEALTHCARE ETL</Caption>
    </g>
  );
}

function Excavator() {
  const pivot = (x, y) => (
    <g>
      <circle cx={x} cy={y} r="7" {...line} {...ink} />
      <path d={`M${x - 11} ${y}h22M${x} ${y - 11}v22`} {...center} strokeDasharray="3 2" />
    </g>
  );
  return (
    <g>
      {/* ground + tracks */}
      <path d="M30 330H570" {...thin} />
      <rect x="60" y="292" width="210" height="36" rx="18" {...line} {...ink} />
      {[90, 130, 170, 210, 240].map((x) => (
        <circle key={x} cx={x} cy="310" r="9" {...thin} />
      ))}
      {/* body + cab */}
      <path d="M72 292V240H250V292" {...line} {...ink} />
      <path d="M170 240V180H222L236 240" {...line} {...ink} />
      <path d="M180 190H214L224 232H180z" {...thin} />
      {/* arm assembly rotates about the boom pivot */}
      <g
        className={cx("transition-transform", ease, "card-on:[transform:rotate(-7deg)]")}
        style={{ transformOrigin: "236px 262px", transformBox: "view-box" }}
      >
        <path d="M236 256L372 132L386 144L250 270z" {...line} {...ink} />
        <path d="M252 286L322 212" {...line} strokeWidth="5" stroke="var(--color-steel-500)" />
        <path d="M252 286L300 236" {...line} strokeWidth="2.5" />
        <path d="M380 138L462 262L448 270L368 150z" {...line} {...ink} />
        <path d="M392 116L446 196" {...line} strokeWidth="4" stroke="var(--color-steel-500)" />
        <path d="M455 266l40 -6 14 28 -12 26 -46 4 -20 -26z" {...line} {...ink} />
        <path d="M460 318l6 10M476 318l6 10M492 316l6 10" {...thin} />
        {pivot(379, 138)}
        {pivot(456, 266)}
      </g>
      {pivot(236, 262)}
      {/* dimension */}
      <path d="M236 70V250M456 70V250M236 80H456" {...thin} strokeDasharray="3 3" />
      <text x="346" y="72" textAnchor="middle" fill="currentColor" opacity="0.6" style={mono(9)}>REACH</text>
      <Caption>ME-04 · EXCAVATOR PROTOTYPE</Caption>
    </g>
  );
}

function Helmet() {
  return (
    <g>
      {/* camera frame */}
      <path d="M60 60h40M60 60v40M340 60h-40M340 60v40M60 320h40M60 320v-40M340 320h-40M340 320v-40" {...line} />
      <text x="72" y="84" fill="var(--color-signal)" style={mono(9)}>● REC</text>
      {/* rider */}
      <path d="M150 190a50 50 0 0 1 100 0v8h-100z" {...line} {...ink} />
      <path d="M160 198h80" {...line} />
      <circle cx="200" cy="222" r="24" {...thin} />
      <path d="M140 320c6-40 30-62 60-62s54 22 60 62" {...thin} />
      {/* detection box */}
      <g className={cx("transition-all", ease, "opacity-50 card-on:opacity-100")}>
        <rect x="136" y="126" width="128" height="86" fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeDasharray="6 4" />
        <rect x="136" y="110" width="96" height="16" fill="var(--color-signal)" />
        <text x="142" y="122" fill="var(--color-ink)" style={mono(9)}>HELMET ✓</text>
      </g>
      {/* ignition */}
      <path d="M340 190H420" {...thin} />
      <path d="M340 190H420" fill="none" stroke="var(--color-signal)" strokeWidth="2.5" className={flowOnActive} />
      <circle cx="470" cy="190" r="48" {...line} {...ink} />
      <circle cx="470" cy="190" r="10" {...line} />
      <g className={cx("transition-transform", ease, "card-on:[transform:rotate(60deg)]")} style={{ transformOrigin: "470px 190px", transformBox: "view-box" }}>
        <path d="M470 180V150" {...line} strokeWidth="3" />
      </g>
      <text x="438" y="162" fill="currentColor" opacity="0.6" style={mono(8)}>OFF</text>
      <text x="492" y="166" fill="var(--color-signal)" style={mono(8)}>ON</text>
      <text x="470" y="262" textAnchor="middle" fill="currentColor" opacity="0.6" style={mono(9)}>IGNITION</text>
      <Caption>PR-05 · HEL-MATE · OPENCV</Caption>
    </g>
  );
}

function V2v() {
  const car = (x, y) => (
    <g>
      <rect x={x} y={y} width="96" height="44" rx="10" {...line} {...ink} />
      <path d={`M${x + 24} ${y + 6}v32M${x + 70} ${y + 6}v32`} {...thin} />
    </g>
  );
  const waves = (cx, cy) =>
    [26, 44, 62].map((r, i) => (
      <path
        key={r}
        d={`M${cx + r * 0.7} ${cy - r * 0.7}A${r} ${r} 0 0 1 ${cx + r * 0.7} ${cy + r * 0.7}`}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="1.25"
        className="opacity-25 transition-opacity duration-500 card-on:opacity-100"
        style={{ transitionDelay: `${i * 140}ms` }}
      />
    ));
  return (
    <g>
      {/* road */}
      <path d="M30 150H570M30 290H570" {...thin} />
      <path d="M30 220H570" {...center} />
      {car(80, 170)}
      {car(360, 238)}
      <g transform="translate(176 192)">{waves(0, 0)}</g>
      <g transform="translate(360 260) scale(-1 1)">{waves(0, 0)}</g>
      {/* predicted paths */}
      <path d="M176 192C260 192 300 260 360 260" fill="none" stroke="currentColor" strokeDasharray="4 5" opacity="0.5" />
      <circle cx="292" cy="236" r="14" fill="none" stroke="var(--color-signal)" className="opacity-0 transition-opacity duration-500 card-on:opacity-100" />
      <text x="292" y="120" textAnchor="middle" fill="currentColor" opacity="0.6" style={mono(9)}>DSRC · V2V</text>
      <Caption>PR-06 · COLLISION PREDICTION</Caption>
    </g>
  );
}

const FIGURES = { agents: Agents, nl2sql: Nl2Sql, pipeline: Pipeline, excavator: Excavator, helmet: Helmet, v2v: V2v };
