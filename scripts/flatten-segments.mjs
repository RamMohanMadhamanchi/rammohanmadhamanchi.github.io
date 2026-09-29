/**
 * Postbuild fix for static export prefetching.
 *
 * For dynamic routes, `next build` writes segment prefetch payloads as nested
 * files (out/projects/x/__next.projects/$d$slug/__PAGE__.txt) while the client
 * router requests a flattened name (__next.projects.$d$slug.__PAGE__.txt).
 * Static hosts like GitHub Pages then return 404 for every prefetch. This
 * writes a flattened copy next to each nested payload.
 */
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = "out";
let copied = 0;

function walk(dir, fn) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, fn);
    else fn(path);
  }
}

function visit(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (!statSync(path).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      walk(path, (file) => {
        const flat = join(dir, [name, ...relative(path, file).split(sep)].join("."));
        if (!existsSync(flat)) {
          copyFileSync(file, flat);
          copied += 1;
        }
      });
    } else {
      visit(path);
    }
  }
}

if (existsSync(root)) {
  visit(root);
  console.log(`flatten-segments: wrote ${copied} prefetch file(s)`);
}
