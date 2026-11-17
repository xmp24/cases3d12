import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Bot5 } from "../Tort/Bot5";
import { STAND, BP, walkBP, mixBP, SIT } from "../Tort/Bot5";
import { VStage, C, ip, ez, eo, sm, Snow, Puffs, Subs, Stamp0, Tag, Slam, Head, Count, EndQ, Grade, Progress, Flashes, Scenes, Sc, V3, FPS, W, font, INK, RED } from "./V";
import { FarmWorld, Farm, Kitchen, Attic, Lantern, BarnIn, Cow, Memorial, Ground, Pines, NightLights, Dust, Smoke, groundH, trailP, Footprints } from "./Farm";
import { Sky } from "../Tort/Common";
import WJ from "./s1w.json";

export const S1_FRAMES = 3060;
const WORDS = (WJ as any).words;
const T = { a: 0, b: 450, c: 575, d: 708, e: 890, f: 1085, g: 1270, h: 1460, i: 1630, j: 1850, k: 2152, l: 2245, m: 2352, n: 2652, o: 2868 };

const P = (x: number, z: number, dy = 0): V3 => [x, groundH(x, z) + dy, z];
const walk = (f: number, sp = 1, amp = 1): BP => walkBP((f / FPS) * Math.PI * 2 * 0.85 * sp, amp);
/** bot that walks along a straight line from a to b between frames f0..f1 */
const Walker: React.FC<{ f: number; a: [number, number]; b: [number, number]; f0: number; f1: number; kind: any; item?: React.ReactNode; lItem?: React.ReactNode; headY?: number; eyes?: any; mouth?: any; ground?: boolean; floorY?: number }> = ({ f, a, b, f0, f1, kind, item, lItem, headY = 0, eyes = "calm", mouth = "flat", floorY }) => {
  const k = ip(f, [f0, f1], [0, 1]), x = a[0] + (b[0] - a[0]) * k, z = a[1] + (b[1] - a[1]) * k, ry = Math.atan2(b[0] - a[0], b[1] - a[1]);
  const moving = f > f0 && f < f1;
  const p0 = moving ? walk(f, 1, 0.9) : STAND;
  const p: BP = { ...p0, headY, rArmX: item ? -38 : p0.rArmX, rElbow: item ? -30 : p0.rElbow, rArmZ: item ? 12 : p0.rArmZ, lArmX: lItem ? 6 : p0.lArmX, lElbow: lItem ? -4 : p0.lElbow };
  return <Bot5 pos={floorY !== undefined ? [x, floorY, z] : P(x, z)} ry={ry} p={p} f={f} outfit={kind} hood={false} eyes={eyes} mouth={mouth} rHandItem={item} lHandItem={lItem} />;
};
const Bag: React.FC = () => <group position={[0, -0.12, 0]}><mesh castShadow><boxGeometry args={[0.36, 0.26, 0.12]} /><meshStandardMaterial color="#4a3020" roughness={0.6} /></mesh><mesh position={[0, 0.15, 0]}><torusGeometry args={[0.05, 0.01, 6, 12, Math.PI]} /><meshStandardMaterial color="#2a1a10" /></mesh></group>;

