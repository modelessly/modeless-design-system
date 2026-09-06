export type GlobeVec3 = { x: number; y: number; z: number };
export type GlobeProjectedPoint = { x: number; y: number; z: number; visible: boolean };

const DEG = Math.PI / 180;

export function latLonToSpherePoint(lat: number, lon: number): GlobeVec3 {
  const la = lat * DEG;
  const lo = lon * DEG;
  const cl = Math.cos(la);
  return { x: cl * Math.sin(lo), y: Math.sin(la), z: cl * Math.cos(lo) };
}

export function rotateY(p: GlobeVec3, a: number): GlobeVec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

export function rotateX(p: GlobeVec3, a: number): GlobeVec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

export function scaleVec(p: GlobeVec3, k: number): GlobeVec3 {
  return { x: p.x * k, y: p.y * k, z: p.z * k };
}

export function projectSpherePoint(p: GlobeVec3, cx: number, cy: number, radius: number): GlobeProjectedPoint {
  return { x: cx + p.x * radius, y: cy - p.y * radius, z: p.z, visible: p.z >= 0 };
}

export function slerp(a: GlobeVec3, b: GlobeVec3, t: number): GlobeVec3 {
  let dot = a.x * b.x + a.y * b.y + a.z * b.z;
  dot = Math.max(-1, Math.min(1, dot));
  const theta = Math.acos(dot);
  if (theta < 1e-4) return { ...a };
  const s = Math.sin(theta);
  const w1 = Math.sin((1 - t) * theta) / s;
  const w2 = Math.sin(t * theta) / s;
  return {
    x: a.x * w1 + b.x * w2,
    y: a.y * w1 + b.y * w2,
    z: a.z * w1 + b.z * w2,
  };
}

export function createGlobeArc(a: GlobeVec3, b: GlobeVec3, altitude: number, samples: number): GlobeVec3[] {
  const pts: GlobeVec3[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const m = slerp(a, b, t);
    const lift = 1 + altitude * Math.sin(Math.PI * t);
    pts.push(scaleVec(m, lift));
  }
  return pts;
}
