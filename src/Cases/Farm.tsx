import React, { useMemo } from "react";
import * as THREE from "three";
import { random } from "remotion";
import { noise2D } from "@remotion/noise";
import { textTex } from "../Miya3/Sets3";
import { woodTex, plasterTex, tx, Sky } from "../Tort/Common";
import { V3, FPS, Puffs, Glow, glow } from "./V";

/* ---------------- textures ---------------- */
export const snowTex = () => textTex("snow4", 1024, 1024, (c) => {
  c.fillStyle = "#dfe6f2"; c.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 70; i++) { const x = random("sw" + i) * 1024, y = random("sh" + i) * 1024, r = 60 + random("sr" + i) * 200; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${random("st" + i) > 0.5 ? "255,255,255" : "150,165,195"},0.18)`); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, 1024, 1024); }
  for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(${random("sp" + i) > 0.55 ? "255,255,255" : "120,135,170"},${0.05 + random("sa" + i) * 0.18})`; c.fillRect(random("sx" + i) * 1024, random("sy" + i) * 1024, 1 + random("sz" + i) * 2, 1); }
});
const fpTex = () => textTex("foot4", 64, 128, (c) => {
  const g = c.createRadialGradient(32, 40, 2, 32, 46, 30); g.addColorStop(0, "rgba(40,55,90,0.75)"); g.addColorStop(0.7, "rgba(70,85,120,0.35)"); g.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = g; c.beginPath(); c.ellipse(32, 44, 20, 34, 0, 0, 7); c.fill();
  const h = c.createRadialGradient(32, 100, 1, 32, 100, 18); h.addColorStop(0, "rgba(40,55,90,0.7)"); h.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = h; c.beginPath(); c.ellipse(32, 100, 15, 18, 0, 0, 7); c.fill();
  c.strokeStyle = "rgba(255,255,255,0.5)"; c.lineWidth = 3; c.beginPath(); c.ellipse(32, 44, 22, 36, 0, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
});
const hayTex = () => textTex("hay4", 512, 512, (c) => {
  c.fillStyle = "#8a7038"; c.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) { const x = random("hx" + i) * 512, y = random("hy" + i) * 512, a = random("ha" + i) * Math.PI, l = 10 + random("hl" + i) * 40; c.strokeStyle = `rgba(${random("hc" + i) > 0.5 ? "230,200,120" : "70,52,20"},${0.3 + random("ho" + i) * 0.5})`; c.lineWidth = 1 + random("hw" + i) * 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
});
const shingleTex = () => textTex("shing4", 512, 512, (c) => {
  c.fillStyle = "#2a2422"; c.fillRect(0, 0, 512, 512);
  for (let r = 0; r < 24; r++) for (let q = 0; q < 16; q++) { const k = 0.7 + random("sg" + r + q) * 0.5; c.fillStyle = `rgb(${52 * k | 0},${44 * k | 0},${40 * k | 0})`; c.fillRect(q * 32 + (r % 2) * 16, r * 21.3, 30, 20); }
});
const boardTex = (key: string, base: [number, number, number]) => textTex("brd" + key, 512, 512, (c) => {
  for (let q = 0; q < 8; q++) { const k = 0.75 + random(key + "b" + q) * 0.4; c.fillStyle = `rgb(${base[0] * k | 0},${base[1] * k | 0},${base[2] * k | 0})`; c.fillRect(q * 64, 0, 64, 512); c.fillStyle = "rgba(10,6,2,0.8)"; c.fillRect(q * 64, 0, 3, 512);
    for (let g = 0; g < 18; g++) { c.strokeStyle = `rgba(20,12,6,${0.15 + random(key + "g" + q + g) * 0.2})`; c.lineWidth = 1; c.beginPath(); const x = q * 64 + 6 + random(key + "x" + q + g) * 52; c.moveTo(x, 0); c.bezierCurveTo(x + 4, 170, x - 4, 340, x + 2, 512); c.stroke(); } }
  for (let i = 0; i < 20; i++) { c.fillStyle = "rgba(20,14,8,0.6)"; c.beginPath(); c.ellipse(random(key + "kx" + i) * 512, random(key + "ky" + i) * 512, 6, 3, 1.5, 0, 7); c.fill(); }
});
const tileTex = () => textTex("ktile4", 256, 256, (c) => {
  for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) { const g = c.createRadialGradient(q * 64 + 32, r * 64 + 26, 4, q * 64 + 32, r * 64 + 32, 44); g.addColorStop(0, "#5f8a60"); g.addColorStop(1, "#203a24"); c.fillStyle = g; c.fillRect(q * 64 + 2, r * 64 + 2, 60, 60); }
});
export const paperTex = () => textTex("zeit4", 512, 700, (c) => {
  c.fillStyle = "#e4dcc6"; c.fillRect(0, 0, 512, 700);
  c.fillStyle = "#1a1612"; c.font = "bold 58px serif"; c.textAlign = "center"; c.fillText("Neueste Nachrichten", 256, 74);
  c.fillRect(24, 92, 464, 4); c.font = "18px serif"; c.fillText("München  ·  31. März 1922", 256, 120); c.fillRect(24, 132, 464, 2);
  c.font = "bold 34px serif"; c.fillText("Reichstag berät", 256, 176);
  for (let col = 0; col < 3; col++) for (let l = 0; l < 30; l++) { c.fillStyle = `rgba(30,24,18,${0.55 + random("zl" + col + l) * 0.3})`; c.fillRect(30 + col * 156, 200 + l * 16, 130 * (l % 7 === 6 ? 0.5 : 0.85 + random("zw" + col + l) * 0.15), 7); }
  for (let i = 0; i < 30; i++) { c.fillStyle = `rgba(120,90,40,${random("zs" + i) * 0.08})`; c.beginPath(); c.arc(random("zx" + i) * 512, random("zy" + i) * 700, 20 + random("zr" + i) * 60, 0, 7); c.fill(); }
});

