import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Bot5, STAND, BP, walkBP, mixBP, SIT } from "../Tort/Bot5";
import { VStage, C, ip, ez, eo, sm, Subs, Stamp0, Tag, Slam, Head, Count, EndQ, Grade, Progress, Scenes, Sc, V3, FPS, W, H, font, INK, RED } from "./V";
import { Gallows, Sandbag, Cell, PrisonFront, Noose } from "./Prison";
import WJ from "./s2w.json";

export const S2_FRAMES = 3420;
const WORDS = (WJ as any).words;
const T = { a: 0, a2: 150, b: 340, c: 640, d: 940, e: 1150, f: 1420, g: 1630, h: 1880, i: 2190, j: 2350, k: 2600, l: 2740, m: 2990, n: 3170 };

const NECK = 1.4;
const PIN: BP = { ...STAND, lean: 2, headX: 10, lArmX: 14, lArmZ: -4, lElbow: -8, rArmX: 14, rArmZ: 4, rElbow: -8, lLegZ: -1, rLegZ: 1 };
const walk = (f: number, amp = 0.8): BP => walkBP((f / FPS) * Math.PI * 2 * 0.8, amp);
/** John Lee standing on the trap with the noose on */
const Lee: React.FC<{ f: number; pos?: V3; ry?: number; p?: BP; eyes?: any; mouth?: any; noose?: boolean }> = ({ f, pos = [0, 0, 0], ry = 0, p = PIN, eyes = "scared", mouth = "flat" }) =>
  <Bot5 pos={pos} ry={ry} p={{ ...p, headY: p.headY + Math.sin(f / 50) * 3 }} f={f} outfit="convict" hood={false} eyes={eyes} mouth={mouth} pupil={0.8} />;
const Warder: React.FC<{ f: number; pos: V3; ry: number; p?: BP }> = ({ f, pos, ry, p = STAND }) => <Bot5 pos={pos} ry={ry} p={p} f={f} outfit="warder" hood={false} eyes="calm" mouth="flat" />;
const Hangman: React.FC<{ f: number; pull: number }> = ({ f, pull }) => {
  const p: BP = { ...STAND, lean: 8 + pull * 14, headX: 8, rArmX: -62 + pull * 30, rArmZ: 6, rElbow: -30 + pull * 20, lArmX: -52 + pull * 30, lArmZ: -6, lElbow: -30 + pull * 20 };
  return <Bot5 pos={[2.55, 0, 0.75]} ry={-Math.PI / 2} p={p} f={f} outfit="hangman" hood={false} eyes="calm" mouth="flat" />;
};
const Chap: React.FC<{ f: number }> = ({ f }) => <Bot5 pos={[-2.2, 0, 1.3]} ry={Math.PI * 0.62} p={{ ...STAND, headX: 18, lArmX: -40, lElbow: -70, rArmX: -40, rElbow: -70 }} f={f} outfit="chaplain" hood={false} eyes="closed" mouth="flat" />;
const Doc: React.FC<{ f: number; raise?: number }> = ({ f, raise = 0 }) => <Bot5 pos={[-2.4, 0, -0.4]} ry={Math.PI * 0.35} p={{ ...STAND, rArmX: -10 - raise * 150, rArmZ: 10 + raise * 10, rElbow: -10 - raise * 20, headX: -raise * 6 }} f={f} outfit="doctor" hood={false} eyes={raise > 0.5 ? "angry" : "calm"} mouth={raise > 0.5 ? "grit" : "flat"} />;
/** a lever pull that doesn't open the trap: lever goes, trap jolts a few mm */
const pullAt = (f: number, t: number) => ip(f, [t, t + 12, t + 40, t + 70], [0, 1, 1, 0], ez);
const jolt = (f: number, t: number) => (f > t + 10 && f < t + 26 ? Math.sin((f - t) * 1.8) * 0.012 * (1 - (f - t - 10) / 16) : 0);

