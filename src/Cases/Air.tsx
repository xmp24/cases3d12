import React, { useMemo } from "react";
import * as THREE from "three";
import { random } from "remotion";
import { textTex } from "../Miya3/Sets3";
import { tx, plasterTex } from "../Tort/Common";
import { V3, FPS, Glow, glow, puff } from "./V";

const B: React.FC<{ p: V3; s: V3; c?: string; map?: THREE.Texture; r?: V3; e?: string; ei?: number; rough?: number; metal?: number }> = ({ p, s, c = "#fff", map, r = [0, 0, 0], e, ei = 1, rough = 0.6, metal = 0 }) =>
  <mesh position={p} rotation={r} castShadow receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} map={map} emissive={e ?? "#000"} emissiveIntensity={e ? ei : 0} roughness={rough} metalness={metal} /></mesh>;

/* ---------------- sky above the clouds ---------------- */
const skyGrad = (key: string, stops: [number, string][]) => textTex("asky" + key, 16, 1024, (c) => { const g = c.createLinearGradient(0, 0, 0, 1024); stops.forEach(([p, col]) => g.addColorStop(p, col)); c.fillStyle = g; c.fillRect(0, 0, 16, 1024); });
export const SKY_DUSK: [number, string][] = [[0, "#2a4a8a"], [0.25, "#5a7ac0"], [0.4, "#c89aa0"], [0.47, "#f0a880"], [0.5, "#ffd0a0"], [0.53, "#d8b0a8"], [1, "#6a6a82"]];
export const SKY_NIGHT: [number, string][] = [[0, "#020410"], [0.4, "#0a1430"], [0.5, "#1a2850"], [0.55, "#0c1020"], [1, "#05060c"]];
const cloudTex = () => textTex("acloud", 512, 512, (c) => {
  for (let i = 0; i < 40; i++) { const x = 256 + (random("ac" + i) - 0.5) * 300, y = 256 + (random("ad" + i) - 0.5) * 180, r = 50 + random("ae" + i) * 110; const g = c.createRadialGradient(x, y - r * 0.2, 0, x, y, r); g.addColorStop(0, "rgba(255,255,255,0.5)"); g.addColorStop(0.6, "rgba(235,235,245,0.22)"); g.addColorStop(1, "rgba(200,205,220,0)"); c.fillStyle = g; c.fillRect(0, 0, 512, 512); }
});
/** sky dome + sun + a sea of clouds at y=0 (units: 1 = 10 m), drifting with the plane speed */
export const CloudSea: React.FC<{ f: number; kind?: "dusk" | "night"; speed?: number; n?: number; y?: number; high?: number; sunDir?: V3 }> = ({ f, kind = "dusk", speed = 1, n = 160, y = 0, high = 1, sunDir = [-0.6, 0.12, -1] }) => {
  const t = f / FPS; const sd = new THREE.Vector3(...sunDir).normalize().multiplyScalar(330);
  return <group>
    <mesh><sphereGeometry args={[380, 32, 24]} /><meshBasicMaterial map={skyGrad(kind, kind === "dusk" ? SKY_DUSK : SKY_NIGHT)} side={THREE.BackSide} fog={false} depthWrite={false} /></mesh>
    {kind === "dusk" && <group position={sd.toArray() as V3}><mesh><sphereGeometry args={[9, 24, 16]} /><meshBasicMaterial color="#fff2d0" fog={false} /></mesh><sprite scale={[160, 160, 1]}><spriteMaterial map={glow()} color="#ffb070" transparent opacity={0.65} fog={false} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite></group>}
    {/* flat cloud deck */}
    {Array.from({ length: n }).map((_, i) => { const span = 700; const x = (((random("cx" + i) * span - t * 6 * speed) % span) + span) % span - span / 2, z = (random("cz" + i) - 0.5) * 700, s = 40 + random("cs" + i) * 70;
      return <sprite key={i} position={[x, y + random("cy" + i) * 10, z]} scale={[s * 1.6, s * 0.6, 1]}><spriteMaterial map={cloudTex()} color={kind === "dusk" ? (random("cc" + i) > 0.5 ? "#ffd8c0" : "#e0c8d0") : "#4a5478"} transparent opacity={0.9} depthWrite={false} fog={false} /></sprite>; })}
    {/* a few high wisps */}
    {high > 0 && Array.from({ length: 24 }).map((_, i) => { const span = 600; const x = (((random("hx" + i) * span - t * 9 * speed) % span) + span) % span - span / 2;
      return <sprite key={"h" + i} position={[x, y + 40 + random("hy" + i) * 50, (random("hz" + i) - 0.5) * 500]} scale={[90, 14, 1]}><spriteMaterial map={cloudTex()} color={kind === "dusk" ? "#ffe0d0" : "#3a4468"} transparent opacity={0.35} depthWrite={false} fog={false} /></sprite>; })}
    <hemisphereLight args={[kind === "dusk" ? "#a8b8e8" : "#2a3460", kind === "dusk" ? "#e8b098" : "#101420", kind === "dusk" ? 1.0 : 0.5]} />
    <directionalLight position={sd.toArray() as V3} intensity={kind === "dusk" ? 2.6 : 0.6} color={kind === "dusk" ? "#ffd2a8" : "#8a9ad0"} />
  </group>;
};