/* ---------------- terrain ---------------- */
export const groundH = (x: number, z: number) => noise2D("gh", x / 38, z / 38) * 1.3 + noise2D("gk", x / 11, z / 11) * 0.18 - Math.max(0, 1 - Math.hypot(x, z + 2) / 16) * (noise2D("gh", x / 38, z / 38) * 1.3);
export const Ground: React.FC<{ size?: number; seg?: number; col?: string }> = ({ size = 260, seg = 220, col = "#ffffff" }) => {
  const geo = useMemo(() => { const g = new THREE.PlaneGeometry(size, size, seg, seg); g.rotateX(-Math.PI / 2); const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, groundH(p.getX(i), p.getZ(i))); g.computeVertexNormals(); return g; }, [size, seg]);
  return <mesh geometry={geo} receiveShadow><meshStandardMaterial map={tx("snowg", snowTex, 26, 26)} color={col} roughness={0.82} metalness={0} /></mesh>;
};
/** footprint path from the forest to the farm door: list of [x,z,yaw] */
export const trailP = (t: number): [number, number] => [-26 + t * 25.4 + Math.sin(t * 5) * 1.6 * (1 - t), 60 - t * 56.8];
export const trailX = (z: number) => trailP((60 - z) / 56.8)[0];
export const TRAIL: [number, number, number][] = (() => {
  const o: [number, number, number][] = [];
  for (let i = 0; i < 180; i++) { const t = i / 180, [x, z] = trailP(t), [x2, z2] = trailP(t + 0.003); const yaw = Math.atan2(x2 - x, z2 - z), sd = i % 2 ? 1 : -1; o.push([x + Math.cos(yaw) * 0.14 * sd + (random("tj" + i) - 0.5) * 0.05, z - Math.sin(yaw) * 0.14 * sd, yaw + (random("ty" + i) - 0.5) * 0.15]); }
  return o;
})();
export const Footprints: React.FC<{ upto?: number; o?: number }> = ({ upto = 1, o = 1 }) => {
  const n = Math.floor(TRAIL.length * upto);
  const geo = useMemo(() => new THREE.PlaneGeometry(0.26, 0.46), []);
  return <group>{TRAIL.slice(0, n).map(([x, z, yaw], i) => <mesh key={i} geometry={geo} position={[x, groundH(x, z) + 0.02, z]} rotation={[-Math.PI / 2, 0, yaw + Math.PI]} renderOrder={2}><meshBasicMaterial map={fpTex()} transparent opacity={o} depthWrite={false} polygonOffset polygonOffsetFactor={-2} /></mesh>)}</group>;
};
/** instanced snowy pines */
export const Pines: React.FC<{ n?: number; seed?: string; area?: (i: number) => [number, number] | null }> = ({ n = 420, seed = "pn", area }) => {
  const data = useMemo(() => {
    const o: { x: number; z: number; h: number; r: number }[] = [];
    for (let i = 0; i < n * 3 && o.length < n; i++) {
      const pt = area ? area(i) : (() => { const a = random(seed + "a" + i) * Math.PI * 2, d = 34 + random(seed + "d" + i) * 90; return [Math.cos(a) * d, Math.sin(a) * d - 20] as [number, number]; })();
      if (!pt) continue; const [x, z] = pt; if ((Math.hypot(x - 4, z + 2) < 26 || (z > -12 && z < 46 && x > -16 && x < 26)) || (z > 2 && z < 64 && Math.abs(x - trailX(z)) < 9)) continue;
      o.push({ x, z, h: 7 + random(seed + "h" + i) * 9, r: 0.8 + random(seed + "r" + i) * 0.5 });
    }
    return o;
  }, [n, seed]);
  const parts = useMemo(() => {
    const L = [[0.0, 0.55, 1.0, "#0f1f18"], [0.32, 0.45, 0.78, "#13251c"], [0.6, 0.34, 0.55, "#162a20"], [0.82, 0.22, 0.32, "#1a2e22"]] as const;
    return L.map(([y, hh, rr, col], li) => {
      const g = new THREE.ConeGeometry(1, 1, 9, 1); const s = new THREE.ConeGeometry(1, 1, 9, 1);
      const m = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ color: col, roughness: 0.95 }), data.length), ms = new THREE.InstancedMesh(s, new THREE.MeshStandardMaterial({ color: "#e8eefa", roughness: 0.8 }), data.length);
      const M = new THREE.Matrix4(), q = new THREE.Quaternion();
      data.forEach((d, i) => { const gy = groundH(d.x, d.z); const H = d.h; const R = H * 0.28 * rr * d.r;
        q.setFromEuler(new THREE.Euler(0, random("ry" + i + li) * 6, 0));
        M.compose(new THREE.Vector3(d.x, gy + 1.2 + y * H + hh * H * 0.5, d.z), q, new THREE.Vector3(R, hh * H, R)); m.setMatrixAt(i, M);
        M.compose(new THREE.Vector3(d.x, gy + 1.2 + y * H + hh * H * 0.62, d.z), q, new THREE.Vector3(R * 0.82, hh * H * 0.78, R * 0.82)); ms.setMatrixAt(i, M); });
      m.castShadow = true; m.receiveShadow = true; ms.castShadow = false; ms.receiveShadow = true; return [m, ms];
    }).flat();
  }, [data]);
  const trunks = useMemo(() => { const m = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.28, 1, 7), new THREE.MeshStandardMaterial({ color: "#2a1e16", roughness: 1 }), data.length); const M = new THREE.Matrix4(); data.forEach((d, i) => { M.compose(new THREE.Vector3(d.x, groundH(d.x, d.z) + 0.8, d.z), new THREE.Quaternion(), new THREE.Vector3(d.r, 1.8, d.r)); m.setMatrixAt(i, M); }); return m; }, [data]);
  return <group>{parts.map((m, i) => <primitive key={i} object={m} />)}<primitive object={trunks} /></group>;
};

/* ---------------- the farm ---------------- */
const B: React.FC<{ p: V3; s: V3; c?: string; map?: THREE.Texture; r?: V3; e?: string; ei?: number; rough?: number; metal?: number; side?: THREE.Side }> = ({ p, s, c = "#fff", map, r = [0, 0, 0], e, ei = 1, rough = 0.9, metal = 0, side }) =>
  <mesh position={p} rotation={r} castShadow receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} map={map} emissive={e ?? "#000"} emissiveIntensity={e ? ei : 0} roughness={rough} metalness={metal} side={side} /></mesh>;
