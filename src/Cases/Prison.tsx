import React, { useMemo } from "react";
import * as THREE from "three";
import { random } from "remotion";
import { textTex } from "../Miya3/Sets3";
import { woodTex, plasterTex, tx, ironTex, Sky } from "../Tort/Common";
import { V3, FPS, Glow, glow, Puffs } from "./V";

export const brickTex = (key = "br", base: [number, number, number] = [128, 58, 42]) => textTex("brick" + key, 1024, 1024, (c) => {
  c.fillStyle = "#4a3a32"; c.fillRect(0, 0, 1024, 1024);
  for (let r = 0; r < 32; r++) for (let q = 0; q < 9; q++) { const k = 0.7 + random(key + "k" + r + q) * 0.45; const x = q * 120 + (r % 2) * 60 - 60, y = r * 32;
    const g = c.createLinearGradient(x, y, x, y + 28); g.addColorStop(0, `rgb(${base[0] * k * 1.08 | 0},${base[1] * k * 1.08 | 0},${base[2] * k | 0})`); g.addColorStop(1, `rgb(${base[0] * k * 0.8 | 0},${base[1] * k * 0.8 | 0},${base[2] * k * 0.8 | 0})`);
    c.fillStyle = g; c.fillRect(x + 3, y + 3, 114, 27);
    for (let i = 0; i < 14; i++) { c.fillStyle = `rgba(${random(key + "s" + r + q + i) > 0.5 ? "255,220,200" : "20,10,6"},0.12)`; c.fillRect(x + 3 + random(key + "x" + r + q + i) * 110, y + 3 + random(key + "y" + r + q + i) * 24, 3, 2); } }
  for (let i = 0; i < 30; i++) { const x = random(key + "dx" + i) * 1024, y = random(key + "dy" + i) * 1024, rr = 40 + random(key + "dr" + i) * 160; const g = c.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, "rgba(10,8,6,0.25)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, 1024, 1024); }
});
export const flagTex = () => textTex("flag5", 512, 512, (c) => {
  c.fillStyle = "#4a4642"; c.fillRect(0, 0, 512, 512);
  for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) { const k = 0.75 + random("fl" + r + q) * 0.35; c.fillStyle = `rgb(${110 * k | 0},${106 * k | 0},${100 * k | 0})`; c.fillRect(q * 128 + 3, r * 128 + 3, 122, 122);
    for (let i = 0; i < 80; i++) { c.fillStyle = `rgba(${random("fs" + r + q + i) > 0.5 ? "200,200,190" : "30,28,26"},0.12)`; c.fillRect(q * 128 + random("fx" + r + q + i) * 122, r * 128 + random("fy" + r + q + i) * 122, 3, 3); } }
});
const B: React.FC<{ p: V3; s: V3; c?: string; map?: THREE.Texture; r?: V3; e?: string; ei?: number; rough?: number; metal?: number }> = ({ p, s, c = "#fff", map, r = [0, 0, 0], e, ei = 1, rough = 0.9, metal = 0 }) =>
  <mesh position={p} rotation={r} castShadow receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} map={map} emissive={e ?? "#000"} emissiveIntensity={e ? ei : 0} roughness={rough} metalness={metal} /></mesh>;
const timber = () => tx("gtim", () => woodTex("gt", [96, 70, 46]), 0.3, 2);
/** rope between two points */
export const RopeL: React.FC<{ a: V3; b: V3; r?: number }> = ({ a, b, r = 0.016 }) => {
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const L = d.length(); const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} quaternion={q} castShadow><cylinderGeometry args={[r, r, L, 8]} /><meshStandardMaterial map={tx("rope", () => textTex("ropet", 64, 256, (c) => { c.fillStyle = "#9a8458"; c.fillRect(0, 0, 64, 256); for (let y = -64; y < 256; y += 10) { c.strokeStyle = "rgba(40,30,15,0.6)"; c.lineWidth = 3; c.beginPath(); c.moveTo(0, y); c.lineTo(64, y + 32); c.stroke(); } }), 1, L * 6)} roughness={0.95} /></mesh>;
};
/** noose loop + knot at a point (neck) */
export const Noose: React.FC<{ p: V3; top: V3; on?: number }> = ({ p, top, on = 1 }) => <group>
  <RopeL a={top} b={[p[0] + 0.1 * on, p[1] + 0.12, p[2]]} />
  <mesh position={p} rotation={[Math.PI / 2 - 0.1, 0, 0]}><torusGeometry args={[on ? 0.105 : 0.16, 0.024, 10, 28]} /><meshStandardMaterial color="#9a8458" roughness={0.95} /></mesh>
  <mesh position={[p[0] + (on ? 0.12 : 0.17), p[1] + 0.08, p[2]]}><cylinderGeometry args={[0.04, 0.04, 0.18, 10]} /><meshStandardMaterial color="#8a7448" roughness={0.95} /></mesh>