/* ---------------- DC-9 ---------------- */
const liveryTex = () => textTex("dc9liv", 1024, 256, (c) => {
  c.fillStyle = "#f2f2f0"; c.fillRect(0, 0, 1024, 256);
  c.fillStyle = "#1c3a8a"; c.fillRect(0, 118, 1024, 22); c.fillStyle = "#c8202e"; c.fillRect(0, 140, 1024, 8);
  c.fillStyle = "#cfd2d6"; c.fillRect(0, 180, 1024, 76);
  for (let i = 0; i < 40; i++) { c.fillStyle = "#1a2030"; c.beginPath(); c.roundRect(80 + i * 22, 96, 12, 16, 4); c.fill(); }
  for (let x = 0; x < 1024; x += 64) { c.fillStyle = "rgba(0,0,0,0.06)"; c.fillRect(x, 0, 2, 256); }
});
/** fuselage segment between x0..x1 (plane long axis = x, nose at +x), radius r. jag: torn ends */
export const Fuse: React.FC<{ x0: number; x1: number; r?: number; jag0?: boolean; jag1?: boolean; inside?: boolean }> = ({ x0, x1, r = 1.6, jag0, jag1, inside }) => {
  const L = x1 - x0; const m = tx("liv" + L.toFixed(1), liveryTex, L / 14, 1);
  return <group position={[(x0 + x1) / 2, 0, 0]}>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow><cylinderGeometry args={[r, r, L, 40, 1, true]} /><meshStandardMaterial map={m} roughness={0.35} metalness={0.25} side={inside ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
    {[jag0 ? -1 : 0, jag1 ? 1 : 0].filter(Boolean).map((sd) => <group key={sd} position={[sd * L / 2, 0, 0]}>{Array.from({ length: 22 }).map((_, i) => { const a = (i / 22) * Math.PI * 2; const l = 0.2 + random("jg" + L + sd + i) * 0.7;
      return <mesh key={i} position={[sd * l / 2, Math.cos(a) * r, Math.sin(a) * r]} rotation={[a, 0, 0]}><boxGeometry args={[l, 0.03, 0.46]} /><meshStandardMaterial color={random("jc" + i) > 0.4 ? "#d8d8d4" : "#3a3a3c"} metalness={0.6} roughness={0.5} side={THREE.DoubleSide} /></mesh>; })}
      <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[r, 0.06, 6, 40]} /><meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.6} /></mesh>
    </group>)}
  </group>;
};
/** whole DC-9 (≈36 m long, 1 unit = 1 m). split 0..1 pulls the three sections apart */
export const DC9: React.FC<{ f: number; split?: number; flash?: number; fire?: number }> = ({ f, split = 0, flash = 0, fire = 0 }) => {
  const s = split; const t = f / FPS;
  const front: V3 = [s * 6, s * 3 - s * s * 8, s * 2], mid: V3 = [0, -s * s * 4, 0], rear: V3 = [-s * 7, s * 2 - s * s * 10, -s * 2];
  const wing = (sd: number) => <mesh position={[-1, -0.9, sd * 7]} rotation={[0, sd * -0.35, 0]} castShadow><boxGeometry args={[3.6, 0.22, 13]} /><meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.3} /></mesh>;
  return <group>
    <group position={front} rotation={[s * 0.8, s * 0.6, -s * 1.2]}>
      <Fuse x0={4} x1={15} jag0={s > 0} />
      <mesh position={[16.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 1.4, 1]} castShadow><coneGeometry args={[1.6, 2.6, 40]} /><meshStandardMaterial color="#f2f2f0" roughness={0.35} metalness={0.25} /></mesh>
      <mesh position={[15.6, 0.75, 0]} rotation={[0, 0, -0.6]}><boxGeometry args={[1.2, 0.5, 2.4]} /><meshStandardMaterial color="#10141c" roughness={0.1} metalness={0.6} /></mesh>
    </group>
    <group position={mid} rotation={[-s * 0.4, s * 0.3, s * 0.9 + s * t * 0.4]}>
      <Fuse x0={-6} x1={4} jag0={s > 0} jag1={s > 0} />
      {wing(1)}{wing(-1)}
    </group>
    <group position={rear} rotation={[s * 1.1, -s * 0.5, s * 1.6]}>
      <Fuse x0={-15} x1={-6} jag1={s > 0} />
      <mesh position={[-16.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1.2, 1]}><coneGeometry args={[1.6, 2.6, 40]} /><meshStandardMaterial color="#f2f2f0" roughness={0.35} metalness={0.25} /></mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[-12.5, 0.7, sd * 2.1]}><mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.7, 0.6, 4, 24]} /><meshStandardMaterial color="#d8d8dc" roughness={0.3} metalness={0.5} /></mesh><mesh position={[2.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.55, 0.55, 0.05, 24]} /><meshStandardMaterial color="#1a1a1e" /></mesh><B p={[0.2, 0, -sd * 0.8]} s={[1.6, 0.2, 1]} c="#d8d8dc" metal={0.4} /></group>)}
      <mesh position={[-14.5, 3.4, 0]} rotation={[0, 0, 0.35]} castShadow><boxGeometry args={[3.2, 5, 0.3]} /><meshStandardMaterial color="#f2f2f0" roughness={0.35} metalness={0.25} /></mesh>
      <B p={[-15.4, 5.8, 0]} s={[2.4, 0.2, 8]} c="#f2f2f0" metal={0.25} rough={0.35} />
      <B p={[-14.4, 3.6, 0.17]} s={[2.2, 1.2, 0.02]} c="#c8202e" />
    </group>
    {flash > 0 && <group position={[7, -0.8, 0]}><Glow p={[0, 0, 0]} s={30 * flash} col="#ffc060" o={flash} /><Glow p={[0, 0, 0]} s={12 * flash} col="#ffffff" o={flash} /><pointLight intensity={2000 * flash} distance={80} color="#ffb060" /></group>}
    {fire > 0 && [[4, 0, 0], [-6, 0, 0]].map((p, i) => <group key={i} position={[p[0] + (i ? rear[0] * 0.2 : front[0] * 0.2), p[1], p[2]]}>{Array.from({ length: 10 }).map((_, k) => { const ph = (t * 2 + k / 10) % 1; return <sprite key={k} position={[-ph * 8, ph * 1.5, (random("ff" + i + k) - 0.5) * 2]} scale={[3 + ph * 6, 3 + ph * 6, 1]}><spriteMaterial map={glow()} color={ph < 0.3 ? "#ffd080" : ph < 0.6 ? "#ff6020" : "#2a2420"} transparent opacity={fire * (1 - ph) * 0.8} depthWrite={false} blending={ph < 0.6 ? THREE.AdditiveBlending : THREE.NormalBlending} /></sprite>; })}</group>)}
  </group>;
};
/** debris flakes around a point */
export const Debris: React.FC<{ f: number; c: V3; n?: number; r?: number; spread?: number }> = ({ f, c, n = 60, r = 0.4, spread = 1 }) => {
  const t = f / FPS;
  return <group position={c}>{Array.from({ length: n }).map((_, i) => { const d = new THREE.Vector3(random("dx" + i) - 0.5, random("dy" + i) - 0.5, random("dz" + i) - 0.5).normalize().multiplyScalar((2 + random("dd" + i) * 18) * spread * Math.min(1, t * 0.6));
    return <mesh key={i} position={[d.x, d.y + Math.sin(t + i) * 0.5, d.z]} rotation={[t * (1 + random("r1" + i) * 4), t * random("r2" + i) * 3, i]}><boxGeometry args={[r * (0.4 + random("s1" + i)), 0.02, r * (0.3 + random("s2" + i) * 0.8)]} /><meshStandardMaterial color={random("dc" + i) > 0.5 ? "#d8d8d8" : "#4a4a4c"} metalness={0.5} roughness={0.5} side={THREE.DoubleSide} /></mesh>; })}</group>;
};