/** gable roof as two slabs + snow on top. ridge along x */
const Roof: React.FC<{ p: V3; w: number; d: number; rise: number; snow?: number }> = ({ p, w, d, rise, snow = 1 }) => {
  const half = d / 2 + 0.5, slope = Math.atan2(rise, half), L = Math.hypot(rise, half) + 0.2;
  return <group position={p}>{[-1, 1].map((sd) => <group key={sd} position={[0, rise / 2, sd * half / 2]} rotation={[sd * slope, 0, 0]}>
    <mesh castShadow receiveShadow><boxGeometry args={[w + 0.8, 0.22, L]} /><meshStandardMaterial map={tx("shg" + w, shingleTex, w / 3, L / 3)} roughness={0.85} /></mesh>
    {snow > 0 && <mesh position={[0, 0.17, 0]} castShadow receiveShadow><boxGeometry args={[w + 0.9, 0.14 * snow, L - 0.1]} /><meshStandardMaterial map={tx("sroof", snowTex, 4, 4)} roughness={0.7} /></mesh>}
    {snow > 0 && Array.from({ length: Math.round(w * 2) }).map((_, i) => <mesh key={i} position={[-w / 2 + (i + 0.5) / 2, -0.08, sd * (L / 2 - 0.02)]} rotation={[0, 0, 0]} scale={[1, 1 + random("ic" + w + i) * 2, 1]}><coneGeometry args={[0.03, 0.18 + random("il" + w + i) * 0.3, 5]} /><meshStandardMaterial color="#dfefff" roughness={0.1} transparent opacity={0.75} /></mesh>)}
  </group>)}</group>;
};
const gable = (w: number, rise: number) => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, rise); s.closePath(); return new THREE.ShapeGeometry(s); };
/** window: frame + 4 panes; lit 0..1 (warm), plus a light inside */
export const Win: React.FC<{ p: V3; ry?: number; w?: number; h?: number; lit?: number; shade?: number; col?: string }> = ({ p, ry = 0, w = 0.9, h = 1.2, lit = 0, shade = 0, col = "#ffb868" }) =>
  <group position={p} rotation={[0, ry, 0]}>
    <B p={[0, 0, -0.04]} s={[w, h, 0.05]} c={lit > 0.02 ? col : "#0c1018"} e={lit > 0.02 ? col : undefined} ei={lit * 1.6} rough={0.2} />
    {shade > 0 && <mesh position={[0, 0, 0.0]}><planeGeometry args={[w * 0.5, h * 0.8]} /><meshBasicMaterial color="#000" transparent opacity={shade} /></mesh>}
    <B p={[0, 0, 0.02]} s={[0.07, h, 0.06]} c="#e8e2d2" /><B p={[0, 0, 0.02]} s={[w, 0.07, 0.06]} c="#e8e2d2" />
    {[-1, 1].map((sd) => <B key={sd} p={[sd * w / 2, 0, 0.02]} s={[0.1, h + 0.1, 0.08]} c="#e8e2d2" />)}
    {[-1, 1].map((sd) => <B key={"y" + sd} p={[0, sd * h / 2, 0.02]} s={[w + 0.1, 0.1, 0.08]} c="#e8e2d2" />)}
    <B p={[0, -h / 2 - 0.08, 0.08]} s={[w + 0.3, 0.08, 0.22]} c="#e8eefa" />
    {[-1, 1].map((sd) => <B key={"sh" + sd} p={[sd * (w / 2 + 0.32), 0, 0.06]} s={[0.5, h + 0.1, 0.05]} c="#3a4a3a" map={tx("shut", () => boardTex("sh", [70, 90, 70]), 0.5, 1)} />)}
    {lit > 0.02 && <pointLight position={[0, 0, -0.8]} intensity={lit * 4} distance={7} decay={1.8} color={col} />}
  </group>;
/** Hinterkaifeck-style farmstead: two-storey house with an attached barn under one long roof. front faces +z. lit = per-window warmth [6], smoke 0..1, door 0..1 open */
export const Farm: React.FC<{ f: number; lit?: number[]; smoke?: number; door?: number; attic?: number; barnDoor?: number; snow?: number; shadow?: number; shadowX?: number }> = ({ f, lit = [0, 0, 0, 0, 0, 0], smoke = 0, door = 0, attic = 0, barnDoor = 0, snow = 1, shadow = 0, shadowX = 0 }) => {
  const HW = 9, HD = 8, HH = 6, BW = 14, BH = 5.2, rise = 4.6;
  const pl = tx("farmpl", () => plasterTex("hk", "#cfc9bc"), 2, 2), bd = tx("farmbd", () => boardTex("barn", [92, 68, 46]), BW / 3, BH / 3);
  const gH = useMemo(() => gable(HD + 0.02, rise), []), gB = useMemo(() => gable(HD + 0.02, rise), []);
  return <group>
    {/* house */}
    <mesh position={[0, HH / 2, 0]} castShadow receiveShadow><boxGeometry args={[HW, HH, HD]} /><meshStandardMaterial map={pl} roughness={0.95} /></mesh>
    <B p={[0, 0.35, 0]} s={[HW + 0.1, 0.7, HD + 0.1]} c="#6a6560" map={tx("sockel", () => plasterTex("sk", "#7a756e"), 3, 0.3)} />
    <mesh geometry={gH} position={[-HW / 2 - 0.005, HH, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow><meshStandardMaterial map={pl} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    <Roof p={[BW / 2 - 0.5, HH, 0]} w={HW + BW} d={HD} rise={rise} snow={snow} />
    {/* barn */}
    <mesh position={[HW / 2 + BW / 2, BH / 2, 0]} castShadow receiveShadow><boxGeometry args={[BW, BH, HD - 0.2]} /><meshStandardMaterial map={bd} roughness={0.95} /></mesh>
    <B p={[HW / 2 + BW / 2, BH + (HH - BH) / 2, 0]} s={[BW, HH - BH, HD - 0.2]} c="#fff" map={tx("barnup", () => boardTex("barn", [92, 68, 46]), BW / 3, 0.4)} />
    <mesh geometry={gB} position={[HW / 2 + BW + 0.005, HH, 0]} rotation={[0, Math.PI / 2, 0]} castShadow><meshStandardMaterial map={tx("barngab", () => boardTex("barn", [92, 68, 46]), 3, 1.5)} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    {/* barn doors */}
    <group position={[HW / 2 + 9, 0, HD / 2 - 0.05]}>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 1.6, 0, 0.06]} rotation={[0, sd * barnDoor * 1.2, 0]}><B p={[-sd * 0.8, 1.7, 0]} s={[1.6, 3.4, 0.12]} c="#fff" map={tx("bdr", () => boardTex("bdr", [80, 56, 38]), 0.6, 1)} /><B p={[-sd * 0.8, 1.7, 0.08]} s={[1.5, 0.14, 0.06]} c="#2a1a10" r={[0, 0, sd * 0.9]} /></group>)}
      <B p={[0, 3.5, 0.1]} s={[3.6, 0.2, 0.2]} c="#2a1a10" />
      {barnDoor > 0 && <B p={[0, 1.7, -0.3]} s={[3.2, 3.4, 0.05]} c="#050505" />}
    </group>
    <Win p={[HW / 2 + 4, 2.4, HD / 2 - 0.08]} w={0.7} h={0.6} lit={lit[5] ?? 0} col="#ffa040" />
    {/* house windows: ground floor 0..2, upper 3..4 */}
    {[[-3, 1.9], [0.9, 1.9], [3, 1.9], [-3, 4.4], [0, 4.4], [3, 4.4]].map(([x, y], i) => (i === 1 ? null : <Win key={i} p={[x, y, HD / 2 + 0.06]} lit={lit[i > 1 ? i - 1 : i] ?? 0} />))}
    {/* door */}
    <group position={[-0.6, 0, HD / 2 + 0.02]}>
      <B p={[0, 2.35, 0.06]} s={[1.6, 0.2, 0.2]} c="#3a2a1c" />
      <group position={[-0.6, 0, 0.04]} rotation={[0, -door * 1.3, 0]}><B p={[0.6, 1.1, 0]} s={[1.2, 2.2, 0.1]} c="#fff" map={tx("hdoor", () => boardTex("hd", [74, 50, 32]), 0.4, 1)} /><mesh position={[1.05, 1.1, 0.08]}><sphereGeometry args={[0.04, 10, 8]} /><meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} /></mesh></group>
      <B p={[0, 1.1, -0.04]} s={[1.2, 2.2, 0.03]} c={door > 0.05 ? "#ffa860" : "#0a0806"} e={door > 0.05 ? "#ff9040" : undefined} ei={door * 1.2} />
      {door > 0.05 && <pointLight position={[0, 1.4, 1.2]} intensity={door * 5} distance={8} color="#ffa860" />}
      <B p={[0, 0.08, 0.5]} s={[1.8, 0.16, 0.9]} c="#6a6560" />
    </group>
    {/* attic gable window (west) */}
    <Win p={[-HW / 2 - 0.05, HH + 1.5, 0]} ry={-Math.PI / 2} w={0.6} h={0.75} lit={attic} col="#ffcf8a" />
    {/* chimney */}
    <group position={[-1.8, HH, -0.8]}>
      <B p={[0, 2.9, 0]} s={[0.8, 2.6, 0.8]} c="#fff" map={tx("chim", () => plasterTex("ch", "#8a827a"), 0.4, 1)} />
      <B p={[0, 4.25, 0]} s={[1.0, 0.18, 1.0]} c="#4a4440" /><B p={[0, 4.36, 0]} s={[0.9, 0.06, 0.9]} c="#e8eefa" />
      {smoke > 0 && <Smoke f={f} p={[0, 4.4, 0]} o={smoke} />}
    </group>
    {/* yard: fence, woodpile, cart, well, drifts */}
    {Array.from({ length: 26 }).map((_, i) => { const x = -11 + i * 1.6; if (x > -6.0 && x < -2.6) return null; return <group key={i} position={[x, 0, 13]}><B p={[0, 0.6, 0]} s={[0.12, 1.2 + random("fp" + i) * 0.2, 0.12]} c="#3a2a1c" />{i < 25 && <B p={[0.8, 0.85, 0]} s={[1.6, 0.08, 0.05]} c="#4a3626" />}{i < 25 && <B p={[0.8, 0.45, 0]} s={[1.6, 0.08, 0.05]} c="#4a3626" />}<B p={[0, 1.33, 0]} s={[0.16, 0.06, 0.16]} c="#eef2fa" /></group>; })}
    <group position={[-6.6, 0, 1]}>{Array.from({ length: 30 }).map((_, i) => <mesh key={i} position={[(i % 6) * 0.32 - 0.8, 0.18 + Math.floor(i / 6) * 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.15, 0.15, 1.4, 10]} /><meshStandardMaterial color={random("wd" + i) > 0.5 ? "#6a5038" : "#5a4430"} roughness={0.95} /></mesh>)}<B p={[0, 1.62, 0]} s={[2.2, 0.1, 1.6]} c="#eef2fa" /></group>
    <group position={[7, 0, 7]} rotation={[0, 0.6, 0]}><B p={[0, 0.8, 0]} s={[1.4, 0.14, 2.6]} c="#4a3626" />{[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.78, 0.55, -0.8]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.5, 0.06, 8, 20]} /><meshStandardMaterial color="#3a2a1c" /></mesh>)}{[-1, 1].map((sd) => <mesh key={"r" + sd} position={[sd * 0.78, 0.55, 0.8]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.5, 0.06, 8, 20]} /><meshStandardMaterial color="#3a2a1c" /></mesh>)}<B p={[0, 0.92, 0]} s={[1.5, 0.12, 2.7]} c="#e8eefa" /></group>
    {shadow > 0 && Math.abs(shadowX) < 0.42 && <mesh position={[3 + shadowX, 1.85, HD / 2 + 0.03]}><planeGeometry args={[0.3, 0.95]} /><meshBasicMaterial color="#000" transparent opacity={shadow} /></mesh>}
  </group>;
};
export const Smoke: React.FC<{ f: number; p: V3; o?: number; col?: string }> = ({ f, p, o = 1, col = "#b8bcc8" }) => <group position={p}>{Array.from({ length: 14 }).map((_, i) => {
  const ph = ((f / FPS) / 7 + i / 14) % 1; const s = 0.6 + ph * 3.2;
  return <sprite key={i} position={[ph * 3 + Math.sin(f / 90 + i) * 0.3 * ph, ph * 7, Math.cos(f / 80 + i) * 0.3 * ph]} scale={[s, s, 1]}><spriteMaterial map={glow()} color={col} transparent opacity={o * 0.5 * Math.sin(Math.PI * Math.min(1, ph * 1.4))} depthWrite={false} /></sprite>;
})}</group>;
/** standard night lighting for the exterior */
export const NightLights: React.FC<{ k?: number; red?: number; dusk?: number }> = ({ k = 1, red = 0, dusk = 0 }) => <>
  <hemisphereLight args={[dusk ? "#7a6a8a" : "#4a5a88", "#10121a", 0.75 * k + dusk * 0.4]} />
  <directionalLight position={[-40, 50, 30]} intensity={(1.55 + dusk) * k} color={red ? "#ff8a8a" : dusk ? "#c8b0b8" : "#b8c8ff"} castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} shadow-camera-far={160} />
  <ambientLight intensity={0.06 * k} color="#405080" />