</group>;
/** execution shed: brick room, flagstone floor with a 1.6 x 1.2 trap over a pit, uprights + beam, lever. open = trap leaves 0..1, lever = 0..1 pulled */
export const Gallows: React.FC<{ f: number; open?: number; lever?: number; noose?: V3 | null; dawn?: number; dust?: number }> = ({ f, open = 0, lever = 0, noose = [0, 1.55, 0], dawn = 1, dust = 1 }) => {
  const RW = 8, RD = 7, RH = 5.2, TW = 1.6, TD = 1.2;
  const brick = tx("gbr", () => brickTex(), 3, 2), fl = tx("gfl", flagTex, 2, 2);
  const ang = open * 1.45;
  return <group>
    {/* floor around the hole */}
    {[[-RW / 2, -TW / 2, -RD / 2, RD / 2], [TW / 2, RW / 2, -RD / 2, RD / 2], [-TW / 2, TW / 2, -RD / 2, -TD / 2], [-TW / 2, TW / 2, TD / 2, RD / 2]].map(([x0, x1, z0, z1], i) => <mesh key={i} position={[(x0 + x1) / 2, 0, (z0 + z1) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[x1 - x0, z1 - z0]} /><meshStandardMaterial map={tx("gfl" + i, flagTex, (x1 - x0) / 2, (z1 - z0) / 2)} roughness={0.85} /></mesh>)}
    {/* pit */}
    <mesh position={[0, -1.6, 0]}><boxGeometry args={[TW, 3.2, TD]} /><meshStandardMaterial map={tx("gpit", () => brickTex(), 0.6, 1)} color="#6a6a6a" roughness={0.95} side={THREE.BackSide} /></mesh>
    {/* trap leaves, hinged at the long sides */}
    {[-1, 1].map((sd) => <group key={sd} position={[sd * TW / 2, 0, 0]} rotation={[0, 0, sd * -ang * -1]}>
      <group rotation={[0, 0, 0]}><B p={[-sd * TW / 4, -0.04, 0]} s={[TW / 2 - 0.01, 0.08, TD - 0.02]} c="#fff" map={tx("gtrap", () => woodTex("gtr", [104, 76, 50]), 0.4, 0.4)} />
        {[-0.35, 0.35].map((z) => <B key={z} p={[-sd * 0.25, -0.005, z]} s={[0.4, 0.012, 0.05]} c="#2a2826" metal={0.8} rough={0.45} />)}</group>
    </group>)}
    {/* chalk T-mark where the feet go */}
    {open < 0.02 && <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.36, 0.04]} /><meshBasicMaterial color="#e8e4da" transparent opacity={0.6} /></mesh>}
    {/* uprights + beam */}
    {[-1, 1].map((sd) => <B key={sd} p={[sd * 1.35, 1.7, 0]} s={[0.28, 3.4, 0.28]} c="#fff" map={timber()} />)}
    <B p={[0, 3.3, 0]} s={[3.1, 0.3, 0.3]} c="#fff" map={tx("gbeam", () => woodTex("gb", [96, 70, 46]), 2, 0.3)} />
    <mesh position={[0, 3.12, 0]}><torusGeometry args={[0.05, 0.012, 8, 16]} /><meshStandardMaterial color="#2a2826" metalness={0.85} roughness={0.4} /></mesh>
    {noose && <Noose p={noose} top={[0, 3.1, 0]} on={noose[1] < 1.9 ? 1 : 0} />}
    {/* lever: pivot on the floor beside the trap */}
    <group position={[1.9, 0, 0.75]}>
      <B p={[0, 0.12, 0]} s={[0.26, 0.24, 0.36]} c="#2a2826" metal={0.7} rough={0.5} />
      <group position={[0, 0.2, 0]} rotation={[0, 0, -0.25 + lever * 0.9]}>
        <mesh position={[0, 0.55, 0]} castShadow><cylinderGeometry args={[0.025, 0.035, 1.1, 10]} /><meshStandardMaterial color="#3a3836" metalness={0.85} roughness={0.35} /></mesh>
        <mesh position={[0, 1.12, 0]}><sphereGeometry args={[0.05, 12, 10]} /><meshStandardMaterial color="#2a2826" metalness={0.85} roughness={0.35} /></mesh>
      </group>
      <B p={[-0.6, 0.02, 0]} s={[1.1, 0.03, 0.06]} c="#2a2826" metal={0.8} rough={0.45} />
    </group>
    {/* walls + ceiling */}
    {[[0, RH / 2, -RD / 2, 0, RW], [-RW / 2, RH / 2, 0, Math.PI / 2, RD], [RW / 2, RH / 2, 0, -Math.PI / 2, RD], [0, RH / 2, RD / 2, Math.PI, RW]].map(([x, y, z, r, w], i) => <mesh key={i} position={[x, y, z]} rotation={[0, r, 0]} receiveShadow><planeGeometry args={[w, RH]} /><meshStandardMaterial map={brick} roughness={0.92} /></mesh>)}
    <mesh position={[0, RH, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[RW, RD]} /><meshStandardMaterial map={tx("gceil", () => woodTex("gc", [60, 46, 32]), 3, 3)} roughness={0.95} /></mesh>
    {Array.from({ length: 5 }).map((_, i) => <B key={i} p={[-RW / 2 + 0.8 + i * 1.6, RH - 0.15, 0]} s={[0.22, 0.3, RD]} c="#2a1c12" />)}
    {/* high window on the back wall -> dawn light shaft */}
    <group position={[-1.6, 3.9, -RD / 2 + 0.02]}>
      <mesh><planeGeometry args={[1.0, 0.9]} /><meshBasicMaterial color={dawn ? "#e8e4f0" : "#2a3858"} /></mesh>
      {[-0.25, 0, 0.25].map((x) => <B key={x} p={[x, 0, 0.03]} s={[0.03, 0.9, 0.04]} c="#1a1a1a" metal={0.8} />)}
      <B p={[0, 0, 0.03]} s={[1.0, 0.03, 0.04]} c="#1a1a1a" metal={0.8} />
    </group>
    <spotLight position={[-1.6, 4.3, -RD / 2 - 1]} target-position={[0.2, 0, 0.2]} angle={0.35} penumbra={0.6} intensity={dawn ? 120 : 30} distance={14} decay={1.5} color={dawn ? "#dfe4f4" : "#8090c0"} castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096} />
    <mesh position={[-0.7, 2.1, -1.6]} rotation={[0.62, 0, -0.18]}><cylinderGeometry args={[0.35, 0.9, 5.2, 16, 1, true]} /><meshBasicMaterial color="#dfe6ff" transparent opacity={0.045 * dawn} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} /></mesh>
    {/* wall gas lamp */}
    <group position={[RW / 2 - 0.15, 2.6, 1.2]}><B p={[0, 0, 0]} s={[0.1, 0.1, 0.1]} c="#2a2826" metal={0.8} /><mesh position={[-0.18, 0.05, 0]}><sphereGeometry args={[0.09, 14, 10]} /><meshStandardMaterial color="#fff2d0" emissive="#ffc070" emissiveIntensity={2.4} /></mesh><Glow p={[-0.18, 0.05, 0]} s={1.0} col="#ffb060" o={0.5} /><pointLight position={[-0.4, 0, 0]} intensity={9} distance={9} decay={1.5} color="#ffbc78" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} /></group>
    <hemisphereLight args={["#7a8098", "#3a2a20", 0.75]} />
    <group position={[-RW / 2 + 0.15, 2.6, -0.6]}><B p={[0, 0, 0]} s={[0.1, 0.1, 0.1]} c="#2a2826" metal={0.8} /><mesh position={[0.18, 0.05, 0]}><sphereGeometry args={[0.09, 14, 10]} /><meshStandardMaterial color="#fff2d0" emissive="#ffc070" emissiveIntensity={2.4} /></mesh><Glow p={[0.18, 0.05, 0]} s={1.0} col="#ffb060" o={0.5} /><pointLight position={[0.4, 0, 0]} intensity={8} distance={8} decay={1.5} color="#ffbc78" /></group>
    {dust > 0 && <Motes f={f} />}
  </group>;
};
const Motes: React.FC<{ f: number }> = ({ f }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []); const n = 260, t = f / FPS, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = -1.2 + (random("mx" + i) - 0.5) * 2.4 + Math.sin(t * 0.2 + i) * 0.1; a[i * 3 + 1] = 0.3 + random("my" + i) * 3.8 + Math.sin(t * 0.15 + i * 2) * 0.1; a[i * 3 + 2] = -1.5 + (random("mz" + i) - 0.5) * 2.4 + Math.cos(t * 0.2 + i) * 0.1; }
  geo.setAttribute("position", new THREE.BufferAttribute(a, 3));
  return <points geometry={geo}><pointsMaterial map={glow()} color="#fff0d8" size={0.025} sizeAttenuation transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
};
/** sandbag on a rope for the test drop; y = height of the bag's base */
export const Sandbag: React.FC<{ y: number }> = ({ y }) => <group>
  <RopeL a={[0, 3.1, 0]} b={[0, y + 0.6, 0]} r={0.014} />
  <mesh position={[0, y + 0.3, 0]} scale={[1, 1.25, 1]} castShadow><sphereGeometry args={[0.24, 18, 14]} /><meshStandardMaterial map={tx("sbag", () => textTex("sbagt", 128, 128, (c) => { c.fillStyle = "#a89070"; c.fillRect(0, 0, 128, 128); for (let i = 0; i < 400; i++) { c.fillStyle = `rgba(60,40,20,${random("sb" + i) * 0.3})`; c.fillRect(random("sx" + i) * 128, random("sy" + i) * 128, 2, 2); } }), 1, 1)} roughness={1} /></mesh>
  <mesh position={[0, y + 0.6, 0]}><cylinderGeometry args={[0.04, 0.08, 0.1, 10]} /><meshStandardMaterial color="#8a7448" roughness={1} /></mesh>
