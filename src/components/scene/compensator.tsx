import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CFG } from "@/lib/sim-config";
import { simFrame } from "@/lib/sim-frame";
import { getTextures } from "@/lib/textures";

function compensatorProfile() {
  const inner = CFG.pipeR + CFG.chederRubber + 0.006;
  const outer = inner + CFG.compThickness;
  const y0 = CFG.lowerRimY - CFG.compOverlap;
  const y1 = CFG.upperRimY + CFG.compOverlap;
  const pts: THREE.Vector2[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = y0 + (y1 - y0) * t;
    const belly = Math.sin(t * Math.PI);
    const r = outer + CFG.compBulge * belly;
    pts.push(new THREE.Vector2(r, y));
  }
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const y = y0 + (y1 - y0) * t;
    const belly = Math.sin(t * Math.PI);
    const r = inner + CFG.compBulge * belly * 0.92;
    pts.push(new THREE.Vector2(r, y));
  }
  return pts;
}

export function Compensator() {
  const uniforms = useMemo(
    () => ({
      uShift: { value: new THREE.Vector2() },
      uCut: { value: 0 },
      uHeat: { value: 0 },
      uProt: { value: 0 },
      uY0: { value: CFG.lowerRimY - CFG.compOverlap },
      uY1: { value: CFG.upperRimY + CFG.compOverlap },
      uLow: { value: CFG.lowerRimY },
      uHigh: { value: CFG.upperRimY },
    }),
    [],
  );

  const tex = getTextures();
  const geo = useMemo(() => new THREE.LatheGeometry(compensatorProfile(), 96), []);

  const mat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: "#3c4148",
      map: tex.rubber,
      roughness: 0.88,
      metalness: 0.02,
      clearcoat: 0.06,
      sheen: 0.4,
      sheenColor: new THREE.Color("#2a2c30"),
      side: THREE.DoubleSide,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uShift = uniforms.uShift;
      shader.uniforms.uCut = uniforms.uCut;
      shader.uniforms.uHeat = uniforms.uHeat;
      shader.uniforms.uProt = uniforms.uProt;
      shader.uniforms.uY0 = uniforms.uY0;
      shader.uniforms.uY1 = uniforms.uY1;
      shader.uniforms.uLow = uniforms.uLow;
      shader.uniforms.uHigh = uniforms.uHigh;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
           uniform vec2 uShift;
           uniform float uY0;
           uniform float uY1;
           varying vec3 vObjPos;`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           vObjPos = position;
           float tt = clamp((position.y - uY0) / max(0.0001, (uY1 - uY0)), 0.0, 1.0);
           float ease = tt * tt * (3.0 - 2.0 * tt);
           transformed.x += mix(uShift.x, 0.0, ease);
           transformed.z += mix(uShift.y, 0.0, ease);`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
           uniform float uCut;
           uniform float uHeat;
           uniform float uProt;
           uniform float uLow;
           uniform float uHigh;
           varying vec3 vObjPos;`,
        )
        .replace(
          "#include <clipping_planes_fragment>",
          `#include <clipping_planes_fragment>
           float ang = atan(vObjPos.z, vObjPos.x);
           float da = atan(sin(ang - 1.45), cos(ang - 1.45));
           float dy = (vObjPos.y - uLow - 0.04) / 0.16;
           float ragged = sin(ang * 17.0) * 0.07 + sin(ang * 9.0 + dy * 8.0) * 0.05;
           float hole = 1.0 - smoothstep(0.0, 0.72, length(vec2(da * 1.15, dy)) - ragged);
           if (uCut > 0.04 && hole * uCut > 0.42) discard;`,
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
           float ringL = exp(-pow((vObjPos.y - uLow) / 0.028, 2.0));
           float ringH = exp(-pow((vObjPos.y - uHigh) / 0.028, 2.0));
           float rings = max(ringL, ringH);
           vec3 heatCol = mix(vec3(1.0, 0.22, 0.04), vec3(0.15, 0.55, 0.32), uProt);
           totalEmissiveRadiance += heatCol * rings * uHeat * (1.15 - uProt * 0.4);
           diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.14, 0.09, 0.07), rings * uHeat * (1.0 - uProt) * 0.75);`,
        );
    };
    m.customProgramCacheKey = () => "compensator-cut-v4";
    return m;
  }, [tex, uniforms]);

  useFrame(() => {
    uniforms.uShift.value.copy(simFrame.shift);
    uniforms.uCut.value = simFrame.cut;
    uniforms.uHeat.value = simFrame.heat;
    uniforms.uProt.value = simFrame.cheder;
  });

  useLayoutEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  return <mesh geometry={geo} material={mat} castShadow receiveShadow />;
}

export function CutFlap() {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(0.22, 0.18, 8, 8), []);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#2b2420",
        roughness: 0.95,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame(() => {
    if (!ref.current) return;
    const cut = simFrame.cut;
    const shift = simFrame.shift;
    const k = Math.max(0, cut - 0.35) / 0.65;
    ref.current.visible = k > 0.02;
    ref.current.position.set(shift.x * 0.4, CFG.lowerRimY + 0.02, 0.46 + shift.y * 0.2);
    ref.current.rotation.set(-0.15 - k * 0.9, 0.2, k * 0.5);
  });

  useLayoutEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  return <mesh ref={ref} geometry={geo} material={mat} visible={false} />;
}
