#!/usr/bin/env node
/**
 * Builds every logo file in public/ from the one source mark,
 * src/brand/recall-mark.svg, in the logo colours --brand (tile) and
 * --on-brand (mark) from src/styles/tokens.css.
 * Nothing else in the repo draws the logo: the header's <Logo /> reads the
 * same mark, and the launcher's Windows shortcut icon wraps icon-192.png.
 *
 * Writes:
 *   public/icon.svg               rounded tile, vector (manifest)
 *   public/favicon.ico            16, 32, 48 (browser tab; 16 and 32 hand-tuned)
 *   public/apple-touch-icon.png   180, full-bleed square (iOS rounds it)
 *   public/icon-192.png           192, rounded tile (manifest, desktop shortcut)
 *   public/icon-512.png           512, rounded tile (manifest)
 *   public/icon-maskable-512.png  512, full-bleed, mark inside the 80% safe circle
 *
 * The outputs are committed, so `npm start` and `npm run build` need nothing.
 * Rerun this after changing the mark or the two colours:
 *   npm run build:icons
 */

const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const APP = path.join(__dirname, '..');
const MARK = path.join(APP, 'src', 'brand', 'recall-mark.svg');
const TOKENS = path.join(APP, 'src', 'styles', 'tokens.css');
const PUBLIC = path.join(APP, 'public');

// Mark scale inside a 64 tile, as a share of the 64 box. The tile keeps a
// margin round the ink; the maskable icon shrinks it to 80% of that so the
// whole mark stays inside the circle Android crops to.
// At 16 and 32 px the tile margin and corner radius would cost the mark most
// of its pixels, so the favicon frames use a tighter tile. At 16 px the ear
// and eye cut-outs blur into grey, so that frame drops them (a solid
// silhouette) and nudges the mark, in 64-box units, so the back, belly, legs
// and feet land on whole pixels.
const TILE = { scale: 0.78, radius: 14 };
const SMALL = { scale: 0.92, radius: 10 };
const TINY = { ...SMALL, solid: true, nudge: [-1.2, -1.4] };
const MASKABLE = { scale: TILE.scale * 0.8, radius: 0 };
const FULL_BLEED = { scale: TILE.scale, radius: 0 };

function token(css, name) {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})\\b`));
  if (!m) throw new Error(`build-icons: --${name} is not a hex colour in ${path.relative(APP, TOKENS)}`);
  return m[1].toLowerCase();
}

const markSvg = fs.readFileSync(MARK, 'utf8');
const tokens = fs.readFileSync(TOKENS, 'utf8');
const BRAND = token(tokens, 'brand');
const ON_BRAND = token(tokens, 'on-brand');

const inner = markSvg
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/^[\s\S]*?<svg\b[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .replace(/>\s+</g, '><')
  .trim();
if (!inner) throw new Error('build-icons: no content inside the <svg> of recall-mark.svg');

// Centre the tile on the ink (strokes included), not on the 64 box.
const ink = new Resvg(markSvg.replace(/currentColor/g, '#000')).getBBox();
if (!ink) throw new Error('build-icons: recall-mark.svg draws nothing');
const cx = +(ink.x + ink.width / 2).toFixed(2);
const cy = +(ink.y + ink.height / 2).toFixed(2);

// The mark without its cut-outs: drop the <defs> holding the mask and the
// mask reference.
const solidInner = inner.replace(/<defs>[\s\S]*?<\/defs>/, '').replace(/\smask="[^"]*"/, '');
if (/mask/.test(solidInner)) throw new Error('build-icons: could not strip the mask from recall-mark.svg');

function tileSvg({ scale, radius, solid = false, nudge = [0, 0] }) {
  const tile = radius
    ? `<rect width="64" height="64" rx="${radius}" fill="${BRAND}"/>`
    : `<rect width="64" height="64" fill="${BRAND}"/>`;
  const s = +scale.toFixed(4);
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    tile +
    `<g color="${ON_BRAND}" fill="currentColor" transform="translate(${32 + nudge[0]} ${32 + nudge[1]}) scale(${s}) translate(${-cx} ${-cy})">` +
    (solid ? solidInner : inner) +
    '</g></svg>\n'
  );
}

function png(svg, size) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

// An ICO whose frames are PNGs: a 6-byte header, one 16-byte entry per frame,
// then the PNG bytes (supported by every browser and by Windows Vista on).
function ico(frames) {
  const header = Buffer.alloc(6 + 16 * frames.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach(({ size, data }, i) => {
    const at = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, at);
    header.writeUInt8(size >= 256 ? 0 : size, at + 1);
    header.writeUInt8(0, at + 2);
    header.writeUInt8(0, at + 3);
    header.writeUInt16LE(1, at + 4);
    header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(data.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...frames.map(f => f.data)]);
}

const tile = tileSvg(TILE);
const outputs = {
  'icon.svg': tile,
  'favicon.ico': ico([
    { size: 16, data: png(tileSvg(TINY), 16) },
    { size: 32, data: png(tileSvg(SMALL), 32) },
    { size: 48, data: png(tile, 48) },
  ]),
  'apple-touch-icon.png': png(tileSvg(FULL_BLEED), 180),
  'icon-192.png': png(tile, 192),
  'icon-512.png': png(tile, 512),
  'icon-maskable-512.png': png(tileSvg(MASKABLE), 512),
};

for (const [name, data] of Object.entries(outputs)) {
  fs.writeFileSync(path.join(PUBLIC, name), data);
  console.log(`build-icons: wrote public/${name}`);
}
