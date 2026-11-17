import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Bot5, STAND, BP, walkBP, SIT } from "../Tort/Bot5";
import { VStage, C, ip, ez, eo, sm, Snow, Puffs, Subs, Stamp0, Tag, Slam, Head, Count, EndQ, Grade, Progress, Flashes, Scenes, Sc, V3, FPS, W, H, font, INK, RED, Glow } from "./V";
import { CloudSea, DC9, Fuse, Debris, Cabin, Trolley, Hospital } from "./Air";
import { Ground, Pines, groundH } from "./Farm";
import { Sky } from "../Tort/Common";
import WJ from "./s3w.json";

export const S3_FRAMES = 3220;
const WORDS = (WJ as any).words;
const T = { a: 0, b: 330, c: 485, d: 690, e: 1025, f: 1255, g: 1535, h: 1670, i: 1925, j: 2130, k: 2240, l: 2610, m: 2740, n: 3020 };
const walk = (f: number, sp = 1, amp = 0.85): BP => walkBP((f / FPS) * Math.PI * 2 * 0.8 * sp, amp);
const fmtM = (v: number) => Math.round(v).toLocaleString("en-US") + " m";

/* A — hook: the middle of the plane falling through the clouds */
const SA: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, seaY = -60 + t * 14;
  return <VStage f={f} len={T.b} exp={1.15} fog={["#c8a0a0", 200, 400]} shots={[[0, C([14, 4, 20], [0, -1, 0], 46, 0.04), C([10, 6, 16], [0, -1, 0], 44, 0.04)]]} hand={2} roll={Math.sin(t * 0.7) * 0.06}>
    <CloudSea f={f} y={seaY} speed={0.4} high={0} />
    <group rotation={[t * 0.35, t * 0.22, 0.6 + t * 0.5]}><Fuse x0={-5} x1={5} jag0 jag1 /></group>
    <Debris f={f + 60} c={[0, 0, 0]} n={50} r={0.5} spread={0.6} />
  </VStage>;
};
const HA: React.FC<{ f: number }> = ({ f }) => <>
  <Count f={f} a={0} b={262} from={10160} to={0} dur={250} label="ALTITUDE" y={220} fmt={fmtM} />
  <Tag f={f} a={40} b={230} x={540} y={600} text="NO PARACHUTE" col="#ff4d5a" />
  <Slam f={f} a={268} b={330} text="SURVIVED" y={330} col="#5ad07a" />
</>;
/* B — January 1972: the DC-9 above the clouds */
const SB: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.c - T.b} exp={1.1} fog={["#c8a0a0", 200, 400]} shots={[[0, C([-14, 6, 92], [0, 1, 0], 36, 0.05), C([12, 5, 88], [0, 1, 0], 34, 0.05)]]}>
  <CloudSea f={f} y={-30} />
  <group rotation={[0, 0.65, Math.sin(f / 90) * 0.02]} position={[0, Math.sin(f / 70) * 0.3, 0]}><DC9 f={f} /></group>
</VStage>;
const HB: React.FC<{ f: number }> = ({ f }) => <>
  <Head f={f} a={8} b={150} big="1972" small="JANUARY 26" />
  <Stamp0 f={f} a={20} b={150} l1="JAT FLIGHT 367" l2="COPENHAGEN → ZAGREB" />