/* A1 — hook: three pulls, three failures */
const PULLS = [10, 58, 106];
const SA1: React.FC<{ f: number }> = ({ f }) => {
  const lever = Math.max(...PULLS.map((t) => pullAt(f, t)));
  return <VStage f={f} len={T.a2 - T.a} exp={1.2} fog={["#0a0a0c", 6, 18]} shake={PULLS.map((t) => t + 12)} shots={[[0, C([2.3, 1.15, 3.6], [0.75, 1.25, 0.1], 46, 0.04), C([2.1, 1.2, 3.2], [0.75, 1.3, 0.1], 44, 0.04)]]}>
    <Gallows f={f} lever={lever} noose={[0, NECK, 0.02]} />
    <group position={[0, Math.max(...PULLS.map((t) => jolt(f, t))), 0]}><Lee f={f} /></group>
    <Hangman f={f} pull={lever} />
  </VStage>;
};
const XMark: React.FC<{ f: number; a: number; y?: number }> = ({ f, a, y = 520 }) => { if (f < a) return null; const k = ip(f, [a, a + 8], [2, 1], (t) => t * t), o = ip(f, [a, a + 4], [0, 1]); return <div style={{ position: "absolute", top: y, width: "100%", textAlign: "center", ...font, fontSize: 260, color: RED, opacity: o, transform: `scale(${k})`, WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", lineHeight: 1 }}>✕</div>; };
const Attempt: React.FC<{ f: number; a: number; b: number; n: number }> = ({ f, a, b, n }) => { if (f < a || f > b) return null; const k = ip(f, [a, a + 8], [0, 1], eo), o = ip(f, [b - 6, b], [1, 0]);
  return <div style={{ position: "absolute", top: 240, width: "100%", textAlign: "center", opacity: k * o }}><div style={{ ...font, fontWeight: 600, fontSize: 46, letterSpacing: 12, color: "#d8d8dc", textShadow: "0 3px 10px #000" }}>ATTEMPT</div><div style={{ ...font, fontSize: 190, lineHeight: 1, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>{n}<span style={{ color: "#888", fontSize: 120 }}>/3</span></div></div>; };
const HA1: React.FC<{ f: number }> = ({ f }) => <>{PULLS.map((t, i) => <React.Fragment key={i}><Attempt f={f} a={t - 8} b={t + 46} n={i + 1} /><XMark f={f} a={t + 22} /></React.Fragment>)}</>;
/* A2 — England, 1885: Exeter prison at dawn */
const SA2: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.b - T.a2} exp={1.1} fog={["#8a8a98", 30, 160]} shots={[[0, C([3, 1.6, 26], [0, 6, -6], 40, 0.04), C([2, 1.7, 20], [0, 6.5, -6], 38, 0.04)]]}>
  <PrisonFront f={f} sky="dusk" />
</VStage>;
const HA2: React.FC<{ f: number }> = ({ f }) => <>
  <Head f={f} a={20} b={180} big="1885" small="EXETER · ENGLAND" />
  <Stamp0 f={f} a={30} b={180} l1="FEB 23, 1885" l2="8:00 AM · EXECUTION DAY" />
</>;
/* B — the condemned man in his cell */
const SB: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.c - T.b} exp={1.15} fog={["#000", 5, 14]} shots={[[0, C([0.9, 1.35, 1.6], [-1.0, 0.9, -0.4], 42, 0.06), C([0.6, 1.3, 1.25], [-1.0, 0.95, -0.4], 40, 0.06)]]}>
  <Cell f={f} />
  <Bot5 pos={[-0.85, 0, -0.2]} ry={Math.PI / 2 - 0.3} p={{ ...SIT, lean: 22, headX: 30, lArmX: -50, lElbow: -80, rArmX: -50, rElbow: -80, lArmZ: -10, rArmZ: 10 }} f={f} outfit="convict" hood={false} eyes="scared" mouth="flat" pupil={0.7} />
</VStage>;
const Card: React.FC<{ f: number; a: number; b: number }> = ({ f, a, b }) => { if (f < a || f > b + 10) return null; const k = ip(f, [a, a + 14], [0, 1], eo), o = ip(f, [b, b + 10], [1, 0]);
  return <div style={{ position: "absolute", top: 220, left: 540, transform: `translateX(-50%) rotate(${-2 + (1 - k) * 6}deg) scale(${0.8 + k * 0.2})`, opacity: k * o, background: "#e8e0cc", border: "6px solid #2a2420", borderRadius: 10, padding: "22px 46px 26px", boxShadow: "0 18px 40px rgba(0,0,0,0.6)", textAlign: "center", minWidth: 620 }}>
    <div style={{ fontFamily: "serif", fontSize: 34, letterSpacing: 6, color: "#5a4a3a" }}>THE QUEEN v.</div>
    <div style={{ ...font, color: "#1a1612", fontSize: 96, lineHeight: 1.05 }}>JOHN LEE</div>
    <div style={{ fontFamily: "serif", fontSize: 34, color: "#3a3028" }}>Age 20 · Babbacombe, Devon</div>
  </div>; };
const HB: React.FC<{ f: number }> = ({ f }) => <>
  <Card f={f} a={10} b={290} />
  <Slam f={f} a={218} b={290} text="GUILTY" y={600} />
</>;
/* C — the executioner tests the trap with a sandbag: works */
const DROP_C = 150;
const SC_: React.FC<{ f: number }> = ({ f }) => {
  const lever = ip(f, [DROP_C - 12, DROP_C], [0, 1], ez), open = ip(f, [DROP_C, DROP_C + 8], [0, 1], (t) => 1 - Math.pow(1 - t, 2));
  const fall = f > DROP_C ? Math.min(2.2, 0.5 * 9.8 * Math.pow((f - DROP_C) / FPS, 2)) : 0;
  return <VStage f={f} len={T.d - T.c} exp={1.2} fog={["#0a0a0c", 6, 18]} shake={[DROP_C + 4]} shots={[[0, C([3.6, 2.2, 3.6], [0.3, 1.0, 0], 44, 0.04), C([3.2, 2.0, 3.1], [0.3, 0.9, 0], 42, 0.04)], [DROP_C - 2, C([1.4, 0.6, 2.0], [0, -0.2, 0], 50, 0.03), C([1.3, 0.5, 1.85], [0, -0.4, 0], 50, 0.03)]]}>
    <Gallows f={f} lever={lever} open={open} noose={null} />
    <Sandbag y={0.02 - fall} />
    <Hangman f={f} pull={lever} />
  </VStage>;
};
const HC: React.FC<{ f: number }> = ({ f }) => <>
  <Stamp0 f={f} a={6} b={140} l1="7:45 AM" l2="TESTING THE TRAPDOOR" />
  <Tag f={f} a={212} b={292} x={540} y={330} text="WORKED PERFECTLY ✓" col="#5ad07a" />
</>;
/* D — Lee walks onto the trap; the noose */
const SD: React.FC<{ f: number }> = ({ f }) => {
  const k = ip(f, [0, 80], [0, 1], ez), x = -2.8 + k * 2.8, moving = f < 80;
  const nz = ip(f, [100, 150], [0, 1], ez);
  return <VStage f={f} len={T.e - T.d} exp={1.2} fog={["#0a0a0c", 6, 18]} shots={[[0, C([1.8, 1.7, 3.6], [-0.8, 1.2, 0], 42, 0.05), C([1.4, 1.65, 3.0], [-0.4, 1.3, 0], 40, 0.05)], [95, C([0.9, 1.75, 2.4], [0, 1.85, 0], 42, 0.04), C([0.75, 1.72, 2.1], [0, 1.85, 0], 40, 0.04)]]}>
    <Gallows f={f} noose={nz > 0.5 ? [0, NECK, 0.02] : [0.0, 2.05 - nz * 0.4, 0]} />
    <Lee f={f} pos={[x, 0, 0]} ry={moving ? Math.PI / 2 : 0} p={moving ? { ...walk(f), lArmX: 14, rArmX: 14, lElbow: -8, rElbow: -8, lArmZ: -4, rArmZ: 4 } : PIN} />
    <Warder f={f} pos={[x - 0.2, 0, 0.75]} ry={moving ? Math.PI / 2 : 0} p={moving ? walk(f + 20) : STAND} />
    <Warder f={f} pos={[x + 0.2, 0, -0.75]} ry={moving ? Math.PI / 2 : 0} p={moving ? walk(f + 40) : STAND} />
    <Hangman f={f} pull={0} />
    <Chap f={f} />
  </VStage>;
};
/* E — the lever... nothing */
const PULL_E = 120;
const SE: React.FC<{ f: number }> = ({ f }) => {
  const lever = ip(f, [PULL_E, PULL_E + 10], [0, 1], ez);
  return <VStage f={f} len={T.f - T.e} exp={1.15} fog={["#0a0a0c", 6, 18]} shake={[PULL_E + 10]} shots={[[0, C([2.2, 1.6, 1.6], [1.9, 0.9, 0.75], 40, 0.04), C([2.1, 1.45, 1.5], [1.9, 0.95, 0.75], 36, 0.04)], [PULL_E + 18, C([1.6, 0.45, 2.4], [0, 1.25, 0], 52, 0.02), C([1.45, 0.5, 2.15], [0, 1.3, 0], 50, 0.02)]]}>
    <Gallows f={f} lever={lever} noose={[0, NECK, 0.02]} />
    <group position={[0, jolt(f, PULL_E), 0]}><Lee f={f} eyes="closed" /></group>
    <Warder f={f} pos={[-0.95, 0, 0.75]} ry={0.3} /><Warder f={f} pos={[0.95, 0, -0.75]} ry={-0.3} />
    <Hangman f={f} pull={lever} />
  </VStage>;
};
const Heart: React.FC<{ f: number; a: number; b: number }> = ({ f, a, b }) => { if (f < a || f > b) return null; const ph = ((f - a) % 42) / 42, k = Math.max(0, 1 - ph * 5) + Math.max(0, 1 - Math.abs(ph - 0.25) * 6) * 0.6;
  return <AbsoluteFill style={{ boxShadow: `inset 0 0 ${180 + k * 120}px rgba(150,0,10,${0.25 + k * 0.3})` }} />; };
const HE: React.FC<{ f: number }> = ({ f }) => <>
  <Heart f={f} a={0} b={PULL_E + 20} />
  <Slam f={f} a={186} b={262} text="NOTHING" y={330} />
</>;
/* F — the warders stamp on the doors: still nothing */
const SF: React.FC<{ f: number }> = ({ f }) => {
  const st = (s: number): BP => { const ph = (f / FPS) * Math.PI * 2 * 1.6 + s; const u = Math.max(0, Math.sin(ph)); return { ...STAND, lean: 6, lLegX: -u * 50, lKnee: u * 70, rLegX: -Math.max(0, Math.sin(ph + Math.PI)) * 50, rKnee: Math.max(0, Math.sin(ph + Math.PI)) * 70, lArmX: -20, rArmX: -20, headX: 20 }; };
  const stomp = Array.from({ length: 12 }).map((_, i) => 10 + i * 19);
  return <VStage f={f} len={T.g - T.f} exp={1.2} fog={["#0a0a0c", 6, 18]} shake={stomp} shots={[[0, C([2.2, 0.85, 2.7], [0, 0.65, 0], 50, 0.03), C([2.0, 0.9, 2.45], [0, 0.7, 0], 48, 0.03)], [110, C([2.6, 1.9, 3.0], [0, 1.0, 0], 44, 0.04), C([2.3, 1.8, 2.6], [0, 1.1, 0], 42, 0.04)]]}>
    <Gallows f={f} lever={1} noose={[0, NECK, 0.02]} />
    <group position={[0, Math.abs(Math.sin(f / 3)) * 0.004, 0]}><Lee f={f} eyes="closed" /></group>
    <Warder f={f} pos={[-0.55, 0, 0.42]} ry={0.4} p={st(0)} /><Warder f={f} pos={[0.55, 0, -0.42]} ry={-2.6} p={st(1.6)} />
    <Hangman f={f} pull={1} />
  </VStage>;
};
const HF: React.FC<{ f: number }> = ({ f }) => <Tag f={f} a={140} b={200} x={540} y={330} text="STILL NOTHING" col="#ff4d5a" />;
/* G — Lee taken off; test again: drops instantly */
const DROP_G = 158;
const SG: React.FC<{ f: number }> = ({ f }) => {
  const k = ip(f, [10, 70], [0, 1], ez), lever = ip(f, [DROP_G - 10, DROP_G], [0, 1], ez), open = ip(f, [DROP_G, DROP_G + 7], [0, 1], (t) => 1 - Math.pow(1 - t, 2));
  return <VStage f={f} len={T.h - T.g} exp={1.2} fog={["#0a0a0c", 6, 18]} shake={[DROP_G + 3]} shots={[[0, C([2.2, 1.6, 3.8], [-1.0, 1.0, 0], 46, 0.04), C([1.9, 1.5, 3.3], [-0.9, 0.95, 0], 44, 0.04)], [DROP_G - 4, C([1.3, 0.55, 1.9], [0, -0.2, 0], 50, 0.03), C([1.25, 0.5, 1.8], [0, -0.35, 0], 50, 0.03)]]}>
    <Gallows f={f} lever={lever} open={open} noose={[0, 2.0, 0]} />
    <Lee f={f} pos={[-k * 2.2, 0, 0.2]} ry={k > 0.02 && k < 0.98 ? -Math.PI / 2 : 0.6} p={k > 0.02 && k < 0.98 ? walk(f) : PIN} />
    <Warder f={f} pos={[-k * 2.2 - 0.3, 0, 0.9]} ry={0.6} />
    <Hangman f={f} pull={lever} />
  </VStage>;
};
const HG: React.FC<{ f: number }> = ({ f }) => <Tag f={f} a={DROP_G + 6} b={240} x={540} y={330} text="DROPPED INSTANTLY" col="#5ad07a" />;
/* H — second and third try */
const P2 = 70, P3 = 196;
const SH: React.FC<{ f: number }> = ({ f }) => {
  const lever = Math.max(pullAt(f, P2), pullAt(f, P3));
  return <VStage f={f} len={T.i - T.h} exp={1.15} fog={["#0a0a0c", 6, 18]} shake={[P2 + 12, P3 + 12]} shots={[[0, C([2.4, 1.3, 2.2], [0.6, 1.1, 0], 42, 0.04), C([2.2, 1.3, 2.0], [0.6, 1.15, 0], 40, 0.04)], [P3 - 20, C([0.25, 1.62, 1.1], [0, 1.55, 0], 34, 0.04), C([0.2, 1.6, 0.95], [0, 1.56, 0], 30, 0.04)]]}>
    <Gallows f={f} lever={lever} noose={[0, NECK, 0.02]} />
    <group position={[0, jolt(f, P2) + jolt(f, P3), 0]}><Lee f={f} eyes={f > P3 + 20 ? "scared" : "closed"} mouth={f > P3 + 20 ? "fear" : "flat"} /></group>
    <Warder f={f} pos={[-0.95, 0, 0.75]} ry={0.3} /><Warder f={f} pos={[0.95, 0, -0.75]} ry={-0.3} />
    <Hangman f={f} pull={lever} />
  </VStage>;
};
const HH: React.FC<{ f: number }> = ({ f }) => <>
  <Attempt f={f} a={0} b={P3 - 10} n={2} /><XMark f={f} a={P2 + 60} y={560} />
  <Attempt f={f} a={P3 - 10} b={310} n={3} /><XMark f={f} a={P3 + 76} y={560} />
</>;
/* I — the prison doctor refuses */
const SI: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.j - T.i} exp={1.2} fog={["#0a0a0c", 6, 18]} shots={[[0, C([-0.7, 1.6, 2.3], [-2.4, 1.45, -0.4], 40, 0.06), C([-0.9, 1.6, 2.0], [-2.4, 1.5, -0.4], 38, 0.06)]]}>
  <Gallows f={f} lever={0} noose={[0, NECK, 0.02]} />
  <Lee f={f} eyes="scared" />
  <Doc f={f} raise={sm(10, 30, f)} />
  <Chap f={f} />
</VStage>;
const HI: React.FC<{ f: number }> = ({ f }) => <Tag f={f} a={24} b={150} x={540} y={300} text={"“I WON'T GO ON”"} sub="THE PRISON DOCTOR" />;
/* J — the dream the night before */
const SJ: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.k - T.j} exp={1.2} fog={["#000", 5, 14]} shots={[[0, C([0.6, 1.4, 1.1], [-1.1, 0.6, -0.4], 42, 0.05), C([0.3, 1.25, 0.8], [-1.1, 0.6, -0.4], 38, 0.05)]]}>
  <Cell f={f} night={1} />
  <Bot5 pos={[-1.1, 0.68, 0.45]} rot={[-Math.PI / 2, 0, 0]} p={{ ...STAND, lArmZ: -6, rArmZ: 6, headY: Math.sin(f / 40) * 6 }} f={f} outfit="convict" hood={false} eyes="closed" mouth="flat" ground={false} />
</VStage>;
const Dream: React.FC<{ f: number; a: number }> = ({ f, a }) => { if (f < a) return null; const k = ip(f, [a, a + 18], [0, 1], eo);
  return <div style={{ position: "absolute", left: 540, top: 470, transform: `translate(-50%,-50%) scale(${k})`, opacity: k }}>
    <div style={{ width: 640, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(240,240,255,0.95), rgba(200,205,235,0.85))", boxShadow: "0 0 60px rgba(150,170,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={420} height={260} viewBox="0 0 420 260"><g stroke="#1a1a24" strokeWidth={8} fill="none" strokeLinecap="round"><line x1={70} y1={250} x2={70} y2={30} /><line x1={350} y1={250} x2={350} y2={30} /><line x1={50} y1={30} x2={370} y2={30} /><line x1={210} y1={30} x2={210} y2={95} /></g>
        <circle cx={210} cy={112} r={20} fill="#1a1a24" /><line x1={210} y1={132} x2={210} y2={190} stroke="#1a1a24" strokeWidth={10} strokeLinecap="round" /><line x1={210} y1={190} x2={192} y2={228} stroke="#1a1a24" strokeWidth={9} strokeLinecap="round" /><line x1={210} y1={190} x2={228} y2={228} stroke="#1a1a24" strokeWidth={9} strokeLinecap="round" />
        <rect x={130} y={230} width={160} height={14} fill="#6a4a2a" /><text x={330} y={150} fontSize={90} fontFamily="Oswald" fontWeight={700} fill={RED} opacity={0.5 + 0.5 * Math.sin(f / 6)}>?</text></svg>
    </div>
    {[[-250, 260, 46], [-300, 330, 30], [-330, 380, 18]].map(([x, y, r], i) => <div key={i} style={{ position: "absolute", left: 320 + x, top: y, width: r, height: r * 0.8, borderRadius: "50%", background: "rgba(230,232,250,0.9)" }} />)}
  </div>; };
const HJ: React.FC<{ f: number }> = ({ f }) => <>
  <Dream f={f} a={20} />
  <Tag f={f} a={120} b={240} x={540} y={790} text="HE DREAMED IT" sub="THE NIGHT BEFORE" />
</>;
/* K — the sentence is cancelled (commuted) */
const SK: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.l - T.k} exp={0.9} fog={["#0a0a0c", 6, 18]} shots={[[0, C([3, 2.2, 3.4], [0, 1.4, 0], 44, 0.0), C([2.8, 2.2, 3.1], [0, 1.4, 0], 42, 0.0)]]}>
  <Gallows f={f} noose={[0, 2.0, 0]} />
</VStage>;
const Doc2: React.FC<{ f: number }> = ({ f }) => { const k = ip(f, [0, 16], [0, 1], eo);
  return <>
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)", opacity: k }} />
    <div style={{ position: "absolute", left: 540, top: 720, width: 760, transform: `translate(-50%,-50%) rotate(${-3 + (1 - k) * 5}deg) translateY(${(1 - k) * 80}px)`, opacity: k, background: "linear-gradient(180deg, #efe6d0, #e0d4b8)", padding: "50px 60px 60px", boxShadow: "0 30px 60px rgba(0,0,0,0.7)", borderRadius: 6, fontFamily: "serif", color: "#2a2018" }}>
      <div style={{ textAlign: "center", fontSize: 30, letterSpacing: 8 }}>HOME OFFICE · WHITEHALL</div>
      <div style={{ height: 3, background: "#2a2018", margin: "16px 0 26px" }} />
      <div style={{ fontSize: 40, lineHeight: 1.35 }}>The sentence of death passed upon <b>John Lee</b> is hereby commuted to penal servitude for life.</div>
      <div style={{ marginTop: 34, fontSize: 30, fontStyle: "italic", textAlign: "right" }}>— Secretary of State, 1885</div>
    </div>
    <Slam f={f} a={44} b={140} text="CANCELLED" y={880} size={130} rot={-10} />
  </>; };
/* L — 22 years later: the gate opens */
const SL: React.FC<{ f: number }> = ({ f }) => {
  const g = sm(110, 160, f), k = ip(f, [150, 240], [0, 1]);
  return <VStage f={f} len={T.m - T.l} exp={1.1} fog={["#b8b0a8", 30, 160]} shots={[[0, C([0, 1.6, 12], [0, 3.2, -6], 42, 0.05), C([0, 1.6, 9.5], [0, 2.6, -6], 40, 0.05)]]}>
    <PrisonFront f={f} gate={g} sky="sunset" />
    {f > 140 && <Bot5 pos={[0, 0, -5.4 + k * 4.2]} ry={0} p={walk(f, 0.9)} f={f} outfit="villager" hood={false} eyes="calm" mouth="flat" />}
  </VStage>;
};
const HL: React.FC<{ f: number }> = ({ f }) => <>
  <Count f={f} a={6} b={150} from={1885} to={1907} dur={100} label="YEARS LATER" y={230} fmt={(v) => String(Math.round(v))} />
  <Slam f={f} a={180} b={250} text="FREE MAN" y={330} col="#5ad07a" rot={-5} />
</>;
/* M — why did it fail? blueprint */
const SM: React.FC<{ f: number }> = ({ f }) => { const k = ip(f, [0, 20], [0, 1], eo), dr = ip(f, [10, 90], [0, 1]);
  const L = (x1: number, y1: number, x2: number, y2: number, d: number, w = 5) => { const q = Math.max(0, Math.min(1, (dr - d) * 3)); return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * q} y2={y1 + (y2 - y1) * q} stroke="#cfe4ff" strokeWidth={w} strokeLinecap="round" />; };
  const qm = (x: number, y: number, d: number) => { const o = ip(f, [d, d + 10], [0, 1]); return <text x={x} y={y} fontSize={110} fontFamily="Oswald" fontWeight={700} fill="#ff4d5a" opacity={o * (0.7 + 0.3 * Math.sin(f / 7 + x))} textAnchor="middle">?</text>; };
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1d4a7a, #0a1a30)", opacity: k }}>
    <svg width={W} height={H} style={{ position: "absolute", opacity: 0.25 }}>{Array.from({ length: 40 }).map((_, i) => <line key={i} x1={i * 30} y1={0} x2={i * 30} y2={H} stroke="#8ab4e0" strokeWidth={1} />)}{Array.from({ length: 70 }).map((_, i) => <line key={"h" + i} x1={0} y1={i * 30} x2={W} y2={i * 30} stroke="#8ab4e0" strokeWidth={1} />)}</svg>
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {L(140, 760, 420, 760, 0, 8)}{L(660, 760, 940, 760, 0.05, 8)}
      {L(420, 760, 540, 760, 0.1)}{L(540, 760, 660, 760, 0.1)}
      {L(420, 790, 660, 790, 0.2, 10)}{L(660, 790, 760, 790, 0.25, 4)}
      {L(780, 760, 840, 560, 0.3, 10)}{L(840, 560, 860, 550, 0.35, 14)}
      {L(420, 760, 420, 1100, 0.4, 3)}{L(660, 760, 660, 1100, 0.4, 3)}
      {qm(540, 720, 0.5)}{qm(720, 870, 0.6)}{qm(380, 870, 0.7)}
      <circle cx={780} cy={790} r={14} fill="none" stroke="#cfe4ff" strokeWidth={4} opacity={dr} />
      {[[300, 735, "TRAP"], [540, 830, "BOLT"], [880, 520, "LEVER"], [540, 1060, "PIT  ·  7 FT"]].map(([x, y, t], i) => <text key={i} x={x as number} y={y as number} fontSize={34} fontFamily="Oswald" fill="#cfe4ff" textAnchor="middle" letterSpacing={6} opacity={ip(f, [30 + i * 10, 44 + i * 10], [0, 0.9])}>{t}</text>)}
      <text x={540} y={1180} fontSize={40} fontFamily="Oswald" fill="#cfe4ff" textAnchor="middle" letterSpacing={8}>EXETER PRISON · 1885</text>
    </svg>
  </AbsoluteFill>; };
