import * as THREE from "three";

function makeCanvas(size: number) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d");
  return { c, ctx };
}

function steelPaint() {
  const { c, ctx } = makeCanvas(512);
  ctx.fillStyle = "#6d747c";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(40,44,48,${0.04 + Math.random() * 0.12})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 8 + Math.random() * 70, 2 + Math.random() * 10);
  }
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(190,198,206,${0.05 + Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 2 + Math.random() * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function rubberDust() {
  const { c, ctx } = makeCanvas(512);
  ctx.fillStyle = "#3a3e44";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1200; i++) {
    const g = 90 + Math.random() * 80;
    ctx.fillStyle = `rgba(${g},${g - 10},${g - 25},${0.04 + Math.random() * 0.12})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function herringbone() {
  const { c, ctx } = makeCanvas(256);
  ctx.fillStyle = "#2a3d68";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#9aa6b8";
  ctx.lineWidth = 3;
  for (let y = -32; y < 288; y += 16) {
    for (let x = -32; x < 288; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 16, y + 8);
      ctx.lineTo(x, y + 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 32, y);
      ctx.lineTo(x + 16, y + 8);
      ctx.lineTo(x + 32, y + 16);
      ctx.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.repeat.set(10, 1);
  return t;
}

function concrete() {
  const { c, ctx } = makeCanvas(512);
  ctx.fillStyle = "#5c5852";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2000; i++) {
    const n = 70 + Math.random() * 90;
    ctx.fillStyle = `rgba(${n},${n - 4},${n - 10},${0.15})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }
  for (let i = 0; i < 18; i++) {
    ctx.strokeStyle = `rgba(40,38,34,${0.15 + Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.lineTo(Math.random() * 512, Math.random() * 512);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 6);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export type PlantTextures = {
  steel: THREE.CanvasTexture;
  rubber: THREE.CanvasTexture;
  herringbone: THREE.CanvasTexture;
  concrete: THREE.CanvasTexture;
};

let cache: PlantTextures | null = null;

export function getTextures(): PlantTextures {
  if (cache) return cache;
  cache = {
    steel: steelPaint(),
    rubber: rubberDust(),
    herringbone: herringbone(),
    concrete: concrete(),
  };
  return cache;
}