</>;
/* C — the cabin: Vesna with the trolley */
const SC_: React.FC<{ f: number }> = ({ f }) => {
  const z = -3.2 + ip(f, [0, 200], [0, 1.6]);
  return <VStage f={f} len={T.d - T.c} exp={1.15} fog={["#2a2020", 6, 20]} shots={[[0, C([0.2, 1.55, 2.8], [0, 1.25, -2], 44, 0.06), C([0.15, 1.5, 2.3], [0, 1.3, -2], 42, 0.06)]]}>
    <Cabin f={f} len={14} />
    <Bot5 pos={[0, 0.03, z - 0.6]} ry={0} p={{ ...walk(f, 0.5, 0.4), lArmX: -50, lElbow: -40, rArmX: -50, rElbow: -40 }} f={f} outfit="stew" hood={false} eyes="calm" mouth="flat" />
    <Trolley p={[0, 0.03, z]} r={[0, Math.PI / 2, 0]} />
    {[[-0.95, -0.4, "peasant"], [0.47, 0.42, "peasant3"], [-0.47, 1.24, "villager"]].map(([x, zz, k], i) => <Bot5 key={i} pos={[x as number, 0.08, zz as number]} ry={Math.PI} p={{ ...SIT, headY: Math.sin(f / 60 + i) * 8 }} f={f} outfit={k as any} hood={false} eyes="calm" mouth="flat" scale={0.92} />)}
  </VStage>;
};
const Badge: React.FC<{ f: number; a: number; x: number; y: number; name: string; tilt: number; hi?: number; cross?: number }> = ({ f, a, x, y, name, tilt, hi = 0, cross = 0 }) => { if (f < a) return null; const k = ip(f, [a, a + 16], [0, 1], eo);
  return <div style={{ position: "absolute", left: x, top: y, width: 420, transform: `translate(-50%,-50%) rotate(${tilt}deg) scale(${k})`, opacity: k, background: "linear-gradient(180deg,#f4f0e6,#e0d8c8)", borderRadius: 16, padding: "22px 26px", boxShadow: `0 20px 40px rgba(0,0,0,0.6)${hi ? `, 0 0 0 ${8 * hi}px #f2c230` : ""}`, border: "3px solid #1c2f5a" }}>
    <div style={{ background: "#1c2f5a", color: "#fff", fontFamily: "Oswald", fontWeight: 600, letterSpacing: 6, fontSize: 26, padding: "6px 12px", borderRadius: 6, textAlign: "center" }}>CABIN CREW · 1972</div>
    <div style={{ display: "flex", gap: 18, marginTop: 16, alignItems: "center" }}>
      <svg width={110} height={130} viewBox="0 0 110 130"><rect width={110} height={130} rx={8} fill="#c8c8cc" /><circle cx={55} cy={50} r={26} fill="#5a5a62" /><path d="M14 130 Q55 70 96 130 Z" fill="#5a5a62" /></svg>
      <div><div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 52, color: "#1a1612", lineHeight: 1 }}>VESNA</div><div style={{ fontFamily: "Oswald", fontWeight: 500, fontSize: 36, color: "#3a3028" }}>{name}</div></div>
    </div>
    {cross > 0 && <svg width={420} height={260} style={{ position: "absolute", left: 0, top: 0 }}><line x1={20} y1={20} x2={20 + 380 * cross} y2={20 + 220 * cross} stroke={RED} strokeWidth={14} strokeLinecap="round" /></svg>}
  </div>; };
const HC: React.FC<{ f: number }> = ({ f }) => { const k = ip(f, [10, 26], [0, 1], eo), o = ip(f, [185, 200], [1, 0]);
  return f < 200 ? <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", opacity: k * o, transform: `translateY(${(1 - k) * -20}px)` }}>
    <div style={{ ...font, fontSize: 104, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill", lineHeight: 1 }}>VESNA VULOVIĆ</div>
    <div style={{ ...font, fontWeight: 600, fontSize: 44, letterSpacing: 8, color: "#e6e6ea", textShadow: "0 3px 12px #000" }}>22 · FLIGHT ATTENDANT</div>
  </div> : null; };
/* D — the wrong Vesna */
const SD: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.e - T.d} exp={0.8} fog={["#2a2020", 4, 16]} shots={[[0, C([0.6, 1.4, 1.5], [-0.2, 1.2, -3], 50, 0.0), C([0.5, 1.4, 1.2], [-0.2, 1.2, -3], 48, 0.0)]]}>
  <Cabin f={f} len={14} />
</VStage>;
const HD: React.FC<{ f: number }> = ({ f }) => { const sw = ip(f, [190, 240], [0, 1], ez);
  return <>
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.45)" }} />
    <Badge f={f} a={8} x={540 - sw * 0} y={560 + sw * 0} name="NIKOLIĆ" tilt={-4} cross={ip(f, [240, 262], [0, 1])} />
    <Badge f={f} a={150} x={540} y={980} name="VULOVIĆ" tilt={3} hi={ip(f, [250, 270], [0, 1])} />
    <Tag f={f} a={40} b={140} x={540} y={250} text="NOT HER FLIGHT" col="#ff4d5a" />
    <Tag f={f} a={262} b={330} x={540} y={250} text="WRONG VESNA" col="#f2c230" />
  </>; };