/* ---------------- cabin interior (looking down the aisle, plane axis = z, nose at -z) ---------------- */
const seatTex = () => textTex("seat72", 256, 256, (c) => { c.fillStyle = "#8a3a2a"; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 8) { c.fillStyle = "rgba(0,0,0,0.12)"; c.fillRect(0, y, 256, 3); } for (let i = 0; i < 300; i++) { c.fillStyle = `rgba(255,200,150,${random("st" + i) * 0.08})`; c.fillRect(random("sx" + i) * 256, random("sy" + i) * 256, 3, 3); } });
export const Seat: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => <group position={p} rotation={[0, ry, 0]}>
  <B p={[0, 0.42, 0]} s={[0.48, 0.12, 0.48]} c="#fff" map={tx("seat", seatTex, 1, 1)} rough={0.9} />
  <B p={[0, 0.8, 0.22]} s={[0.48, 0.7, 0.1]} c="#fff" map={tx("seat", seatTex, 1, 1)} rough={0.9} r={[0.12, 0, 0]} />
  <B p={[0, 1.12, 0.26]} s={[0.4, 0.12, 0.06]} c="#e8e2d4" rough={0.9} r={[0.12, 0, 0]} />
  {[-1, 1].map((sd) => <B key={sd} p={[sd * 0.25, 0.58, 0]} s={[0.04, 0.05, 0.42]} c="#5a5a5e" metal={0.5} />)}
  <B p={[0, 0.2, 0]} s={[0.36, 0.36, 0.06]} c="#3a3a3e" metal={0.4} />
