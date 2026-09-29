/**
 * Minimal orthographic projection for drawing mechanical parts in SVG.
 * World axes: x = across the machine, y = up, z = forward.
 * After rotation, +z points toward the viewer. SVG y points down, so
 * projected y is negated.
 */

const toRad = (deg) => (deg * Math.PI) / 180;
const LIGHT = normalize([-0.35, 0.65, 0.68]);

function normalize([x, y, z]) {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

/** Rotate a point by yaw (about y) then pitch (about x). */
export function rotate([x, y, z], yaw, pitch) {
  const cy = Math.cos(toRad(yaw));
  const sy = Math.sin(toRad(yaw));
  const cp = Math.cos(toRad(pitch));
  const sp = Math.sin(toRad(pitch));

  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  return [x1, y2, z2];
}

const screen = (p) => [p[0], -p[1]];
const lit = (n) => Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);

/**
 * Project a cylinder between two 3D points (a pin, a roller, a hydraulic
 * ram). Returns the silhouette outline, both end ellipses (as center, radii
 * and rotation), which end faces the viewer, and a depth for sorting.
 */
export function projectTube(p0, p1, r, yaw, pitch) {
  const a = rotate(p0, yaw, pitch);
  const b = rotate(p1, yaw, pitch);
  const d = normalize([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);

  const len = Math.hypot(d[0], d[1]);
  // Screen-space unit vectors along and across the projected axis.
  const ux = len > 1e-6 ? d[0] / len : 1;
  const uy = len > 1e-6 ? -d[1] / len : 0;
  const nx = -uy;
  const ny = ux;

  const A = { x: a[0], y: -a[1] };
  const B = { x: b[0], y: -b[1] };

  return {
    A,
    B,
    r,
    minor: Math.max(r * Math.abs(d[2]), 0.001),
    angle: (Math.atan2(uy, ux) * 180) / Math.PI,
    outline: [
      [A.x + nx * r, A.y + ny * r],
      [B.x + nx * r, B.y + ny * r],
      [B.x - nx * r, B.y - ny * r],
      [A.x - nx * r, A.y - ny * r],
    ],
    // The end cap whose outward normal faces the viewer.
    frontIsB: d[2] >= 0,
    shade: lit([nx, -ny, 0]) * 0.5 + 0.35,
    depth: (a[2] + b[2]) / 2,
    center: { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 },
  };
}

/**
 * Project a flat plate: a 2D profile of [z, y] points extruded across
 * x0 → x1 and offset by [dx, dy, dz]. Hidden faces are culled; visible side
 * walls come back sorted far → near, then the visible end face on top.
 */
export function projectPlate(profile, x0, x1, [dx, dy, dz], yaw, pitch) {
  const at = (x, [z, y]) => rotate([x + dx, y + dy, z + dz], yaw, pitch);
  const back = profile.map((p) => at(x0, p));
  const front = profile.map((p) => at(x1, p));

  // Winding of the profile decides which way each side wall faces.
  let area = 0;
  profile.forEach(([z1, y1], i) => {
    const [z2, y2] = profile[(i + 1) % profile.length];
    area += z1 * y2 - z2 * y1;
  });
  const sign = area >= 0 ? 1 : -1;

  const sides = [];
  profile.forEach(([z1, y1], i) => {
    const j = (i + 1) % profile.length;
    const [z2, y2] = profile[j];
    const n = rotate([0, -(z2 - z1) * sign, (y2 - y1) * sign], yaw, pitch);
    if (n[2] <= 1e-6) return;
    const quad = [back[i], back[j], front[j], front[i]];
    sides.push({
      pts: quad.map(screen),
      depth: quad.reduce((s, q) => s + q[2], 0) / 4,
      shade: 0.3 + lit(normalize(n)) * 0.55,
    });
  });
  sides.sort((a, b) => a.depth - b.depth);

  const xn = rotate([1, 0, 0], yaw, pitch);
  const capIsFront = xn[2] >= 0;
  const capX = capIsFront ? x1 : x0;
  const cap = (capIsFront ? front : back).map(screen);

  const all = [...back, ...front];
  const depth = all.reduce((s, q) => s + q[2], 0) / all.length;

  return {
    sides,
    cap,
    capShade: 0.3 + lit(normalize(capIsFront ? xn : xn.map((v) => -v))) * 0.55,
    // Project any detail profile (a window, a panel) onto the visible end face.
    onCap: (detail) => detail.map((p) => screen(at(capX + (capIsFront ? 0.2 : -0.2), p))),
    depth,
  };
}

export const toPoints = (pts) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