const HM: React.FC<{ f: number }> = ({ f }) => <Head f={f} a={20} b={170} big="WHY?" small="NO ONE EVER FOUND OUT" y={300} col="#ff4d5a" />;
/* N — end */
const SN: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={S2_FRAMES - T.n} exp={1.1} fog={["#0a0a0c", 6, 18]} shots={[[0, C([0.0, 1.5, 3.6], [0, 1.9, 0], 40, 0.0), C([0.0, 1.5, 3.1], [0, 2.0, 0], 38, 0.0)]]}>
  <Gallows f={f} noose={[Math.sin(f / 50) * 0.04, 2.0, 0]} />
</VStage>;
const HN: React.FC<{ f: number }> = ({ f }) => <EndQ f={f} a={4} l1="LUCK..." l2="OR SOMETHING ELSE?" />;

const Sx = (S: React.FC<{ f: number }>, Hh?: React.FC<{ f: number }>): React.FC<{ f: number }> => ({ f }) => <><S f={f} />{Hh && <Hh f={f} />}</>;
const LIST: Sc[] = [
  [T.a, T.a2, Sx(SA1, HA1), "cut"], [T.a2, T.b, Sx(SA2, HA2), "dark"], [T.b, T.c, Sx(SB, HB), "dark"], [T.c, T.d, Sx(SC_, HC), "fade"],
  [T.d, T.e, Sx(SD), "fade"], [T.e, T.f, Sx(SE, HE), "fade"], [T.f, T.g, Sx(SF, HF), "cut"], [T.g, T.h, Sx(SG, HG), "fade"],
  [T.h, T.i, Sx(SH, HH), "fade"], [T.i, T.j, Sx(SI, HI), "whip"], [T.j, T.k, Sx(SJ, HJ), "dark"], [T.k, T.l, Sx(SK, Doc2), "fade"],
  [T.l, T.m, Sx(SL, HL), "dark"], [T.m, T.n, Sx(SM, HM), "zoom"], [T.n, S2_FRAMES, Sx(SN, HN), "dark"],
];
export const S2: React.FC<{ audio?: boolean }> = ({ audio = false }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <AbsoluteFill style={{ filter: "contrast(1.06) saturate(0.9) sepia(0.12)" }}><Scenes list={LIST} /></AbsoluteFill>
    <Grade tint="rgba(120,90,50,0.10)" />
    <Progress total={S2_FRAMES} />
    <Subs words={WORDS} stop={T.n - 4} />
    {audio && <Audio src={staticFile("cases/s2mix.wav")} />}
  </AbsoluteFill>
);