/* E — over Czechoslovakia: the bomb in the luggage hold */
const BOOM = 150;
const SE: React.FC<{ f: number }> = ({ f }) => {
  const fl = f > BOOM ? Math.max(0, 1 - (f - BOOM) / 40) : 0;
  return <VStage f={f} len={T.f - T.e} exp={1.1} fog={["#c8a0a0", 200, 400]} shake={[BOOM]} shots={[[0, C([30, -6, 70], [2, 0, 0], 36, 0.06), C([24, -5, 62], [3, -0.5, 0], 34, 0.06)]]}>
    <CloudSea f={f} y={-30} />
    <group rotation={[0, 0.55, 0]}><DC9 f={f} flash={fl} fire={f > BOOM ? 1 : 0} />
    {f > BOOM && <Debris f={f - BOOM} c={[7, -0.8, 0]} n={40} r={0.4} spread={0.5} />}</group>
  </VStage>;
};
const MapInset: React.FC<{ f: number; a: number; b: number }> = ({ f, a, b }) => { if (f < a || f > b + 10) return null; const k = ip(f, [a, a + 14], [0, 1], eo) * ip(f, [b, b + 10], [1, 0]); const p = ip(f, [a, b], [0.15, 0.6]);
  const route: [number, number][] = [[60, 40], [240, 250], [300, 330]]; const px = route[0][0] + (route[1][0] - route[0][0]) * p * 1.4, py = route[0][1] + (route[1][1] - route[0][1]) * p * 1.4;
  return <div style={{ position: "absolute", right: 50, top: 170, width: 360, height: 400, borderRadius: 18, overflow: "hidden", opacity: k, transform: `scale(${0.9 + k * 0.1})`, boxShadow: "0 16px 40px rgba(0,0,0,0.6)", border: "4px solid #f2c230", background: "#1a2a3a" }}>
    <svg width={360} height={400} viewBox="0 0 360 400">
      <path d="M0 0 H360 V400 H0Z" fill="#26384a" />
      <path d="M40 80 L130 50 L200 70 L250 60 L300 100 L330 140 L360 150 V0 H0 V60Z" fill="#3a4a3a" />
      <path d="M120 170 L200 150 L260 170 L320 190 L340 230 L290 250 L220 245 L160 240 L120 220Z" fill="#5a6a4a" stroke="#f2c230" strokeWidth={3} />
      <text x={230} y={215} fontSize={20} fontFamily="Oswald" fill="#fff" textAnchor="middle">CZECHOSLOVAKIA</text>
      <path d="M60 40 L240 250 L300 330" stroke="#fff" strokeWidth={3} strokeDasharray="8 7" fill="none" />
      <circle cx={60} cy={40} r={6} fill="#fff" /><text x={70} y={36} fontSize={16} fontFamily="Oswald" fill="#fff">COPENHAGEN</text>
      <circle cx={300} cy={330} r={6} fill="#fff" /><text x={240} y={360} fontSize={16} fontFamily="Oswald" fill="#fff">ZAGREB</text>
      <g transform={`translate(${px},${py}) rotate(48)`}><path d="M0 -14 L4 -2 L14 2 L4 4 L3 12 L0 10 L-3 12 L-4 4 L-14 2 L-4 -2Z" fill="#f2c230" /></g>
      {f > a + 150 && <circle cx={px} cy={py} r={10 + ((f - a - 150) % 30)} fill="none" stroke={RED} strokeWidth={4} opacity={1 - ((f - a - 150) % 30) / 30} />}
    </svg>
  </div>; };
const HE: React.FC<{ f: number }> = ({ f }) => <>
  <MapInset f={f} a={6} b={220} />
  <Stamp0 f={f} a={6} b={150} l1="4:01 PM" l2="OVER CZECHOSLOVAKIA" />
  <Tag f={f} a={BOOM + 8} b={225} x={540} y={760} text="BOMB · LUGGAGE HOLD" col="#ff4d5a" />