</group>;
export const Trolley: React.FC<{ p: V3; r?: V3 }> = ({ p, r = [0, 0, 0] }) => <group position={p} rotation={r}>
  <B p={[0, 0.5, 0]} s={[0.32, 0.95, 0.75]} c="#b8bcc4" metal={0.8} rough={0.3} />
  {[0.25, 0.55, 0.85].map((y) => <B key={y} p={[0.165, y, 0]} s={[0.01, 0.02, 0.7]} c="#6a6e76" metal={0.8} />)}
  <B p={[0, 1.0, 0]} s={[0.34, 0.04, 0.78]} c="#8a8e96" metal={0.8} rough={0.3} />
  {[-1, 1].map((sd) => <B key={sd} p={[0, 0.06, sd * 0.3]} s={[0.24, 0.08, 0.08]} c="#1a1a1a" />)}
  <mesh position={[0, 1.08, 0.2]}><cylinderGeometry args={[0.04, 0.035, 0.12, 12]} /><meshStandardMaterial color="#e8e4dc" /></mesh>
  <mesh position={[0, 1.1, -0.2]}><cylinderGeometry args={[0.035, 0.035, 0.16, 12]} /><meshStandardMaterial color="#2a6a2a" metalness={0.3} roughness={0.2} /></mesh>
