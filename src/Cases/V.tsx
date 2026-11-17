import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Sequence, interpolate, random, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { noise2D } from "@remotion/noise";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";
import { upgradeScene } from "../Tort/Common";
import { textTex } from "../Miya3/Sets3";

export const W = 1080, H = 1920, FPS = 60, INK = "#121214", RED = "#e0182e";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ez = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const eo = (t: number) => 1 - Math.pow(1 - t, 3);
export const sm = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const L3 = (a: number[], b: number[], k: number) => a.map((v, i) => v + (b[i] - v) * k) as [number, number, number];
export const ip = (f: number, a: number[], b: number[], e?: (x: number) => number) => interpolate(f, a, b, e ? { ...clamp, easing: e } : clamp);
export type V3 = [number, number, number];
export type Cam = { pos: V3; look: V3; fov: number; shift: number };
export type Shot = [number, Cam, Cam];
export const C = (pos: V3, look: V3, fov = 40, shift = 0): Cam => ({ pos, look, fov, shift });

const Rig: React.FC<{ pos: V3; look: V3; fov: number; shift: number; exp: number; roll: number }> = ({ pos, look, fov, shift, exp, roll }) => {
  const { camera, gl, scene } = useThree();
  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = exp; upgradeScene(scene);
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...pos); c.up.set(0, 1, 0); c.lookAt(...look); if (roll) c.rotateZ(roll); c.fov = fov;
    if (shift) c.setViewOffset(W, H, 0, shift * H, W, H); else c.clearViewOffset();
    c.near = 0.03; c.far = 2000; c.updateProjectionMatrix();
  });
  return null;
};
/** vertical 3D stage: list of camera shots that glide from->to; shift moves the lens up so subjects sit above the captions; shake is a decaying jolt */
export const VStage: React.FC<{ f: number; len: number; shots: Shot[]; fog?: [string, number, number]; exp?: number; bg?: string; shake?: number[]; hand?: number; roll?: number; children: React.ReactNode }> = ({ f, len, shots, fog = ["#07080c", 10, 40], exp = 1.25, bg = "#000", shake = [], hand = 1, roll = 0, children }) => {
  let si = 0; for (let i = 0; i < shots.length; i++) if (f >= shots[i][0]) si = i;
  const [s0, a, b] = shots[si], s1 = si + 1 < shots.length ? shots[si + 1][0] : len;
  const lin = interpolate(f, [s0, s1], [0, 1], clamp), k = ez(lin) * 0.7 + lin * 0.3;
  const pos = L3(a.pos, b.pos, k), look = L3(a.look, b.look, k);
  let sh = 0; for (const t of shake) { const q = (f - t) / 26; if (q >= 0 && q < 1) sh = Math.max(sh, Math.pow(1 - q, 2)); }
  pos[0] += noise2D("hx", f / 140, 0) * 0.012 * hand + noise2D("sx", f / 2.2, 0) * 0.05 * sh;
  pos[1] += noise2D("hy", f / 160, 0) * 0.009 * hand + noise2D("sy", f / 2.4, 0) * 0.04 * sh;
  return (
    <ThreeCanvas width={W} height={H} shadows="soft" style={{ position: "absolute", background: bg }} camera={{ fov: a.fov, position: a.pos, near: 0.03, far: 2000 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
      <Rig pos={pos} look={look} fov={a.fov + (b.fov - a.fov) * k} shift={a.shift + (b.shift - a.shift) * k} exp={exp} roll={roll + noise2D("rl", f / 3, 0) * 0.01 * sh} />
      <fog attach="fog" args={[fog[0], fog[1], fog[2]]} />
      {children}
    </ThreeCanvas>
  );
};

/* ---------------- shared 3D bits ---------------- */
export const glow = () => textTex("vglow", 128, 128, (c) => { const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.35, "rgba(255,255,255,0.35)"); g.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = g; c.fillRect(0, 0, 128, 128); });
export const puff = () => textTex("vpuff", 256, 256, (c) => { for (let i = 0; i < 16; i++) { const x = 128 + (random("pu" + i) - 0.5) * 100, y = 128 + (random("pv" + i) - 0.5) * 100, r = 40 + random("pr" + i) * 60; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, "rgba(255,255,255,0.22)"); g.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = g; c.fillRect(0, 0, 256, 256); } });
/** falling snow in a box around the camera target (t in seconds) */
export const Snow: React.FC<{ f: number; c: V3; r?: number; n?: number; h?: number; o?: number; wind?: number; s?: number }> = ({ f, c, r = 6, n = 600, h = 6, o = 0.85, wind = 0.3, s = 0.035 }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const t = f / FPS, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const sp = 0.5 + random("sn" + i) * 0.6, y = h - ((random("sy" + i) * h + t * sp) % h);
    a[i * 3] = c[0] + (random("sx" + i) - 0.5) * r * 2 + Math.sin(t * 0.8 + i) * 0.15 + wind * t * 0.3 % 1;
    a[i * 3 + 1] = c[1] + y - 0.5; a[i * 3 + 2] = c[2] + (random("sz" + i) - 0.5) * r * 2 + Math.cos(t * 0.6 + i * 1.7) * 0.12;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(a, 3));
  return <points geometry={geo}><pointsMaterial map={glow()} color="#eef2ff" size={s} sizeAttenuation transparent opacity={o} depthWrite={false} /></points>;
};
/** soft drifting volume (fog/smoke/clouds) sprites */
export const Puffs: React.FC<{ f: number; n: number; area: [number, number, number, number, number, number]; col?: string; o?: number; s?: [number, number]; drift?: V3; seed?: string; add?: boolean }> = ({ f, n, area, col = "#9aa4b8", o = 0.25, s = [2, 5], drift = [0.05, 0, 0], seed = "pf", add }) => {
  const t = f / FPS; const [x0, x1, y0, y1, z0, z1] = area;
  return <group>{Array.from({ length: n }).map((_, i) => {
    const wx = x1 - x0; const x = x0 + (((random(seed + "x" + i) * wx + drift[0] * t * (0.6 + random(seed + "v" + i))) % wx) + wx) % wx;
    const y = y0 + random(seed + "y" + i) * (y1 - y0) + drift[1] * t, z = z0 + random(seed + "z" + i) * (z1 - z0) + drift[2] * t;
    const sc = s[0] + random(seed + "s" + i) * (s[1] - s[0]);
    return <sprite key={i} position={[x, y, z]} scale={[sc, sc * 0.7, 1]}><spriteMaterial map={puff()} color={col} transparent opacity={o * (0.6 + random(seed + "o" + i) * 0.4)} depthWrite={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} rotation={random(seed + "r" + i) * 6} /></sprite>;
  })}</group>;
};
export const Glow: React.FC<{ p: V3; s: number; col: string; o?: number }> = ({ p, s, col, o = 0.6 }) => <sprite position={p} scale={[s, s, 1]}><spriteMaterial map={glow()} color={col} transparent opacity={o} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>;