/* A — hook: footprints in the snow, the farmer finds them; crane up to the whole trail forest -> farm */
const SA: React.FC<{ f: number }> = ({ f }) => {
  const [fx, fz] = trailP(0.55);
  const bend: BP = { ...STAND, lean: 26, headX: 34, lArmX: -10, lElbow: -30, rArmX: -40, rElbow: -40, rArmZ: 10, lKnee: 14, rKnee: 14 };
  const p = mixBP(STAND, bend, sm(30, 110, f));
  return <VStage f={f} len={T.b} exp={1.35} fog={["#0a0e1a", 18, 120]} shots={[
    [0, C(P(fx - 1.0, fz + 7.0, 1.5), P(fx + 2.5, fz - 6, 0.0), 44, 0.04), C(P(fx - 0.2, fz + 1.2, 0.8), P(fx + 4.2, fz - 10, 1.5), 36, 0.04)],
    [250, C(P(fx - 1.5, fz + 4, 2.6), P(fx + 4, fz - 10, 1.0), 42, 0.04), C([-30, 22, 76], [-5, 0, 12], 42, 0.05)]]}>
    <NightLights />
    <FarmWorld f={f} farm={{ lit: [0.9, 0.7, 0.8, 0.3, 0.6, 0.4], smoke: 0.7 }} />
    <Bot5 pos={P(fx + 2.1, fz - 4.2)} ry={-Math.PI * 0.62} p={p} f={f} outfit="farmer" hood={false} eyes="calm" mouth="flat" rHandItem={<Lantern f={f} light />} />
    <Snow f={f} c={P(fx, fz, 0)} r={5} n={700} h={5} s={0.03} />
    <Snow f={f} c={[-10, 0, 20]} r={40} n={1800} h={28} s={0.12} o={0.7} />
  </VStage>;
};
const HA: React.FC<{ f: number }> = ({ f }) => <>
  <Head f={f} a={14} b={210} big="1922" small="BAVARIA · GERMANY" />
  <Tag f={f} a={268} b={440} x={540} y={300} text="FOREST → FARM" sub="ONE SET OF FOOTPRINTS" />