</group>;
export const Cabin: React.FC<{ f: number; len?: number; light?: number; dark?: number; skyCol?: string }> = ({ f, len = 12, light = 1, dark = 0, skyCol = "#f0b890" }) => {
  const R = 1.6, rows = Math.floor(len / 0.82);
  const wall = tx("cabw", () => textTex("cabwt", 256, 256, (c) => { c.fillStyle = "#e8e2d2"; c.fillRect(0, 0, 256, 256); for (let i = 0; i < 300; i++) { c.fillStyle = `rgba(120,100,80,${random("cw" + i) * 0.05})`; c.fillRect(random("cx" + i) * 256, random("cy" + i) * 256, 4, 4); } }), 4, 2);
  return <group>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.0, 0]}><cylinderGeometry args={[R, R, len, 48, 1, true]} /><meshStandardMaterial map={wall} roughness={0.8} side={THREE.BackSide} /></mesh>
    <B p={[0, 0, 0]} s={[2.9, 0.06, len]} c="#4a3a40" rough={1} />
    {[-1, 1].map((sd) => <group key={"bh" + sd} position={[0, 1.0, sd * len / 2]}><mesh rotation={[0, sd > 0 ? Math.PI : 0, 0]}><circleGeometry args={[R, 40]} /><meshStandardMaterial map={wall} roughness={0.8} /></mesh><B p={[0, 0.0, -sd * 0.02]} s={[0.7, 1.9, 0.04]} c="#b8b0a0" /><B p={[0.25, 0.0, -sd * 0.05]} s={[0.05, 0.05, 0.03]} c="#5a5a5e" metal={0.7} /></group>)}
    <B p={[0, 0.035, 0]} s={[0.5, 0.01, len]} c="#6a2a2a" rough={1} />
    {[-1, 1].map((sd) => <B key={sd} p={[sd * 1.05, 2.05, 0]} s={[0.8, 0.36, len]} c="#ece6d8" rough={0.6} r={[0, 0, sd * 0.25]} />)}
    {Array.from({ length: 6 }).map((_, i) => <B key={"l" + i} p={[0, 2.5, -len / 2 + 1 + i * (len - 2) / 5]} s={[0.6, 0.03, 1.2]} c="#fff8e8" e="#fff4dc" ei={1.4 * light} />)}
    {Array.from({ length: rows }).map((_, i) => { const z = -len / 2 + 0.6 + i * 0.82; return <group key={i}>
      {[-0.95, -0.47, 0.47, 0.95].map((x) => <Seat key={x} p={[x, 0.03, z]} />)}
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 1.5, 1.3, z]} rotation={[0, sd * -Math.PI / 2, sd * -0.15]}><mesh><planeGeometry args={[0.24, 0.32]} /><meshBasicMaterial color={skyCol} /></mesh></group>)}
    </group>; })}
    {light > 0 && Array.from({ length: 3 }).map((_, i) => <pointLight key={i} position={[0, 2.2, -len / 2 + 2 + i * (len - 4) / 2]} intensity={6 * light} distance={6} decay={1.5} color="#fff2e0" />)}
    <hemisphereLight args={["#f0e4d8", "#4a3a3a", 0.5 * light + 0.1]} />
    {dark > 0 && <mesh position={[0, 1, 0]}><sphereGeometry args={[0.6, 8, 6]} /><meshBasicMaterial color="#000" transparent opacity={0} /></mesh>}
  </group>;
};