/* ---------------- 2D UI (Gota + Miyazawa style) ---------------- */
export const font: React.CSSProperties = { fontFamily: "Oswald", fontWeight: 700, color: "#fff", textTransform: "uppercase" };
type Wd = { w: string; a: number; b: number; k: boolean; g: number };
/** karaoke captions in the lower third; current word on a red pill, keywords red */
export const Subs: React.FC<{ words: Wd[]; stop: number; top?: number }> = ({ words, stop, top = 1300 }) => {
  const f = useCurrentFrame();
  if (f >= stop) return null;
  const i = words.findIndex((x) => f >= x.a - 6 && f < x.b + 10);
  if (i < 0) return null;
  const grp = words.filter((x) => x.g === words[i].g), last = grp[grp.length - 1];
  const out = ip(f, [last.b + 2, last.b + 10], [1, 0]);
  return (
    <div style={{ position: "absolute", top, width: "100%", textAlign: "center", padding: "0 64px", boxSizing: "border-box", opacity: out }}>
      {grp.map((x, j) => {
        let ci = -1; grp.forEach((y, k) => { if (f >= y.a) ci = k; });
        const ap = ip(f, [x.a - 6, x.a + 4], [0, 1], eo), cur = j === ci && f < x.b + 8;
        const pop = cur ? 1 + 0.08 * ip(f, [x.a, x.a + 6, x.a + 16], [0, 1, 0.55]) : 1;
        return <span key={j} style={{ display: "inline-block", margin: "4px 8px", padding: "0 16px 6px", borderRadius: 14, background: cur ? "linear-gradient(180deg, #ff2a40, #a80c1e)" : "transparent", boxShadow: cur ? "0 8px 22px rgba(200,16,46,0.45), 0 4px 10px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.25)" : "none",
          ...font, fontSize: 92, lineHeight: 1.12, letterSpacing: 1, opacity: ap, transform: `translateY(${(1 - ap) * 16}px) scale(${pop})`,
          color: cur ? "#fff" : x.k ? "#ff4d5a" : "#fff", WebkitTextStroke: cur ? "0px" : `10px ${INK}`, paintOrder: "stroke fill", textShadow: cur ? "0 2px 0 rgba(0,0,0,0.3)" : "0 5px 16px rgba(0,0,0,0.9)" }}>{x.w}</span>;
      })}
    </div>
  );
};
/** top-left timestamp / place line with a blinking rec dot (Miyazawa style) */
export const Stamp0: React.FC<{ f: number; a: number; b: number; l1: string; l2?: string; rec?: boolean }> = ({ f, a, b, l1, l2, rec = true }) => {
  if (f < a || f > b + 12) return null;
  const k = ip(f, [a, a + 12], [0, 1], eo) * ip(f, [b, b + 12], [1, 0]);
  const typed = Math.floor(ip(f, [a, a + 26], [0, l1.length]));
  return <div style={{ position: "absolute", left: 60, top: 92, opacity: k, transform: `translateX(${(1 - k) * -30}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, ...font, fontWeight: 600, fontSize: 52, letterSpacing: 3, textShadow: "0 3px 12px rgba(0,0,0,0.9)" }}>
      {rec && <div style={{ width: 22, height: 22, borderRadius: 11, background: RED, opacity: Math.floor(f / 30) % 2 ? 1 : 0.25, boxShadow: `0 0 14px ${RED}` }} />}
      {l1.slice(0, typed)}
    </div>
    {l2 && <div style={{ ...font, fontWeight: 500, fontSize: 36, letterSpacing: 6, color: "#d8d8dc", marginTop: 4, opacity: ip(f, [a + 18, a + 32], [0, 1]), textShadow: "0 3px 10px rgba(0,0,0,0.9)" }}>{l2}</div>}
  </div>;
};
/** yellow evidence tag with a pin line to a point on screen */
export const Tag: React.FC<{ f: number; a: number; b: number; x: number; y: number; text: string; sub?: string; px?: number; py?: number; col?: string }> = ({ f, a, b, x, y, text, sub, px, py, col = "#f2c230" }) => {
  if (f < a || f > b + 10) return null;
  const k = ip(f, [a, a + 14], [0, 1], (t) => 1 - Math.pow(1 - t, 4) * Math.cos(t * 7)), o = ip(f, [b, b + 10], [1, 0]);
  return <>
    {px !== undefined && py !== undefined && <svg width={W} height={H} style={{ position: "absolute", opacity: o * ip(f, [a + 6, a + 16], [0, 1]) }}><line x1={x} y1={y} x2={px} y2={py} stroke={col} strokeWidth={5} strokeDasharray="14 8" /><circle cx={px} cy={py} r={14} fill="none" stroke={col} strokeWidth={5} /></svg>}
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k}) rotate(${-3 + (1 - k) * 8}deg)`, opacity: o }}>
      <div style={{ background: col, padding: "10px 28px 12px", borderRadius: 8, boxShadow: "0 12px 30px rgba(0,0,0,0.6)", ...font, color: "#141414", fontSize: 58, letterSpacing: 2, whiteSpace: "nowrap", border: "4px solid #141414" }}>{text}</div>
      {sub && <div style={{ textAlign: "center", ...font, fontWeight: 600, fontSize: 34, letterSpacing: 4, marginTop: 8, color: col, textShadow: "0 3px 10px rgba(0,0,0,0.9)" }}>{sub}</div>}
    </div>
  </>;
};
/** big rubber stamp slammed on screen */
export const Slam: React.FC<{ f: number; a: number; b: number; text: string; y?: number; rot?: number; col?: string; size?: number }> = ({ f, a, b, text, y = 760, rot = -8, col = RED, size = 150 }) => {
  if (f < a || f > b + 10) return null;
  const k = ip(f, [a, a + 7], [2.2, 1], (t) => t * t), o = ip(f, [a, a + 4], [0, 1]) * ip(f, [b, b + 10], [1, 0]);
  return <div style={{ position: "absolute", top: y, width: "100%", display: "flex", justifyContent: "center", opacity: o }}>
    <div style={{ transform: `rotate(${rot}deg) scale(${k})`, border: `10px solid ${col}`, borderRadius: 18, padding: "6px 36px 12px", ...font, fontSize: size, color: col, letterSpacing: 6, lineHeight: 1, textShadow: "0 0 30px rgba(0,0,0,0.6)", boxShadow: `0 0 0 4px rgba(0,0,0,0.25), inset 0 0 30px rgba(0,0,0,0.3)`, background: "rgba(10,10,12,0.25)", mixBlendMode: "normal" }}>{text}</div>
  </div>;
};
/** headline card at the top (year / place / big number) */
export const Head: React.FC<{ f: number; a: number; b: number; big: string; small?: string; y?: number; col?: string; size?: number }> = ({ f, a, b, big, small, y = 250, col = "#fff", size = 170 }) => {
  if (f < a || f > b + 10) return null;
  const k = ip(f, [a, a + 14], [0, 1], eo), o = ip(f, [b, b + 10], [1, 0]);
  return <div style={{ position: "absolute", top: y, width: "100%", textAlign: "center", opacity: k * o, transform: `translateY(${(1 - k) * -30}px)` }}>
    <div style={{ ...font, fontSize: size, lineHeight: 1, color: col, letterSpacing: 4, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill", textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>{big}</div>
    {small && <div style={{ ...font, fontWeight: 600, fontSize: 46, letterSpacing: 10, marginTop: 6, color: "#e6e6ea", textShadow: "0 3px 12px rgba(0,0,0,0.9)" }}>{small}</div>}
  </div>;
};
/** rolling number counter */
export const Count: React.FC<{ f: number; a: number; b: number; from: number; to: number; dur: number; suffix?: string; label?: string; y?: number; col?: string; size?: number; fmt?: (v: number) => string }> = ({ f, a, b, from, to, dur, suffix = "", label, y = 230, col = "#fff", size = 150, fmt }) => {
  if (f < a || f > b + 10) return null;
  const v = from + (to - from) * ip(f, [a, a + dur], [0, 1], (t) => 1 - Math.pow(1 - t, 2)), o = ip(f, [a, a + 8], [0, 1]) * ip(f, [b, b + 10], [1, 0]);
  const s = fmt ? fmt(v) : Math.round(v).toLocaleString("en-US");
  return <div style={{ position: "absolute", top: y, width: "100%", textAlign: "center", opacity: o }}>
    {label && <div style={{ ...font, fontWeight: 600, fontSize: 40, letterSpacing: 10, color: "#d0d0d6", textShadow: "0 3px 10px rgba(0,0,0,0.9)" }}>{label}</div>}
    <div style={{ ...font, fontSize: size, lineHeight: 1.05, color: col, letterSpacing: 2, fontVariantNumeric: "tabular-nums", WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill", textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>{s}{suffix}</div>
  </div>;
};
/** end question at the top + comment pill (~3 s) */
export const EndQ: React.FC<{ f: number; a: number; l1: string; l2: string }> = ({ f, a, l1, l2 }) => {
  if (f < a) return null;
  const g = f - a, k = ip(g, [0, 16], [0, 1], eo), u = ip(g, [14, 40], [0, 1], eo), b = ip(g, [30, 46], [0, 1], eo);
  return <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 36%, transparent 68%, rgba(0,0,0,0.55) 100%)", opacity: k }} />
    <div style={{ position: "absolute", top: 190, width: "100%", textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * -26}px)` }}>
      <div style={{ ...font, fontSize: Math.min(116, 1640 / Math.max(l1.length, l2.length)), lineHeight: 1.04, letterSpacing: 2, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill", padding: "0 30px" }}>{l1}<br /><span style={{ color: "#ff3b4a" }}>{l2}</span></div>
      <div style={{ margin: "20px auto 0", width: 560 * u, height: 8, borderRadius: 4, background: `linear-gradient(90deg, transparent, ${RED}, transparent)` }} />
    </div>
    <div style={{ position: "absolute", top: 1430, width: "100%", display: "flex", justifyContent: "center", opacity: b, transform: `translateY(${(1 - b) * 26}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 40px 18px", borderRadius: 999, background: "linear-gradient(180deg, #e01a30, #9c0a1c)", boxShadow: "0 12px 34px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.25)", ...font, fontSize: 58, letterSpacing: 2 }}>
        <svg width={56} height={56} viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff" /><circle cx="8" cy="11" r="1.4" fill="#c8102e" /><circle cx="12" cy="11" r="1.4" fill="#c8102e" /><circle cx="16" cy="11" r="1.4" fill="#c8102e" /></svg>
        COMMENT BELOW</div>
    </div>
  </>;
};
export const Grade: React.FC<{ tint?: string; vig?: number }> = ({ tint = "rgba(40,70,100,0.10)", vig = 0.42 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${tint}, rgba(0,0,0,0) 45%, rgba(60,40,20,0.06))`, mixBlendMode: "soft-light" }} />
    <svg width={W} height={H} style={{ position: "absolute", opacity: 0.06, mixBlendMode: "overlay" }}><filter id="vgn"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(f / 2) % 13} /></filter><rect width={W} height={H} filter="url(#vgn)" /></svg>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(0,0,0,${vig}) 100%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 10% at 50% 72%, rgba(0,0,0,0.38), transparent)" }} />
  </AbsoluteFill>;
};
export const Progress: React.FC<{ total: number }> = ({ total }) => { const g = useCurrentFrame(); return <div style={{ position: "absolute", top: 0, left: 0, height: 8, width: `${(g / total) * 100}%`, background: `linear-gradient(90deg, #7a0a16, ${RED})`, boxShadow: `0 0 12px ${RED}` }} />; };
export const Flashes: React.FC<{ at: number[]; col?: string; o?: number; len?: number }> = ({ at, col = "#fff", o = 0.5, len = 10 }) => { const g = useCurrentFrame(); const v = Math.max(0, ...at.map((t) => (g >= t && g < t + len ? (1 - (g - t) / len) * o : 0))); return v > 0 ? <AbsoluteFill style={{ background: col, opacity: v, mixBlendMode: "screen" }} /> : null; };

/* ---------------- scene assembly ---------------- */
export type Tr = "fade" | "whip" | "cut" | "dark" | "zoom";
export type Sc = [number, number, React.FC<{ f: number }>, Tr];
const XF = 10;
const Scene: React.FC<{ C: React.FC<{ f: number }>; i: number; tr: Tr }> = ({ C: Comp, i, tr }) => {
  const g = useCurrentFrame(), f = g - (i > 0 ? XF : 0);
  const k = i > 0 ? ip(g, [0, XF], [0, 1], eo) : 1;
  const op = tr === "cut" || tr === "dark" ? (g >= XF || i === 0 ? 1 : 0) : tr === "whip" ? Math.min(1, k * 1.6) : k;
  const tx = tr === "whip" ? (1 - k) * 260 : 0, bl = tr === "whip" || tr === "zoom" ? (1 - k) * 16 : 0, zs = tr === "zoom" ? 1 + (1 - k) * 0.25 : 1;
  return <AbsoluteFill style={{ opacity: op, transform: `translateX(${tx}px) scale(${zs})`, filter: bl > 0.3 ? `blur(${bl}px)` : undefined }}><Comp f={f} /></AbsoluteFill>;
};
export const Scenes: React.FC<{ list: Sc[] }> = ({ list }) => {
  const g = useCurrentFrame();
  let dip = 0; list.forEach(([a, , , tr], i) => { if (i > 0 && tr === "dark") dip = Math.max(dip, 1 - Math.abs(g - a) / 12); });
  return <>
    {list.map(([a, b, Comp, tr], i) => <Sequence key={i} from={i > 0 ? a - XF : a} durationInFrames={b - a + (i > 0 ? XF : 0)}><Scene C={Comp} i={i} tr={tr} /></Sequence>)}
    {dip > 0 && <AbsoluteFill style={{ background: "#000", opacity: Math.min(1, dip * 1.2) }} />}
  </>;
};