</>;
/* B — looking back from the farm: every print points to the house */
const SB: React.FC<{ f: number }> = ({ f }) => {
  const [x0, z0] = trailP(0.93);
  return <VStage f={f} len={T.c - T.b} exp={1.3} fog={["#0a0e1a", 18, 110]} shots={[[0, C(P(x0 + 0.4, z0 - 1.2, 1.7), P(x0 - 8, z0 + 30, 0), 42, 0.03), C(P(x0 + 0.3, z0 - 2.0, 2.4), P(x0 - 9, z0 + 30, 0), 40, 0.03)]]}>
    <NightLights />
    <FarmWorld f={f} farm={{ lit: [0.9, 0.7, 0.8, 0.3, 0.6, 0.4], smoke: 0.7 }} />
    <Snow f={f} c={P(x0, z0 + 4, 0)} r={8} n={900} h={7} s={0.035} />
  </VStage>;
};
const HB: React.FC<{ f: number }> = ({ f }) => <>
  <Tag f={f} a={8} b={118} x={540} y={330} text="0 GOING BACK" col="#ff4d5a" />
  {[0, 1, 2].map((i) => { const k = ip(f, [16 + i * 8, 34 + i * 8], [0, 1], eo); return <div key={i} style={{ position: "absolute", left: 540 - 60 + (i - 1) * 140, top: 760 + i * 70, opacity: k * ip(f, [100, 118], [1, 0]), transform: `scale(${k})`, ...font, fontSize: 90, color: "#ff4d5a", WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill" }}>✕</div>; })}
</>;
/* C — the key board: one key fades away */
const SC_: React.FC<{ f: number }> = ({ f }) => {
  const keys = 4 - sm(40, 70, f) * 0.999;
  return <VStage f={f} len={T.d - T.c} exp={1.25} fog={["#000", 4, 14]} shots={[[0, C([0.55, 1.5, 1.2], [2.98, 1.45, 1.2], 36, 0.06), C([0.95, 1.49, 1.2], [2.98, 1.45, 1.2], 32, 0.06)]]}>
    <Kitchen f={f} keys={keys} paper={0} />
    <pointLight position={[2.3, 2.0, 1.9]} intensity={2.2} distance={3} decay={1.5} color="#ffb070" />
  </VStage>;
};
const HC: React.FC<{ f: number }> = ({ f }) => <Tag f={f} a={72} b={128} x={540} y={330} text="1 KEY MISSING" />;
/* D — newspaper on the table */
const SD: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.e - T.d} exp={1.25} fog={["#000", 4, 14]} shots={[[0, C([1.3, 1.85, 0.5], [1.05, 0.8, -0.55], 36, 0.08), C([1.15, 1.45, 0.0], [1.05, 0.8, -0.55], 32, 0.08)]]}>
  <Kitchen f={f} keys={3} />
</VStage>;
const HD: React.FC<{ f: number }> = ({ f }) => <>
  <Tag f={f} a={70} b={175} x={540} y={300} text="NOBODY BOUGHT IT" />
  <Stamp0 f={f} a={6} b={170} l1="DAYS BEFORE" l2="HINTERKAIFECK FARM" rec={false} />
</>;
/* E — night: the farmer at the table hears steps above; dust trickles from the beams */
const SE: React.FC<{ f: number }> = ({ f }) => {
  const up = sm(40, 70, f);
  const p: BP = { ...SIT, lean: -2, headX: 6 - up * 34, headY: -10 + up * 20, lArmX: -40, lElbow: -50, rArmX: -40, rElbow: -50, lArmZ: -10, rArmZ: 10 };
  return <VStage f={f} len={T.f - T.e} exp={1.15} fog={["#000", 4, 14]} shake={[60, 104, 148]} shots={[[0, C([2.2, 1.55, 2.0], [1.2, 1.3, -1.35], 40, 0.05), C([2.0, 1.5, 1.6], [1.2, 1.35, -1.35], 38, 0.05)], [118, C([2.7, 0.85, -0.2], [1.0, 2.0, -1.6], 52, 0.0), C([2.65, 0.85, -0.35], [1.0, 2.1, -1.7], 50, 0.0)]]}>
    <Kitchen f={f} keys={3} stove={0.45} lamp={0.8} />
    <Bot5 pos={[1.2, 0, -1.35]} ry={0} p={p} f={f} outfit="farmer" hood={false} eyes={up > 0.5 ? "scared" : "calm"} mouth={up > 0.5 ? "fear" : "flat"} pupil={0.8} />
    {[60, 104, 148].map((t, i) => f > t && f < t + 120 && <Dust key={i} f={f - t} c={[0.6 + i * 0.4, 2.0, -1.4]} n={70} r={0.35} fall={1} o={ip(f - t, [0, 10, 90, 120], [0, 1, 1, 0])} />)}
  </VStage>;
};
const HE: React.FC<{ f: number }> = ({ f }) => <>
  <Stamp0 f={f} a={6} b={190} l1="11:52 PM" l2="SOMETHING IN THE ATTIC" />
</>;
/* F — attic search with the lantern: nobody */
const SF: React.FC<{ f: number }> = ({ f }) => {
  const k = ip(f, [0, 120], [0, 1]), x = -3.4 + k * 4.0, z = 0.9 - k * 0.4;
  const look = Math.sin(f / 40) * 35;
  return <VStage f={f} len={T.g - T.f} exp={1.15} fog={["#000", 4, 15]} shots={[[0, C([x + 3.4, 1.55, 0.2], [x, 1.1, 0.5], 46, 0.05), C([x + 3.1, 1.5, 0.25], [x, 1.1, 0.5], 44, 0.05)], [125, C([3.9, 1.6, 0.0], [0.4, 1.0, 0.4], 50, 0.04), C([3.7, 1.55, 0.05], [0.4, 1.0, 0.4], 48, 0.04)]]}>
    <Attic f={f} moon={0.9} lamp={null} />
    <Walker f={f} a={[-3.4, 0.9]} b={[0.6, 0.5]} f0={0} f1={120} kind="farmer" headY={look} floorY={0} eyes="scared" item={<Lantern f={f} light />} />
  </VStage>;
};
const HF: React.FC<{ f: number }> = ({ f }) => <Slam f={f} a={129} b={185} text="NOBODY" y={330} />;
/* G — the maid leaves at dusk with her bag, looking back */
const SG: React.FC<{ f: number }> = ({ f }) => {
  const [x1, z1] = trailP(0.82);
  return <VStage f={f} len={T.h - T.g} exp={1.2} fog={["#2a1c26", 20, 120]} shots={[[0, C(P(-5.8, 17.5, 1.3), P(-1.2, 4, 2.2), 36, 0.05), C(P(-5.6, 16.5, 1.35), P(-1.6, 4, 2.2), 34, 0.05)]]}>
    <NightLights dusk={1} k={0.9} />
    <FarmWorld f={f} sky="dusk" trail={0} farm={{ lit: [0.6, 0.2, 0.5, 0, 0.4, 0], smoke: 0.5 }} />
    <Walker f={f} a={[-0.6, 3.6]} b={[-4.4, 13]} f0={0} f1={200} kind="maid" headY={ip(f, [40, 80, 150, 180], [0, 120, 120, 0], ez)} eyes="scared" mouth="flat" lItem={<Bag />} />
  </VStage>;
};
const HG: React.FC<{ f: number }> = ({ f }) => <Tag f={f} a={86} b={186} x={540} y={300} text={"“THE HOUSE IS HAUNTED”"} />;
/* H — the new maid arrives at the door, the farmer opens */
const SH: React.FC<{ f: number }> = ({ f }) => {
  const door = sm(70, 100, f);
  return <VStage f={f} len={T.i - T.h} exp={1.2} fog={["#2a1c26", 20, 120]} shots={[[0, C(P(5.4, 13.5, 1.8), P(0.2, 3, 1.7), 36, 0.05), C(P(4.4, 12, 1.75), P(-0.2, 3, 1.7), 34, 0.05)]]}>
    <NightLights dusk={1} k={0.85} />
    <FarmWorld f={f} sky="dusk" trail={0} farm={{ lit: [0.8, 0.5, 0.7, 0.4, 0.6, 0.2], smoke: 0.6, door }} />
    <Walker f={f} a={[3.4, 9.6]} b={[-0.3, 3.5]} f0={0} f1={110} kind="maid" eyes="calm" mouth="flat" lItem={<Bag />} />
    {door > 0.3 && <Bot5 pos={P(-0.6, 2.35)} ry={0.4} p={STAND} f={f} outfit="farmer" hood={false} eyes="calm" mouth="flat" />}
  </VStage>;
};
const HH: React.FC<{ f: number }> = ({ f }) => <Stamp0 f={f} a={6} b={160} l1="MARCH 31, 1922" l2="THE NEW MAID ARRIVES" />;
/* I — that night: six lights go out one by one */
const OUT = [40, 64, 88, 112, 136, 160];
const SI: React.FC<{ f: number }> = ({ f }) => {
  const lit = OUT.map((t) => 1 - sm(t, t + 6, f));
  return <VStage f={f} len={T.j - T.i} exp={1.25} fog={["#0a0e1a", 20, 120]} shots={[[0, C([-8, 3.5, 26], [3, 3, -2], 34, 0.05), C([-6, 3.2, 21], [3, 3, -2], 32, 0.05)]]}>
    <NightLights k={0.9} red={sm(170, 200, f)} />
    <FarmWorld f={f} farm={{ lit, smoke: 0.3 * (1 - sm(150, 200, f)) }} />
    <Snow f={f} c={[-6, 0, 18]} r={10} n={1200} h={9} s={0.04} />
  </VStage>;
};
const HI: React.FC<{ f: number }> = ({ f }) => <>
  <div style={{ position: "absolute", top: 260, width: "100%", display: "flex", justifyContent: "center", gap: 26 }}>{OUT.map((t, i) => { const k = ip(f, [6 + i * 4, 18 + i * 4], [0, 1], eo), r = sm(t, t + 6, f);
    return <svg key={i} width={120} height={200} viewBox="0 0 60 100" style={{ transform: `scale(${k})`, opacity: k }}><circle cx={30} cy={18} r={14} fill={r > 0.5 ? RED : "#fff"} stroke={INK} strokeWidth={4} /><path d="M10 96 L14 44 Q30 32 46 44 L50 96 Z" fill={r > 0.5 ? RED : "#fff"} stroke={INK} strokeWidth={4} /></svg>; })}</div>
  <Count f={f} a={170} b={215} from={6} to={6} dur={1} label="PEOPLE MURDERED" y={500} col="#ff4d5a" size={170} />
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(120,0,0,0.0), rgba(90,0,0,0.5))", opacity: sm(165, 200, f), mixBlendMode: "multiply" }} />
</>;
/* J — days pass; smoke keeps rising, a shadow crosses the lit window */
const SJ: React.FC<{ f: number }> = ({ f }) => {
  const sx = ((f % 140) / 140) * 1.4 - 0.7;
  return <VStage f={f} len={T.k - T.j} exp={1.25} fog={["#0a0e1a", 20, 120]} shots={[[0, C([7, 2.4, 12], [3, 1.9, 2], 32, 0.07), C([5.5, 2.2, 8.5], [3, 1.9, 2], 30, 0.07)]]}>
    <NightLights k={0.85} />
    <FarmWorld f={f} trail={0} farm={{ lit: [0, 0.95, 0, 0, 0, 0], smoke: 0.8, shadow: f > 130 ? 0.92 : 0, shadowX: sx }} />
    <Snow f={f} c={[5, 0, 7]} r={6} n={900} h={7} s={0.03} />
  </VStage>;
};
const HJ: React.FC<{ f: number }> = ({ f }) => <>
  <Count f={f} a={140} b={300} from={1} to={4} dur={140} label="DAYS LATER" y={240} fmt={(v) => "DAY " + Math.floor(v)} />
  <Tag f={f} a={200} b={295} x={540} y={600} text="SOMEONE WAS INSIDE" col="#ff4d5a" />
</>;
/* K — the cows were fed */
const SK: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.l - T.k} exp={1.2} fog={["#000", 5, 18]} shots={[[0, C([2.6, 1.9, 4.8], [-0.4, 1.0, -1.2], 42, 0.05), C([2.0, 1.8, 4.2], [-0.6, 1.0, -1.2], 40, 0.05)]]}>
  <BarnIn f={f} />
  {[-2.9, -0.8, 1.3, 3.4].map((x, i) => <Cow key={i} f={f} p={[x, 0, -0.3]} ry={Math.PI} seed={i} />)}
</VStage>;
const HK: React.FC<{ f: number }> = ({ f }) => <Tag f={f} a={8} b={88} x={540} y={300} text="THE COWS WERE FED" />;
/* L — smoke from the chimney */
const SL: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.m - T.l} exp={1.3} fog={["#0a0e1a", 20, 120]} shots={[[0, C(P(-13, 40, 1.6), [-1, 8, -2], 34, 0.04), C(P(-12.6, 38.5, 1.6), [-1, 8.5, -2], 33, 0.04)]]}>
  <NightLights />
  <FarmWorld f={f} trail={0} farm={{ lit: [0, 0.8, 0, 0, 0, 0], smoke: 1 }} />
  <Bot5 pos={P(-10.6, 35.6)} ry={Math.atan2(10, -38)} p={STAND} f={f} outfit="villager" hood={false} eyes="scared" mouth="flat" />
  <Snow f={f} c={[-4, 6, 2]} r={6} n={700} h={8} s={0.03} />
</VStage>;
const HL: React.FC<{ f: number }> = ({ f }) => <Tag f={f} a={8} b={100} x={540} y={300} text="SMOKE FROM THE CHIMNEY" />;
/* M — 1923 demolition: boards pried up, the mattock under the attic floor */
const SM: React.FC<{ f: number }> = ({ f }) => {
  const b = sm(60, 140, f);
  return <VStage f={f} len={T.n - T.m} exp={1.25} fog={["#000", 4, 15]} shots={[[0, C([3.4, 1.6, 0.3], [0.6, 0.2, 0.6], 44, 0.05), C([2.8, 1.45, 0.35], [0.6, 0.1, 0.6], 40, 0.05)], [170, C([1.9, 1.45, 0.15], [0.75, -0.08, 0.42], 40, 0.06), C([1.65, 1.2, 0.2], [0.8, -0.08, 0.42], 36, 0.06)]]}>
    <Attic f={f} moon={1.4} day={1} boards={b} weapon={b > 0.6 ? 1 : 0} />
  </VStage>;
};
const HM: React.FC<{ f: number }> = ({ f }) => <>
  <Stamp0 f={f} a={6} b={150} l1="1923" l2="THE FARM IS TORN DOWN" rec={false} />
  <Tag f={f} a={190} b={295} x={540} y={300} text="MURDER WEAPON" sub="HIDDEN UNDER THE ATTIC FLOOR" col="#ff4d5a" />
</>;
/* N — memorial in the snow */
const SN: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={T.o - T.n} exp={1.25} fog={["#0a0e1a", 8, 60]} shots={[[0, C([0.9, 1.3, 4.6], [0, 0.95, 0], 38, 0.06), C([0.6, 1.2, 3.7], [0, 0.95, 0], 36, 0.06)]]}>
  <NightLights k={0.7} />
  <Sky kind="night" f={f / 2} stars={0.8} moon={[-50, 55, -60]} />
  <group position={[0, -groundH(0, 0), 0]}><Ground /></group>
  <group position={[0, 0, -40]}><Pines n={200} seed="mp" area={(i) => [((i * 37) % 120) - 60, -10 - ((i * 53) % 40)]} /></group>
  <Memorial f={f} />
  <Snow f={f} c={[0, 0, 0]} r={4} n={600} h={4} s={0.025} />
</VStage>;
const HN: React.FC<{ f: number }> = ({ f }) => <>
  <Count f={f} a={8} b={200} from={1922} to={2026} dur={110} label="STILL UNSOLVED" y={240} fmt={(v) => String(Math.round(v))} />
  <Slam f={f} a={120} b={210} text="UNSOLVED" y={560} />
</>;
/* O — end: the dark farm, the attic window glowing */
const SO: React.FC<{ f: number }> = ({ f }) => <VStage f={f} len={S1_FRAMES - T.o} exp={1.25} fog={["#0a0e1a", 20, 120]} shots={[[0, C([-14, 2.6, 22], [0, 6.5, -2], 34, 0.02), C([-12, 2.6, 18.5], [0, 6.8, -2], 33, 0.02)]]}>
  <NightLights k={0.85} />
  <FarmWorld f={f} farm={{ lit: [0, 0, 0, 0, 0, 0], attic: 0.5 + Math.sin(f / 9) * 0.1 }} />
  <Snow f={f} c={[-10, 0, 14]} r={10} n={1200} h={9} s={0.04} />
</VStage>;
const HO: React.FC<{ f: number }> = ({ f }) => <EndQ f={f} a={4} l1="WOULD YOU HAVE STAYED" l2="IN THAT HOUSE?" />;

const Sx = (S: React.FC<{ f: number }>, H?: React.FC<{ f: number }>): React.FC<{ f: number }> => ({ f }) => <><S f={f} />{H && <H f={f} />}</>;
const LIST: Sc[] = [
  [T.a, T.b, Sx(SA, HA), "cut"], [T.b, T.c, Sx(SB, HB), "whip"], [T.c, T.d, Sx(SC_, HC), "dark"], [T.d, T.e, Sx(SD, HD), "fade"],
  [T.e, T.f, Sx(SE, HE), "dark"], [T.f, T.g, Sx(SF, HF), "fade"], [T.g, T.h, Sx(SG, HG), "dark"], [T.h, T.i, Sx(SH, HH), "fade"],
  [T.i, T.j, Sx(SI, HI), "dark"], [T.j, T.k, Sx(SJ, HJ), "dark"], [T.k, T.l, Sx(SK, HK), "whip"], [T.l, T.m, Sx(SL, HL), "whip"],
  [T.m, T.n, Sx(SM, HM), "dark"], [T.n, T.o, Sx(SN, HN), "dark"], [T.o, S1_FRAMES, Sx(SO, HO), "fade"],
];
export const S1: React.FC<{ audio?: boolean }> = ({ audio = false }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <AbsoluteFill style={{ filter: "contrast(1.06) saturate(0.92)" }}><Scenes list={LIST} /></AbsoluteFill>
    <Grade tint="rgba(60,90,140,0.12)" />
    <Progress total={S1_FRAMES} />
    <Subs words={WORDS} stop={T.o - 4} />
    {audio && <Audio src={staticFile("cases/s1mix.wav")} />}
  </AbsoluteFill>
);