/* ---------------- hospital ---------------- */
export const Hospital: React.FC<{ f: number; monitor?: number }> = ({ f, monitor = 1 }) => {
  const tile = tx("hostile", () => textTex("hosp72", 256, 256, (c) => { c.fillStyle = "#c8d4c8"; c.fillRect(0, 0, 256, 256); c.strokeStyle = "#a8b4a8"; c.lineWidth = 3; for (let i = 0; i <= 256; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, 256); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(256, i); c.stroke(); } }), 3, 1.2);
  const beat = ((f / FPS) * 1.2) % 1;
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 6]} /><meshStandardMaterial color="#8a948a" roughness={0.4} /></mesh>
    {[[0, 1.5, -2.5, 0], [-3, 1.5, 0, Math.PI / 2], [3, 1.5, 0, -Math.PI / 2]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} rotation={[0, r, 0]} receiveShadow><planeGeometry args={[6, 3]} /><meshStandardMaterial map={tile} roughness={0.5} /></mesh>)}
    <group position={[0, 0, -0.6]}>
      <B p={[0, 0.5, 0]} s={[1.0, 0.12, 2.1]} c="#e8ece8" rough={0.5} />
      <B p={[0, 0.62, 0]} s={[0.96, 0.12, 2.0]} c="#f4f4f0" rough={0.9} />
      <B p={[0, 0.75, -0.8]} s={[0.6, 0.14, 0.34]} c="#ffffff" rough={0.9} />
      <B p={[0, 0.72, 0.35]} s={[0.98, 0.14, 1.3]} c="#d8e0e8" rough={0.95} />
      {[[-0.48, -1.0], [0.48, -1.0], [-0.48, 1.0], [0.48, 1.0]].map(([x, z], i) => <B key={i} p={[x, 0.25, z]} s={[0.05, 0.5, 0.05]} c="#c8ccd0" metal={0.7} rough={0.3} />)}
      <B p={[0, 0.9, -1.05]} s={[1.0, 0.8, 0.05]} c="#c8ccd0" metal={0.7} rough={0.3} />
    </group>
    {/* IV stand */}
    <group position={[0.85, 0, -1.3]}><mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.015, 0.015, 1.9, 8]} /><meshStandardMaterial color="#c8ccd0" metalness={0.8} /></mesh><B p={[0, 1.75, 0.05]} s={[0.12, 0.2, 0.04]} c="#e8f0ff" /></group>
    {/* monitor */}
    <group position={[-0.9, 1.3, -1.4]} rotation={[0, 0.4, 0]}><B p={[0, 0, 0]} s={[0.5, 0.36, 0.25]} c="#d8d4c8" /><mesh position={[0, 0.02, 0.13]}><planeGeometry args={[0.38, 0.26]} /><meshBasicMaterial map={textTex("ecgscr" + Math.floor(beat * 20), 256, 176, (c) => { c.fillStyle = "#04140a"; c.fillRect(0, 0, 256, 176); c.strokeStyle = "#3aff6a"; c.lineWidth = 4; c.beginPath(); for (let x = 0; x < 256; x++) { const u = ((x / 256) * 2 + 1 - beat * 2) % 1; const y = 90 - (u > 0.45 && u < 0.5 ? (u - 0.45) * 1400 : u > 0.5 && u < 0.55 ? (0.55 - u) * 1400 - 20 : 0); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); })} /></mesh>
      <pointLight position={[0, 0, 0.4]} intensity={0.8 * monitor} distance={2} color="#3aff6a" /></group>
    {/* window with winter light */}
    <group position={[2.98, 1.6, -0.6]} rotation={[0, -Math.PI / 2, 0]}><mesh><planeGeometry args={[1.4, 1.2]} /><meshBasicMaterial color="#dfe8f4" /></mesh><B p={[0, 0, 0.03]} s={[0.05, 1.2, 0.05]} c="#e8e8e8" /><B p={[0, 0, 0.03]} s={[1.4, 0.05, 0.05]} c="#e8e8e8" /></group>
    <spotLight position={[4.5, 2.6, -0.6]} target-position={[0, 0.7, -0.6]} angle={0.4} penumbra={0.7} intensity={120} distance={10} decay={1.5} color="#e8f0ff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    <hemisphereLight args={["#dfe8f0", "#4a5048", 0.8]} />
    <pointLight position={[0, 2.6, 0.8]} intensity={4} distance={6} color="#fff8f0" />
  </group>;
};