</>;
export const FarmWorld: React.FC<{ f: number; sky?: "night" | "dusk" | "storm"; children?: React.ReactNode; trail?: number; stars?: number; farm?: any; mist?: number }> = ({ f, sky = "night", children, trail = 1, stars = 0.8, farm = {}, mist = 1 }) => <group>
  <Sky kind={sky} f={f / 2} stars={sky === "night" ? stars : 0} moon={sky === "night" ? [-50, 55, -60] : undefined} clouds={sky === "night" ? 0 : 10} />
  <Ground />
  <Pines />
  <group position={[0, 0, -2]}><Farm f={f} {...farm} /></group>
  {trail > 0 && <Footprints upto={trail} />}
  {mist > 0 && <Puffs f={f} n={18} area={[-60, 60, 0.3, 1.6, -70, 30]} col={sky === "night" ? "#7a88a8" : "#a89aa0"} o={0.16} s={[6, 14]} drift={[0.3, 0, 0]} seed="gm" />}
  {children}
</group>;

/* ---------------- interiors ---------------- */
/** farmhouse kitchen: plank walls, beams, tile stove, table, bench, corner crucifix, key board by the door. origin at room centre floor; back wall -z */
export const Kitchen: React.FC<{ f: number; lamp?: number; stove?: number; keys?: number; paper?: number; night?: number; dust?: number }> = ({ f, lamp = 1, stove = 1, keys = 4, paper = 1, night = 1, dust = 0 }) => {
  const RW = 6, RD = 5, RH = 2.6;
  const wall = tx("kwall", () => boardTex("kw", [104, 78, 52]), 3, 1.3), floor = tx("kfloor", () => woodTex("kf", [86, 62, 40]), 3, 3);
  const fl = 1 + Math.sin(f / 7) * 0.04 + (random("lf" + Math.floor(f / 4)) - 0.5) * 0.06;
  return <group>
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[RW, RD]} /><meshStandardMaterial map={floor} roughness={0.8} /></mesh>
    <mesh position={[0, RH, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[RW, RD]} /><meshStandardMaterial map={tx("kceil", () => boardTex("kc", [70, 52, 36]), 3, 2)} roughness={0.95} /></mesh>
    {[[0, RH / 2, -RD / 2, 0], [-RW / 2, RH / 2, 0, Math.PI / 2], [RW / 2, RH / 2, 0, -Math.PI / 2], [0, RH / 2, RD / 2, Math.PI]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} rotation={[0, r, 0]} receiveShadow><planeGeometry args={[i % 2 ? RD : RW, RH]} /><meshStandardMaterial map={wall} roughness={0.92} /></mesh>)}
    {Array.from({ length: 5 }).map((_, i) => <B key={i} p={[-RW / 2 + 0.6 + i * 1.2, RH - 0.1, 0]} s={[0.18, 0.2, RD]} c="#3a2618" />)}
    {/* window on back wall with night outside */}
    <group position={[1.4, 1.5, -RD / 2 + 0.01]}><mesh position={[0, 0, -0.02]}><planeGeometry args={[0.9, 1.0]} /><meshBasicMaterial color={night ? "#1a2848" : "#8a9ab8"} /></mesh>{[0].map((i) => <B key={i} p={[0, 0, 0.02]} s={[0.06, 1.0, 0.05]} c="#d8d0c0" />)}<B p={[0, 0, 0.02]} s={[0.9, 0.06, 0.05]} c="#d8d0c0" />{[-1, 1].map((sd) => <B key={sd} p={[sd * 0.47, 0, 0.03]} s={[0.08, 1.1, 0.08]} c="#d8d0c0" />)}{[-1, 1].map((sd) => <B key={"y" + sd} p={[0, sd * 0.52, 0.03]} s={[1.02, 0.08, 0.08]} c="#d8d0c0" />)}<B p={[0, -0.56, 0.1]} s={[1.1, 0.06, 0.2]} c="#5a4030" />
      <pointLight position={[0, 0, 0.6]} intensity={0.6} distance={3} color="#6080c0" /></group>
    {/* tile stove (Kachelofen) back-left */}
    <group position={[-2.2, 0, -1.7]}>
      <B p={[0, 0.7, 0]} s={[1.2, 1.4, 1.0]} c="#fff" map={tx("ktile", tileTex, 2, 2.5)} rough={0.3} />
      <B p={[0, 1.45, 0]} s={[1.3, 0.1, 1.1]} c="#2a3a2a" rough={0.4} /><B p={[0, 1.85, 0]} s={[0.9, 0.7, 0.7]} c="#fff" map={tx("ktile2", tileTex, 1.5, 1.2)} rough={0.3} />
      <B p={[0, 0.45, 0.51]} s={[0.4, 0.3, 0.02]} c="#ff7020" e="#ff5010" ei={1.4 * stove * fl} />
      <B p={[0, 2.25, -0.2]} s={[0.3, 0.6, 0.3]} c="#3a3430" />
      <pointLight position={[0, 0.6, 0.9]} intensity={1.6 * stove * fl} distance={4} color="#ff7a30" />
    </group>
    {/* corner crucifix (Herrgottswinkel) */}
    <group position={[2.85, 1.85, -2.35]} rotation={[0, -Math.PI / 4, 0]}><B p={[0, 0, 0]} s={[0.05, 0.5, 0.04]} c="#3a2412" /><B p={[0, 0.1, 0]} s={[0.28, 0.05, 0.04]} c="#3a2412" /><B p={[0, -0.32, 0.05]} s={[0.4, 0.04, 0.16]} c="#4a3020" /></group>
    {/* table + benches */}
    <group position={[1.2, 0, -0.6]}>
      <B p={[0, 0.76, 0]} s={[1.8, 0.07, 1.0]} c="#fff" map={tx("ktab", () => woodTex("kt", [120, 88, 56]), 1, 0.6)} rough={0.65} />
      {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map(([x, z], i) => <B key={i} p={[x, 0.37, z]} s={[0.08, 0.74, 0.08]} c="#4a3020" />)}
      <B p={[0, 0.45, -0.75]} s={[1.8, 0.06, 0.32]} c="#5a3c26" /><B p={[0, 0.45, 0.75]} s={[1.8, 0.06, 0.32]} c="#5a3c26" />
      {paper > 0 && <mesh position={[-0.15, 0.8, 0.05]} rotation={[-Math.PI / 2, 0, 0.22]} castShadow receiveShadow><planeGeometry args={[0.42, 0.57]} /><meshStandardMaterial map={paperTex()} roughness={0.95} /></mesh>}
      {/* oil lamp */}
      <group position={[0.55, 0.8, -0.15]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.07, 0.09, 0.12, 16]} /><meshStandardMaterial color="#8a6a30" metalness={0.7} roughness={0.35} /></mesh><mesh position={[0, 0.22, 0]}><sphereGeometry args={[0.08, 16, 12]} /><meshPhysicalMaterial color="#fff6e0" transmission={0.6} roughness={0.1} emissive="#ffb060" emissiveIntensity={lamp * 2 * fl} transparent opacity={0.7} /></mesh>
        <Glow p={[0, 0.22, 0]} s={0.9} col="#ffb060" o={0.5 * lamp} /><pointLight position={[0, 0.3, 0]} intensity={6 * lamp * fl} distance={8} decay={1.5} color="#ffb870" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} /></group>
      <mesh position={[0.2, 0.83, -0.25]}><cylinderGeometry args={[0.05, 0.04, 0.1, 14]} /><meshStandardMaterial color="#d8d0c0" roughness={0.4} /></mesh>
    </group>
    {/* key board next to the door on the right wall */}
    <group position={[RW / 2 - 0.02, 1.5, 1.2]} rotation={[0, -Math.PI / 2, 0]}>
      <B p={[0, 0, 0]} s={[0.8, 0.3, 0.04]} c="#fff" map={tx("kb", () => woodTex("kb", [110, 80, 50]), 0.5, 0.3)} />
      {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.3 + i * 0.2, 0.05, 0.04]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.05, 6]} /><meshStandardMaterial color="#222" metalness={0.8} /></mesh>
        {i < Math.ceil(keys) ? <group position={[0, -0.08, 0.02]} scale={i === Math.ceil(keys) - 1 && keys % 1 ? keys % 1 : 1}><mesh><torusGeometry args={[0.025, 0.007, 6, 14]} /><meshStandardMaterial color="#5a5048" metalness={0.85} roughness={0.35} /></mesh><B p={[0, -0.07, 0]} s={[0.012, 0.1, 0.008]} c="#5a5048" metal={0.85} rough={0.35} /><B p={[0.012, -0.11, 0]} s={[0.02, 0.012, 0.008]} c="#5a5048" metal={0.85} rough={0.35} /></group>
          : <mesh position={[0, -0.1, -0.015]}><planeGeometry args={[0.06, 0.16]} /><meshBasicMaterial color="#3a2414" transparent opacity={0.55} /></mesh>}
      </group>)}
    </group>
    {/* door on right wall */}
    <group position={[RW / 2 - 0.01, 0, 0.2]} rotation={[0, -Math.PI / 2, 0]}><B p={[0, 1.0, 0]} s={[0.9, 2.0, 0.06]} c="#fff" map={tx("kdoor", () => boardTex("kd", [80, 56, 36]), 0.3, 1)} /><mesh position={[0.35, 1.0, 0.05]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#222" metalness={0.8} /></mesh></group>
    {/* shelf with pots + dresser */}
    <group position={[-2.95, 1.6, 0.6]} rotation={[0, Math.PI / 2, 0]}><B p={[0, 0, 0]} s={[1.6, 0.05, 0.25]} c="#4a3020" />{[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[-0.6 + i * 0.3, 0.12, 0]}><cylinderGeometry args={[0.08 + random("pt" + i) * 0.03, 0.07, 0.2 + random("ph" + i) * 0.1, 14]} /><meshStandardMaterial color={["#8a5a30", "#3a4a5a", "#d8d0c0", "#6a3a20", "#2a2a2a"][i]} roughness={0.5} /></mesh>)}</group>
    {dust > 0 && <Dust f={f} c={[0, 1.4, 0]} o={dust} />}
    <hemisphereLight args={["#3a4060", "#1a1008", 0.4]} />
  </group>;
};
/** dust motes / falling dust from the ceiling */
export const Dust: React.FC<{ f: number; c: V3; o?: number; n?: number; r?: number; fall?: number }> = ({ f, c, o = 1, n = 140, r = 1.6, fall = 0 }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []); const t = f / FPS, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const y = fall ? 1.2 - ((random("dy" + i) * 2.4 + t * (0.4 + random("dv" + i) * 0.3) * fall) % 2.4) : (random("dy" + i) - 0.5) * 2 + Math.sin(t * 0.3 + i) * 0.1;
    a[i * 3] = c[0] + (random("dx" + i) - 0.5) * r * 2 + Math.sin(t * 0.2 + i * 3) * 0.12; a[i * 3 + 1] = c[1] + y; a[i * 3 + 2] = c[2] + (random("dz" + i) - 0.5) * r * 2 + Math.cos(t * 0.25 + i) * 0.12; }
  geo.setAttribute("position", new THREE.BufferAttribute(a, 3));
  return <points geometry={geo}><pointsMaterial map={glow()} color="#ffe2b0" size={0.03} sizeAttenuation transparent opacity={0.75 * o} depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
};
/** attic: floor boards, rafters, hay, chimney stack, gable window with moon beam. boards = pried-open floor (0..1), weapon visible */
export const Attic: React.FC<{ f: number; lamp?: V3 | null; moon?: number; boards?: number; weapon?: number; dust?: number; day?: number }> = ({ f, lamp, moon = 1, boards = 0, weapon = 0, dust = 1, day = 0 }) => {
  const L = 9, Wd = 7, rise = 3.2, half = Wd / 2, sl = Math.atan2(rise, half), LL = Math.hypot(rise, half);
  const floor = tx("afl", () => woodTex("af", [92, 70, 46]), 4, 3), hay = tx("ahay", hayTex, 2, 2);
  const fl = 1 + Math.sin(f / 6) * 0.05 + (random("al" + Math.floor(f / 4)) - 0.5) * 0.08;
  return <group>
    {/* floor in four pieces around the hidden-floor hole (x -0.05..1.25, z -0.02..0.82) */}
    {[[-L / 2, -0.05, -Wd / 2, Wd / 2], [1.25, L / 2, -Wd / 2, Wd / 2], [-0.05, 1.25, -Wd / 2, -0.02], [-0.05, 1.25, 0.82, Wd / 2]].map(([x0, x1, z0, z1], i) => <mesh key={i} position={[(x0 + x1) / 2, 0, (z0 + z1) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[x1 - x0, z1 - z0]} /><meshStandardMaterial map={tx("afl" + i, () => woodTex("af", [92, 70, 46]), (x1 - x0) / 2.2, (z1 - z0) / 2.2)} roughness={0.85} /></mesh>)}
    {boards === 0 && <mesh position={[0.6, 0.001, 0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.3, 0.84]} /><meshStandardMaterial map={tx("afl4", () => woodTex("af", [92, 70, 46]), 0.6, 0.4)} roughness={0.85} /></mesh>}
    {Array.from({ length: 14 }).map((_, i) => <B key={i} p={[0, 0.005, -Wd / 2 + 0.25 + i * 0.5]} s={[L, 0.012, 0.02]} c="#1a1008" />)}
    {[-1, 1].map((sd) => <mesh key={sd} position={[0, rise / 2, sd * half / 2]} rotation={[sd * sl, 0, 0]} receiveShadow>
      <boxGeometry args={[L, 0.04, LL]} /><meshStandardMaterial map={tx("arf", () => boardTex("ar", [70, 52, 34]), 3, 2)} roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
    {/* rafters + collar beams */}
    {Array.from({ length: 8 }).map((_, i) => { const x = -L / 2 + 0.6 + i * 1.12; return <group key={i} position={[x, 0, 0]}>{[-1, 1].map((sd) => <B key={sd} p={[0, rise / 2 - 0.05, sd * half / 2 - sd * 0.06]} s={[0.16, 0.2, LL]} r={[sd * sl, 0, 0]} c="#3a2616" />)}<B p={[0, rise * 0.62, 0]} s={[0.14, 0.16, Wd * 0.38 * 2 * (1 - 0.62) + 0.1]} c="#3a2616" /><B p={[0, rise * 0.31, -1.6]} s={[0.12, rise * 0.62, 0.12]} c="#3a2616" /></group>; })}
    <B p={[0, rise - 0.1, 0]} s={[L, 0.2, 0.2]} c="#2e1e12" />
    {/* hay piles */}
    {[[-2.6, 1.6, 1.6], [2.6, 2.5, 1.3], [-0.6, 2.4, 1.1], [3.4, -1.6, 1.3], [-3.4, -1.6, 1.3]].map(([x, z, s], i) => <mesh key={i} position={[x, s * 0.25, z]} scale={[s, s * 0.45, s * 0.85]} castShadow receiveShadow><sphereGeometry args={[1, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial map={hay} roughness={1} /></mesh>)}
    {Array.from({ length: 60 }).map((_, i) => (Math.abs((random("sx" + i) - 0.5) * 7 - 0.6) < 0.8 && Math.abs((random("sz" + i) - 0.5) * 5 - 0.4) < 0.55) ? null : <mesh key={"st" + i} position={[(random("sx" + i) - 0.5) * 7, 0.01, (random("sz" + i) - 0.5) * 5]} rotation={[-Math.PI / 2, 0, random("sr" + i) * 6]}><planeGeometry args={[0.25, 0.012]} /><meshBasicMaterial color="#b89a50" /></mesh>)}
    {/* chimney stack */}
    <B p={[-1.8, rise / 2, -0.8]} s={[0.8, rise, 0.8]} c="#fff" map={tx("achim", () => plasterTex("ac", "#7a6a5a"), 0.5, 1.5)} />
    {/* old chest, ladder hatch, boards */}
    <B p={[1.6, 0.3, -1.9]} s={[1.0, 0.6, 0.6]} c="#fff" map={tx("achest", () => boardTex("ach", [90, 60, 36]), 0.6, 0.4)} />
    <B p={[-3.6, 0.02, 0.2]} s={[0.9, 0.04, 0.9]} c="#1a1008" />
    {/* pried floor + hidden mattock */}
    <group position={[0.6, 0, 0.4]}>
      {boards > 0 && <mesh position={[0, -0.06, 0]}><boxGeometry args={[1.3, 0.12, 0.84]} /><meshStandardMaterial color="#120c08" roughness={1} side={THREE.BackSide} /></mesh>}
      {boards > 0 && <mesh position={[0, -0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.3, 0.84]} /><meshStandardMaterial map={tx("ahole", hayTex, 1, 0.6)} color="#5a4a30" roughness={1} /></mesh>}
      {[0, 1, 2].map((i) => { const k = Math.min(1, Math.max(0, boards * 1.6 - i * 0.3)); return <group key={i} position={[0, 0.012 + k * (0.05 + i * 0.03), -0.28 + i * 0.28 + k * (0.75 + i * 0.12)]} rotation={[-k * (0.25 + i * 0.12), k * (0.15 - i * 0.12), 0]}>
        <B p={[0, 0, 0]} s={[1.4, 0.035, 0.27]} c="#fff" map={tx("apr", () => woodTex("ap", [118, 88, 56]), 0.8, 0.2)} />
        {[-0.6, 0.6].map((x) => <mesh key={x} position={[x, 0.02, 0]}><cylinderGeometry args={[0.008, 0.008, 0.02, 6]} /><meshStandardMaterial color="#1a1a1a" metalness={0.8} /></mesh>)}
      </group>; })}
      {weapon > 0 && <group position={[0.05, -0.085, 0.02]} rotation={[0, 0.35, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.022, 0.026, 0.95, 10]} /><meshStandardMaterial color="#6a4a2c" roughness={0.8} /></mesh>
        <group position={[0.47, 0, 0]}><B p={[0, 0, 0]} s={[0.07, 0.07, 0.09]} c="#3a3430" metal={0.85} rough={0.45} /><B p={[0.03, 0, 0.15]} s={[0.05, 0.03, 0.24]} c="#4a4440" metal={0.85} rough={0.45} r={[0, 0.2, 0]} /><B p={[0.03, 0, -0.11]} s={[0.04, 0.025, 0.15]} c="#4a4440" metal={0.85} rough={0.45} /></group>
        <spotLight position={[0.2, 1.2, 0.2]} target-position={[0, -0.1, 0]} angle={0.4} penumbra={0.8} intensity={6 * weapon} distance={3} color="#ffe2c0" />
      </group>}
    </group>
    {/* gable window + moon beam */}
    <group position={[-L / 2 + 0.02, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}><mesh><planeGeometry args={[0.6, 0.75]} /><meshBasicMaterial color={day ? "#f0e8d8" : "#3a5080"} /></mesh></group>
    {moon > 0 && <spotLight position={[-L / 2 - 1.5, 2.4, 0]} target-position={[0.5, 0, 0.6]} angle={0.32} penumbra={0.7} intensity={90 * moon} distance={16} decay={1.6} color={day ? "#ffe6c0" : "#9ab4ff"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />}
    {moon > 0 && <mesh position={[-1.6, 0.9, 0.3]} rotation={[0, 0, -0.32]}><cylinderGeometry args={[0.32, 0.9, 5.5, 20, 1, true]} /><meshBasicMaterial color={day ? "#ffe0b0" : "#7a90c8"} transparent opacity={(day ? 0.09 : 0.05) * moon} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} /></mesh>}
    {lamp && <group position={lamp}><Glow p={[0, 0, 0]} s={1.1} col="#ffb060" o={0.6} /><pointLight intensity={12 * fl} distance={9} decay={1.5} color="#ffb870" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} /></group>}
    <Dust f={f} c={[0, 1.2, 0]} o={dust} n={220} r={3} />
    <hemisphereLight args={day ? ["#c8c0b0", "#3a2a18", 0.9] : ["#3a4668", "#1a1008", 0.42]} />
    {day > 0 && [[-2.2, 0.9], [1.2, -1.3], [3.0, 1.1]].map(([x, z], i) => <group key={i}><spotLight position={[x, 3.4, z]} target-position={[x + 0.3, 0, z * 0.6]} angle={0.12} penumbra={0.5} intensity={60} distance={6} color="#ffe6c0" /><mesh position={[x + 0.15, 1.6, z * 0.8]} rotation={[0, 0, -0.08]}><cylinderGeometry args={[0.03, 0.3, 3.4, 12, 1, true]} /><meshBasicMaterial color="#ffe0b0" transparent opacity={0.035} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} /></mesh></group>)}
  </group>;
};
/** hand lantern prop */
export const Lantern: React.FC<{ f: number; light?: boolean }> = ({ f, light = false }) => {
  const fl = 1 + Math.sin(f / 6) * 0.05;
  return <group>
    <mesh position={[0, -0.03, 0]}><torusGeometry args={[0.04, 0.005, 6, 14, Math.PI]} /><meshStandardMaterial color="#222" metalness={0.8} /></mesh>
    <mesh position={[0, -0.09, 0]}><cylinderGeometry args={[0.035, 0.05, 0.03, 12]} /><meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} /></mesh>
    <mesh position={[0, -0.16, 0]}><cylinderGeometry args={[0.045, 0.045, 0.11, 12]} /><meshStandardMaterial color="#fff2d0" emissive="#ffb050" emissiveIntensity={2.2 * fl} transparent opacity={0.85} /></mesh>
    <mesh position={[0, -0.24, 0]}><cylinderGeometry args={[0.055, 0.05, 0.05, 12]} /><meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} /></mesh>
    <Glow p={[0, -0.16, 0]} s={0.7} col="#ffb050" o={0.6} />
    {light && <pointLight position={[0, -0.16, 0]} intensity={9 * fl} distance={9} decay={1.5} color="#ffb870" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />}
  </group>;
};
/** dairy cow */
export const Cow: React.FC<{ f: number; p: V3; ry?: number; seed?: number; eat?: number }> = ({ f, p, ry = 0, seed = 0, eat = 1 }) => {
  const chew = Math.sin(f / 9 + seed) * 0.05 * eat, hd = -0.35 * eat + Math.sin(f / 60 + seed) * 0.08;
  const hide = tx("cowh" + seed, () => textTex("cow" + seed, 256, 256, (c) => { c.fillStyle = "#f0ebe2"; c.fillRect(0, 0, 256, 256); for (let i = 0; i < 9; i++) { c.fillStyle = "#2a2220"; c.beginPath(); c.ellipse(random("cx" + seed + i) * 256, random("cy" + seed + i) * 256, 20 + random("cr" + seed + i) * 40, 14 + random("cq" + seed + i) * 30, random("ca" + seed + i) * 3, 0, 7); c.fill(); } }), 1, 1);
  const m = <meshStandardMaterial map={hide} roughness={0.85} />;
  return <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.92]} castShadow><capsuleGeometry args={[0.42, 1.1, 8, 18]} />{m}</mesh>
    {[[-0.24, 0.6], [0.24, 0.6], [-0.24, -0.6], [0.24, -0.6]].map(([x, z], i) => <mesh key={i} position={[x, 0.42, z]} castShadow><capsuleGeometry args={[0.08, 0.6, 4, 10]} />{m}</mesh>)}
    <group position={[0, 1.2, 0.95]} rotation={[-hd, 0, 0]}>
      <mesh position={[0, -0.05, 0.25]} rotation={[0.5, 0, 0]} scale={[0.7, 0.8, 1.15]} castShadow><sphereGeometry args={[0.27, 18, 14]} />{m}</mesh>
      <mesh position={[0, -0.22 + chew, 0.5]} scale={[1, 0.8, 0.8]}><sphereGeometry args={[0.15, 14, 10]} /><meshStandardMaterial color="#d8a8a0" roughness={0.6} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.2, 0.15, 0.1]} rotation={[0, 0, sd * -1.2]}><coneGeometry args={[0.035, 0.22, 8]} /><meshStandardMaterial color="#e8dcc0" roughness={0.5} /></mesh>)}
      {[-1, 1].map((sd) => <mesh key={"e" + sd} position={[sd * 0.25, 0.05, 0.05]} rotation={[0, 0, sd * -0.4]} scale={[1, 0.5, 0.3]}><sphereGeometry args={[0.12, 10, 8]} />{m}</mesh>)}
      {[-1, 1].map((sd) => <mesh key={"y" + sd} position={[sd * 0.12, 0.02, 0.4]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#0a0808" roughness={0.1} /></mesh>)}
    </group>
    <mesh position={[0, 1.0, -0.85]} rotation={[0.25 + Math.sin(f / 22 + seed) * 0.15, 0, Math.sin(f / 17 + seed) * 0.2]}><cylinderGeometry args={[0.02, 0.02, 0.8, 6]} />{m}</mesh>
  </group>;
};
/** barn interior with stalls, trough with hay, warm lantern */
export const BarnIn: React.FC<{ f: number; hay?: number }> = ({ f, hay = 1 }) => {
  const wall = tx("bwall", () => boardTex("bw", [90, 64, 42]), 4, 1.2);
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 8]} /><meshStandardMaterial map={tx("bfl", hayTex, 6, 4)} color="#8a7a60" roughness={1} /></mesh>
    <mesh position={[0, 1.8, -2.6]} receiveShadow><planeGeometry args={[14, 3.6]} /><meshStandardMaterial map={wall} roughness={0.95} /></mesh>
    <mesh position={[0, 3.6, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[14, 8]} /><meshStandardMaterial map={wall} color="#7a6a5a" roughness={0.95} /></mesh>
    {Array.from({ length: 6 }).map((_, i) => <group key={i} position={[-5 + i * 2.1, 0, -0.4]}><B p={[0, 1.6, 0]} s={[0.16, 3.2, 0.16]} c="#3a2616" /><B p={[0, 1.0, -1.1]} s={[0.08, 1.2, 2.2]} c="#5a4028" /></group>)}
    <B p={[0, 3.3, -0.4]} s={[14, 0.22, 0.22]} c="#2e1e12" />
    <group position={[0, 0, -2.0]}><B p={[0, 0.45, 0]} s={[12, 0.5, 0.7]} c="#fff" map={tx("btr", () => boardTex("btr", [80, 58, 38]), 4, 0.3)} />{hay > 0 && Array.from({ length: 6 }).map((_, i) => <mesh key={i} position={[-5 + i * 2.1, 0.72, 0]} scale={[0.8, 0.3 * hay, 0.32]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial map={tx("bhay", hayTex, 1, 1)} roughness={1} /></mesh>)}</group>
    <group position={[2.2, 2.4, 0.8]}><Lantern f={f} /><pointLight position={[0, -0.16, 0]} intensity={5} distance={10} decay={1.5} color="#ffb070" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} /></group>
    <Dust f={f} c={[0, 1.6, 0]} n={160} r={4} />
    <hemisphereLight args={["#40382a", "#0a0604", 0.3]} />
  </group>;
};
/** wayside memorial (Marterl) for the victims */
export const Memorial: React.FC<{ f: number }> = ({ f }) => {
  const fl = 1 + Math.sin(f / 5) * 0.08 + (random("ml" + Math.floor(f / 3)) - 0.5) * 0.12;
  const st = tx("mst", () => plasterTex("ms", "#8a8a86"), 1, 1);
  return <group>
    <B p={[0, 0.6, 0]} s={[1.1, 1.2, 0.35]} c="#fff" map={st} rough={0.9} />
    <B p={[0, 1.6, 0]} s={[0.16, 0.9, 0.14]} c="#2a2a2c" metal={0.6} rough={0.5} /><B p={[0, 1.8, 0]} s={[0.6, 0.14, 0.14]} c="#2a2a2c" metal={0.6} rough={0.5} />
    <B p={[0, 1.24, 0]} s={[1.2, 0.08, 0.42]} c="#eef2fa" />
    <mesh position={[0, 0.7, 0.18]}><planeGeometry args={[0.9, 0.7]} /><meshStandardMaterial map={textTex("mplate", 512, 400, (c) => { c.fillStyle = "#3a3632"; c.fillRect(0, 0, 512, 400); c.strokeStyle = "#a89060"; c.lineWidth = 6; c.strokeRect(14, 14, 484, 372); c.fillStyle = "#c8b070"; c.textAlign = "center"; c.font = "bold 44px serif"; c.fillText("HINTERKAIFECK", 256, 90); c.font = "34px serif"; c.fillText("31. März 1922", 256, 150); c.font = "28px serif"; ["Andreas · Cäzilia", "Viktoria · Cäzilia", "Josef · Maria"].forEach((t, i) => c.fillText(t, 256, 220 + i * 46)); })} roughness={0.5} metalness={0.4} /></mesh>
    <group position={[0.3, 0.02, 0.45]}><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.07, 0.08, 0.24, 14]} /><meshPhysicalMaterial color="#c81020" transmission={0.4} roughness={0.2} transparent opacity={0.85} emissive="#ff3010" emissiveIntensity={0.6 * fl} /></mesh>
      <sprite position={[0, 0.27, 0]} scale={[0.06, 0.11, 1]}><spriteMaterial map={glow()} color="#ffd080" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} /></sprite>
      <Glow p={[0, 0.2, 0]} s={1.2} col="#ff8040" o={0.4} /><pointLight position={[0, 0.3, 0.1]} intensity={1.8 * fl} distance={4} color="#ff9050" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} /></group>
    {[-0.35, -0.2].map((x, i) => <group key={i} position={[x, 0.05, 0.42]} rotation={[0.3, i, 0.4]}><mesh><cylinderGeometry args={[0.008, 0.008, 0.4, 5]} /><meshStandardMaterial color="#2a4020" /></mesh><mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.05, 10, 8]} /><meshStandardMaterial color={i ? "#e8e0d0" : "#8a1020"} roughness={0.8} /></mesh></group>)}
  </group>;
};