</group>;
/** prison cell: brick, barred window high on the back wall, iron bed, bucket, door with grille */
export const Cell: React.FC<{ f: number; night?: number }> = ({ f, night = 0 }) => {
  const RW = 3.4, RD = 4, RH = 3.2;
  const wall = tx("cwall", () => brickTex("cb", [116, 104, 92]), 1.5, 1.2);
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[RW, RD]} /><meshStandardMaterial map={tx("cfl", flagTex, 1.5, 2)} roughness={0.85} /></mesh>
    {[[0, RH / 2, -RD / 2, 0, RW], [-RW / 2, RH / 2, 0, Math.PI / 2, RD], [RW / 2, RH / 2, 0, -Math.PI / 2, RD], [0, RH / 2, RD / 2, Math.PI, RW]].map(([x, y, z, r, w], i) => <mesh key={i} position={[x, y, z]} rotation={[0, r, 0]} receiveShadow><planeGeometry args={[w, RH]} /><meshStandardMaterial map={wall} roughness={0.92} /></mesh>)}
    <mesh position={[0, RH, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[RW, RD]} /><meshStandardMaterial color="#5a5450" roughness={1} /></mesh>
    <group position={[0.2, 2.45, -RD / 2 + 0.02]}>
      <mesh><planeGeometry args={[0.7, 0.5]} /><meshBasicMaterial color={night ? "#283a66" : "#dfe6f4"} /></mesh>
      {[-0.24, -0.08, 0.08, 0.24].map((x) => <mesh key={x} position={[x, 0, 0.04]}><cylinderGeometry args={[0.014, 0.014, 0.5, 8]} /><meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.4} /></mesh>)}
    </group>
    <spotLight position={[0.2, 2.6, -RD / 2 - 1.2]} target-position={[-1.0, 0.5, -0.2]} angle={0.42} penumbra={0.5} intensity={night ? 70 : 90} distance={9} decay={1.5} color={night ? "#8aa0e0" : "#e8ecf8"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    {/* iron bed along the left wall */}
    <group position={[-1.1, 0, -0.4]}>
      <B p={[0, 0.42, 0]} s={[0.8, 0.06, 1.9]} c="#2a2826" metal={0.7} rough={0.5} />
      <B p={[0, 0.5, 0]} s={[0.74, 0.1, 1.84]} c="#7a6e5c" />
      <B p={[0, 0.58, -0.75]} s={[0.5, 0.08, 0.3]} c="#a89a84" />
      {[[-0.38, -0.92], [0.38, -0.92], [-0.38, 0.92], [0.38, 0.92]].map(([x, z], i) => <B key={i} p={[x, 0.21, z]} s={[0.04, 0.42, 0.04]} c="#2a2826" metal={0.7} />)}
      <B p={[0.0, 0.53, 0.5]} s={[0.76, 0.05, 0.6]} c="#4a4a52" />
    </group>
    <group position={[1.2, 0, -1.4]}><mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.15, 0.12, 0.34, 16, 1, true]} /><meshStandardMaterial color="#4a4640" metalness={0.5} roughness={0.6} side={THREE.DoubleSide} /></mesh></group>
    {/* door with grille on the front (+z) wall */}
    <group position={[0.8, 0, RD / 2 - 0.02]} rotation={[0, Math.PI, 0]}><B p={[0, 1.0, 0]} s={[0.9, 2.0, 0.08]} c="#3a3634" metal={0.5} rough={0.5} map={ironTex()} /><B p={[0, 1.55, -0.05]} s={[0.3, 0.2, 0.02]} c="#050505" /></group>
    <hemisphereLight args={[night ? "#3a4870" : "#8a90a8", "#1a1614", night ? 0.5 : 0.65]} />
    <pointLight position={[1.0, 1.9, 1.4]} intensity={night ? 1.5 : 3} distance={5} color={night ? "#8090c0" : "#ffd8b0"} />
  </group>;
};
/** prison front: brick wall, gatehouse with arched gate (open 0..1), towers, street */
export const PrisonFront: React.FC<{ f: number; gate?: number; sky?: "dusk" | "haze" | "sunset" | "storm" | "night"; snow?: number }> = ({ f, gate = 0, sky = "haze" }) => {
  const br = tx("pfb", () => brickTex("pf", [120, 56, 40]), 8, 3);
  return <group>
    <Sky kind={sky as any} f={f / 2} clouds={14} sun={sky === "sunset" || sky === "haze" ? [10, 18, -90] : undefined} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[200, 200]} /><meshStandardMaterial map={tx("pstreet", () => textTex("cob5", 512, 512, (c) => { c.fillStyle = "#3a3632"; c.fillRect(0, 0, 512, 512); for (let r = 0; r < 16; r++) for (let q = 0; q < 16; q++) { const k = 0.6 + random("pc" + r + q) * 0.5; c.fillStyle = `rgb(${110 * k | 0},${104 * k | 0},${96 * k | 0})`; c.beginPath(); c.ellipse(q * 32 + 16 + (r % 2) * 16, r * 32 + 16, 13, 12, 0, 0, 7); c.fill(); } }), 60, 60)} roughness={0.8} /></mesh>
    {/* wall */}
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 14, 4, -6]} castShadow receiveShadow><boxGeometry args={[22, 8, 1]} /><meshStandardMaterial map={br} roughness={0.92} /></mesh>)}
    {/* gatehouse */}
    <mesh position={[0, 5.5, -6]} castShadow receiveShadow><boxGeometry args={[6.4, 11, 2.2]} /><meshStandardMaterial map={tx("pgh", () => brickTex("pf", [120, 56, 40]), 2.4, 4)} roughness={0.92} /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 3.6, 6.5, -5.5]} castShadow><cylinderGeometry args={[1.1, 1.2, 13, 20]} /><meshStandardMaterial map={tx("ptw", () => brickTex("pf", [120, 56, 40]), 2, 5)} roughness={0.92} /></mesh>)}
    {[-1, 1].map((sd) => Array.from({ length: 6 }).map((_, i) => { const a = (i / 6) * Math.PI * 2; return <B key={sd + "c" + i} p={[sd * 3.6 + Math.cos(a) * 1.05, 13.25, -5.5 + Math.sin(a) * 1.05]} s={[0.4, 0.5, 0.4]} c="#6a4a3a" />; }))}
    {Array.from({ length: 8 }).map((_, i) => <B key={i} p={[-2.8 + i * 0.8, 11.25, -4.85]} s={[0.4, 0.5, 0.4]} c="#6a4a3a" />)}
    <B p={[0, 8.2, -4.85]} s={[3.2, 0.9, 0.1]} c="#d8d0c0" />
    <mesh position={[0, 8.2, -4.79]}><planeGeometry args={[3, 0.7]} /><meshBasicMaterial map={textTex("hmpx", 512, 120, (c) => { c.fillStyle = "#d8d0c0"; c.fillRect(0, 0, 512, 120); c.fillStyle = "#1a1612"; c.font = "bold 60px serif"; c.textAlign = "center"; c.fillText("H.M. PRISON", 256, 82); })} /></mesh>
    {/* arched gate */}
    <group position={[0, 0, -4.85]}>
      <B p={[0, 3.5, 0.05]} s={[3.6, 0.3, 0.3]} c="#d8d0c0" />
      <mesh position={[0, 2.0, -0.6]}><boxGeometry args={[3.0, 4.0, 1]} /><meshStandardMaterial color={gate > 0.02 ? "#fff6e6" : "#0a0806"} emissive={gate > 0.02 ? "#fff0d8" : "#000"} emissiveIntensity={gate * 1.6} /></mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 1.5, 0, 0]} rotation={[0, sd * gate * 1.4, 0]}><B p={[-sd * 0.75, 1.75, 0]} s={[1.5, 3.5, 0.14]} c="#fff" map={tx("pgate", () => woodTex("pg", [70, 50, 34]), 0.5, 1)} />{[0.6, 1.75, 2.9].map((y) => <B key={y} p={[-sd * 0.75, y, 0.08]} s={[1.5, 0.1, 0.03]} c="#1a1a1a" metal={0.8} />)}</group>)}
      {gate > 0.02 && <pointLight position={[0, 2, 1]} intensity={gate * 30} distance={12} color="#fff0d8" />}
    </group>
    {/* gas lamps */}
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 5.5, 0, -2.5]}><mesh position={[0, 1.8, 0]}><cylinderGeometry args={[0.06, 0.09, 3.6, 10]} /><meshStandardMaterial color="#1a1a1a" metalness={0.7} /></mesh><mesh position={[0, 3.75, 0]}><boxGeometry args={[0.36, 0.5, 0.36]} /><meshStandardMaterial color="#fff2d0" emissive="#ffb860" emissiveIntensity={sky === "night" || sky === "dusk" ? 2 : 0.3} transparent opacity={0.85} /></mesh>{(sky === "night" || sky === "dusk") && <><Glow p={[0, 3.75, 0]} s={2} col="#ffb060" o={0.5} /><pointLight position={[0, 3.6, 0.5]} intensity={12} distance={10} color="#ffb870" /></>}</group>)}
    <hemisphereLight args={[sky === "night" ? "#3a4870" : "#c8c8d8", "#2a2420", sky === "night" ? 0.4 : 0.8]} />
    <directionalLight position={[20, 30, 25]} intensity={sky === "night" ? 0.6 : 2.2} color={sky === "sunset" ? "#ffc890" : "#fff4e0"} castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} />
    <Puffs f={f} n={10} area={[-30, 30, 0.5, 3, -2, 20]} col="#b8b8c0" o={0.12} s={[6, 12]} drift={[0.2, 0, 0]} seed="pfm" />
  </group>;
};