</>;
/* F — the plane breaks into three pieces */
const SF: React.FC<{ f: number }> = ({ f }) => {
  const s = ip(f, [0, 240], [0.15, 1]);
  return <VStage f={f} len={T.g - T.f} exp={1.1} fog={["#c8a0a0", 200, 400]} shake={[4, 60]} shots={[[0, C([10, 6, 46], [0, -4, 0], 40, 0.05), C([6, 4, 40], [0, -8, 0], 40, 0.05)]]}>
    <CloudSea f={f} y={-30 + s * 10} />
    <DC9 f={f + 80} split={s} fire={1} />
    <Debris f={f + 30} c={[0, -3, 0]} n={80} r={0.5} spread={1.2} />
  </VStage>;
};
const HF: React.FC<{ f: number }> = ({ f }) => <>
  <Count f={f} a={4} b={280} from={10160} to={10160} dur={1} label="ALTITUDE" y={230} fmt={fmtM} />
  {[0, 1, 2].map((i) => { const k = ip(f, [60 + i * 14, 72 + i * 14], [0, 1], eo); return <div key={i} style={{ position: "absolute", top: 520, left: 540 + (i - 1) * 200 - 70, width: 140, textAlign: "center", opacity: k * ip(f, [250, 270], [1, 0]), transform: `scale(${k}) rotate(${(i - 1) * 12}deg)`, ...font, fontSize: 120, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill", color: "#ff4d5a" }}>{i + 1}</div>; })}
</>;
/* G — everyone else died (restrained) */
const SG: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.h - T.g} exp={0.9} fog={["#2a2028", 120, 400]} shots={[[0, C([0, 30, 80], [0, -40, 0], 40, 0.0), C([0, 28, 74], [0, -44, 0], 40, 0.0)]]}>
  <CloudSea f={f} kind="dusk" y={-90 + f * 0.03} />
  <group position={[0, -20 - f * 0.05, 0]} scale={0.8}><DC9 f={f + 320} split={1} fire={0.6} /></group>
</VStage>;
const HG: React.FC<{ f: number }> = ({ f }) => { const k = ip(f, [6, 26], [0, 1], eo);
  return <>
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.35)", opacity: k }} />
    <div style={{ position: "absolute", top: 260, width: "100%", textAlign: "center", opacity: k }}>
      <div style={{ ...font, fontSize: 200, lineHeight: 1, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>27<span style={{ color: "#888", fontSize: 120 }}> / 28</span></div>
      <div style={{ ...font, fontWeight: 600, fontSize: 44, letterSpacing: 10, color: "#e6e6ea", textShadow: "0 3px 12px #000" }}>ON BOARD DIED</div>
    </div>
    <div style={{ position: "absolute", top: 600, width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, padding: "0 140px", boxSizing: "border-box" }}>{Array.from({ length: 28 }).map((_, i) => { const kk = ip(f, [10 + i * 2, 18 + i * 2], [0, 1]); const v = i === 19; return <svg key={i} width={48} height={80} viewBox="0 0 60 100" style={{ opacity: kk * (v ? 1 : 0.55) }}><circle cx={30} cy={18} r={14} fill={v ? "#5ad07a" : "#8a8a90"} /><path d="M10 96 L14 44 Q30 32 46 44 L50 96 Z" fill={v ? "#5ad07a" : "#8a8a90"} /></svg>; })}</div>
  </>; };
/* H — inside the falling middle section: pinned by the trolley */
const SH: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, roll = Math.sin(t * 1.3) * 0.5 + t * 0.25;
  const red = 0.6 + Math.sin(f / 5) * 0.3 * (random01(f) > 0.3 ? 1 : 0.4);
  return <VStage f={f} len={T.i - T.h} exp={1.1} fog={["#1a0a0a", 3, 12]} shake={[0, 50, 110, 170]} hand={3} roll={roll} shots={[[0, C([0.0, 1.7, 1.9], [0, 0.2, -0.5], 56, 0.03), C([0.0, 1.6, 1.6], [0, 0.2, -0.5], 52, 0.03)]]}>
    <Cabin f={f} len={8} light={0.15} skyCol="#3a2a3a" />
    <pointLight position={[0.4, 1.9, 0]} intensity={18 * red} distance={6} color="#ff2a1a" /><pointLight position={[0, 1.6, 1.4]} intensity={3} distance={4} color="#c8d0ff" />
    <Bot5 pos={[0, 0.16, 0.7]} rot={[-Math.PI / 2, 0, 0]} p={{ ...STAND, lArmZ: -30 + Math.sin(f / 8) * 8, rArmZ: 40, lElbow: -40, headY: Math.sin(f / 10) * 15 }} f={f} outfit="stew" hood={false} eyes="scared" mouth="scream" ground={false} />
    <Trolley p={[0.08, 0.36, 0.35]} r={[0, 0.25, Math.PI / 2 - 0.1]} />
    <Puffs f={f} n={14} area={[-1.5, 1.5, 0.2, 2.4, -4, 4]} col="#3a3036" o={0.3} s={[1, 2.5]} drift={[0, 0, 0.6]} seed="hs" />
  </VStage>;
};
const random01 = (f: number) => ((Math.sin(Math.floor(f / 4) * 12.9898) * 43758.5453) % 1 + 1) % 1;
const XRay: React.FC<{ f: number; a: number; b: number; x: number; y: number; kind: "skull" | "legs"; label: string }> = ({ f, a, b, x, y, kind, label }) => { if (f < a || f > b + 10) return null; const k = ip(f, [a, a + 14], [0, 1], eo) * ip(f, [b, b + 10], [1, 0]); const crack = ip(f, [a + 14, a + 34], [0, 1]);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.85 + k * 0.15}) rotate(${kind === "skull" ? -3 : 3}deg)`, opacity: k }}>
    <div style={{ width: 460, height: 520, background: "radial-gradient(ellipse at 50% 45%, #2a3a4a, #05080c)", borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(120,180,255,0.25)", border: "4px solid #8ab4e0", position: "relative" }}>
      <svg width={460} height={520} viewBox="0 0 460 520" style={{ position: "absolute" }}>
        {kind === "skull" ? <g fill="none" stroke="#e8f0ff" strokeWidth={10} opacity={0.85}><path d="M230 60 C130 60 90 140 100 220 C108 280 140 300 150 340 L170 400 L290 400 L310 340 C320 300 352 280 360 220 C370 140 330 60 230 60Z" /><ellipse cx={185} cy={250} rx={34} ry={30} /><ellipse cx={275} cy={250} rx={34} ry={30} /><path d="M215 300 L230 330 L245 300" /><path d="M180 400 L180 440 M210 400 L210 445 M250 400 L250 445 M280 400 L280 440" /></g>
          : <g fill="none" stroke="#e8f0ff" strokeWidth={14} opacity={0.85} strokeLinecap="round"><path d="M170 40 L160 240" /><path d="M290 40 L300 240" /><circle cx={160} cy={258} r={20} /><circle cx={300} cy={258} r={20} /><path d="M160 280 L150 480" /><path d="M300 280 L312 480" /></g>}
        <path d={kind === "skull" ? "M250 80 L238 120 L262 150 L240 190" : "M140 360 L165 372 L148 384 M290 140 L316 150 L296 162"} stroke={RED} strokeWidth={7} fill="none" strokeDasharray={300} strokeDashoffset={300 * (1 - crack)} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", bottom: -70, width: "100%", textAlign: "center", ...font, fontSize: 50, color: "#fff", WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill" }}>{label}</div>
    </div>
  </div>; };
/* I — the section falls into the snowy wooded mountainside */
const IMPACT = 128;
const SI: React.FC<{ f: number }> = ({ f }) => {
  const q = Math.min(1, f / IMPACT), y = 40 * (1 - q * q) + groundH(2, -2) + 1.0, tumb = (1 - q) * 3;
  const burst = f > IMPACT ? ip(f - IMPACT, [0, 30, 120], [0, 1, 0.3]) : 0;
  return <VStage f={f} len={T.j - T.i} exp={1.15} fog={["#9aa0b0", 20, 140]} shake={[IMPACT]} shots={[[0, C([-16, 6, 24], [0, 14, 0], 40, 0.05), C([-14, 4, 21], [0, 4, 0], 40, 0.05)], [IMPACT - 4, C([-11, 3, 16], [1, 1.5, -1], 40, 0.05), C([-10, 2.8, 14], [1, 1.5, -1], 38, 0.05)]]}>
    <Sky kind="storm" f={f / 2} clouds={14} cloudCol="#c8ccd8" />
    <hemisphereLight args={["#c8d0e0", "#5a6070", 1.0]} />
    <directionalLight position={[-30, 40, 20]} intensity={1.4} color="#e8eef8" castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} />
    <group rotation={[0.12, 0, 0]}><Ground /><Pines n={500} seed="vm" area={(i) => [(((i * 7.31) % 1) - 0.5) * 120, (((i * 3.77) % 1) - 0.5) * 120]} /></group>
    {[[3, -1], [-2.5, 1.5], [5, 3], [0.5, -5], [-4, -3]].map(([x, z], i) => <group key={i} position={[x, groundH(x, z), z]} rotation={[0.12, 0, 0]}>{[0, 1, 2].map((l) => <mesh key={l} position={[0, 3 + l * 2.2, 0]} castShadow><coneGeometry args={[2.2 - l * 0.6, 3.4, 9]} /><meshStandardMaterial color="#13251c" roughness={0.95} /></mesh>)}<mesh position={[0, 1.2, 0]}><cylinderGeometry args={[0.25, 0.35, 2.4, 8]} /><meshStandardMaterial color="#2a1e16" /></mesh></group>)}
    <group position={[1, y, -1]} rotation={[0.3 + tumb, 0.8, 0.9 + tumb * 0.7]}><Fuse x0={-4} x1={4} jag0 jag1 /></group>
    {burst > 0 && <Puffs f={f} n={30} area={[-6, 8, 0.5, 6, -6, 4]} col="#eef2fa" o={0.6 * burst} s={[3, 8]} drift={[0.4, 0.2, 0]} seed="sb" />}
    <Snow f={f} c={[0, 0, 4]} r={14} n={1400} h={14} s={0.08} />
  </VStage>;
};
/* J — a villager runs through the snow */
const SJ: React.FC<{ f: number }> = ({ f }) => {
  const k = ip(f, [0, 110], [0, 1]), x = -8 + k * 5, z = 8 - k * 5;
  return <VStage f={f} len={T.k - T.j} exp={1.15} fog={["#9aa0b0", 15, 120]} shots={[[0, C([-10, 1.6, 12], [-3, 1.4, 1], 40, 0.06), C([-9.4, 1.6, 10.8], [-2.5, 1.4, 1], 38, 0.06)]]}>
    <Sky kind="storm" f={f / 2} clouds={14} cloudCol="#c8ccd8" />
    <hemisphereLight args={["#c8d0e0", "#5a6070", 1.0]} />
    <directionalLight position={[-30, 40, 20]} intensity={1.4} color="#e8eef8" castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} />
    <Ground /><Pines n={400} seed="vj" area={(i) => [(((i * 7.31) % 1) - 0.5) * 120, (((i * 3.77) % 1) - 0.5) * 120]} />
    <group position={[1, groundH(1, -1) + 1, -1]} rotation={[0.3, 0.8, 0.9]}><Fuse x0={-4} x1={4} jag0 jag1 /></group>
    <Bot5 pos={[x, groundH(x, z), z]} ry={Math.atan2(5, -5)} p={{ ...walk(f, 1.6, 1.2), lean: 14 }} f={f} outfit="villager" hood={false} eyes="scared" mouth="fear" />
    <Snow f={f} c={[-6, 0, 8]} r={8} n={1200} h={8} s={0.05} />
  </VStage>;
};
const HJ: React.FC<{ f: number }> = ({ f }) => <Tag f={f} a={8} b={100} x={540} y={300} text="HE HEARD HER SCREAMING" sub="BRUNO HONKE · VILLAGER" />;
/* K — hospital: injuries + coma */
const SK: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.l - T.k} exp={1.05} fog={["#dfe4e8", 6, 20]} shots={[[0, C([1.4, 1.9, 1.9], [0, 0.8, -0.8], 42, 0.06), C([1.1, 1.8, 1.5], [0, 0.8, -0.8], 40, 0.06)]]}>
  <Hospital f={f} />
  <Bot5 pos={[0, 0.82, 0.25]} rot={[-Math.PI / 2, 0, 0]} p={{ ...STAND, lArmZ: -8, rArmZ: 8 }} f={f} outfit="stew" hood={false} eyes="closed" mouth="flat" ground={false} />
</VStage>;
const Coma: React.FC<{ f: number; a: number; b: number }> = ({ f, a, b }) => { if (f < a || f > b + 10) return null; const v = Math.floor(ip(f, [a, a + 120], [1, 27])), k = ip(f, [a, a + 12], [0, 1], eo) * ip(f, [b, b + 10], [1, 0]);
  return <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", opacity: k }}>
    <div style={{ ...font, fontWeight: 600, fontSize: 44, letterSpacing: 12, color: "#e6e6ea", textShadow: "0 3px 12px #000" }}>IN A COMA</div>
    <div style={{ ...font, fontSize: 190, lineHeight: 1, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>DAY {v}</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>{Array.from({ length: 27 }).map((_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 4, background: i < v ? RED : "rgba(255,255,255,0.25)" }} />)}</div>
  </div>; };
const HK: React.FC<{ f: number }> = ({ f }) => <>
  <XRay f={f} a={4} b={100} x={540} y={560} kind="skull" label="SKULL FRACTURED" />
  <XRay f={f} a={104} b={200} x={540} y={560} kind="legs" label="BOTH LEGS BROKEN" />
  <Coma f={f} a={210} b={364} />
</>;
/* L — she remembers nothing */
const SL: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.m - T.l} exp={1.05} fog={["#dfe4e8", 6, 20]} shots={[[0, C([0.5, 1.45, 0.2], [0, 0.95, -1.4], 40, 0.05), C([0.4, 1.4, 0.0], [0, 0.95, -1.4], 36, 0.05)]]}>
  <Hospital f={f} />
  <Bot5 pos={[0, 0.82, 0.25]} rot={[-Math.PI / 2, 0, 0]} p={{ ...STAND, lArmZ: -8, rArmZ: 8, headY: Math.sin(f / 40) * 10 }} f={f} outfit="stew" hood={false} eyes="calm" mouth="flat" ground={false} />
</VStage>;
const Film: React.FC<{ f: number }> = ({ f }) => { const k = ip(f, [6, 24], [0, 1], eo);
  return <div style={{ position: "absolute", top: 300, left: 0, width: "100%", height: 300, opacity: k, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -((f * 3) % 260), top: 30, display: "flex", gap: 20, background: "#121214", padding: "28px 20px", borderTop: "10px dashed #3a3a40", borderBottom: "10px dashed #3a3a40" }}>
      {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ width: 240, height: 170, background: i % 3 === 1 ? "#f4f4f4" : "linear-gradient(180deg,#5a6a8a,#b8a0a0)", display: "flex", alignItems: "center", justifyContent: "center", ...font, fontSize: 110, color: i % 3 === 1 ? RED : "transparent" }}>?</div>)}
    </div>
  </div>; };
const HL: React.FC<{ f: number }> = ({ f }) => <><Film f={f} /><Tag f={f} a={30} b={125} x={540} y={680} text="NO MEMORY OF THE FALL" /></>;
/* M — the record */
const SM: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.n - T.m} exp={1.1} fog={["#c8a0a0", 200, 400]} shots={[[0, C([0, 6, 60], [0, 4, 0], 40, 0.0), C([0, 6, 54], [0, 4, 0], 40, 0.0)]]}>
  <CloudSea f={f} y={-20} />
</VStage>;
const HM: React.FC<{ f: number }> = ({ f }) => {
  const g = ip(f, [20, 120], [0, 1], (t) => 1 - Math.pow(1 - t, 3)), base = 1250, full = 620;
  const bar = (x: number, h: number, col: string, label: string, val: string, d: number) => { const k = ip(f, [20 + d, 120 + d], [0, 1], (t) => 1 - Math.pow(1 - t, 3)); return <div style={{ position: "absolute", left: x - 110, top: base - h * full * k, width: 220, height: h * full * k, background: `linear-gradient(180deg, ${col}, rgba(0,0,0,0.3))`, borderRadius: "14px 14px 0 0", boxShadow: "0 0 30px rgba(0,0,0,0.5)" }}>
    <div style={{ position: "absolute", top: -110, width: "100%", textAlign: "center", ...font, fontSize: 58, WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill", opacity: k }}>{val}</div>
    <div style={{ position: "absolute", top: -152, width: "100%", textAlign: "center", ...font, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: "#fff", textShadow: "0 3px 10px #000", opacity: k }}>{label}</div>
  </div>; };
  return <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5), transparent 40%, rgba(0,0,0,0.5))" }} />
    <div style={{ position: "absolute", top: 180, width: "100%", textAlign: "center", opacity: g }}><div style={{ ...font, fontWeight: 600, fontSize: 44, letterSpacing: 12, color: "#f2c230", textShadow: "0 3px 12px #000" }}>WORLD RECORD</div><div style={{ ...font, fontSize: 92, lineHeight: 1.05, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>HIGHEST FALL<br />SURVIVED</div></div>
    {bar(330, 0.87, "#8a9aaa", "MT. EVEREST", "8,849 m", 0)}
    {bar(750, 1.0, "#e0182e", "HER FALL", "10,160 m", 30)}
  </>;
};
/* N — end */
const SN: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={S3_FRAMES - T.n} exp={1.1} fog={["#c8a0a0", 200, 400]} shots={[[0, C([-40, 3, 70], [0, 4, -6], 36, 0.0), C([-36, 3, 64], [0, 4, -6], 34, 0.0)]]}>
  <CloudSea f={f} y={-30} />
  <group position={[0, 0, -6]} rotation={[0, 0.7, 0]}><DC9 f={f} /></group>
</VStage>;
const HN: React.FC<{ f: number }> = ({ f }) => <EndQ f={f} a={4} l1="WOULD YOU EVER GET" l2="ON A PLANE AGAIN?" />;

const Sx = (S: React.FC<{ f: number }>, Hh?: React.FC<{ f: number }>): React.FC<{ f: number }> => ({ f }) => <><S f={f} />{Hh && <Hh f={f} />}</>;
const LIST: Sc[] = [
  [T.a, T.b, Sx(SA, HA), "cut"], [T.b, T.c, Sx(SB, HB), "dark"], [T.c, T.d, Sx(SC_, HC), "fade"], [T.d, T.e, Sx(SD, HD), "fade"],
  [T.e, T.f, Sx(SE, HE), "dark"], [T.f, T.g, Sx(SF, HF), "cut"], [T.g, T.h, Sx(SG, HG), "fade"], [T.h, T.i, Sx(SH), "cut"],
  [T.i, T.j, Sx(SI), "whip"], [T.j, T.k, Sx(SJ, HJ), "fade"], [T.k, T.l, Sx(SK, HK), "dark"], [T.l, T.m, Sx(SL, HL), "fade"],
  [T.m, T.n, Sx(SM, HM), "dark"], [T.n, S3_FRAMES, Sx(SN, HN), "fade"],
];
export const S3: React.FC<{ audio?: boolean }> = ({ audio = false }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <AbsoluteFill style={{ filter: "contrast(1.05) saturate(0.95)" }}><Scenes list={LIST} /></AbsoluteFill>
    <Grade tint="rgba(80,90,140,0.08)" />
    <Flashes at={[T.e + BOOM, T.i + IMPACT]} o={0.7} len={14} />
    <Progress total={S3_FRAMES} />
    <Subs words={WORDS} stop={T.n - 4} />
    {audio && <Audio src={staticFile("cases/s3mix.wav")} />}
  </AbsoluteFill>
);
