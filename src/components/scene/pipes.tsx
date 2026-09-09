import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CFG } from "@/lib/sim-config";
import { simFrame } from "@/lib/sim-frame";
import { getTextures } from "@/lib/textures";

function makeHollow(rOut: number, rIn: number, h: number) {
  const outer = new THREE.CylinderGeometry(rOut, rOut, h, 64, 1, true);
  const inner = new THREE.CylinderGeometry(rIn, rIn, h, 64, 1, true);
  return { outer, inner };
}

export function HollowPipe({
  radius = CFG.pipeR,
  inner = CFG.pipeInnerR,
  height,
  position,
  rotation,
}: {
  radius?: number;
  inner?: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const tex = getTextures();
  const { outer, inner: innerG } = useMemo(
    () => makeHollow(radius, inner, height),
    [radius, inner, height],
  );
  const steel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8b929a",
        map: tex.steel,
        metalness: 0.72,
        roughness: 0.38,
      }),
    [tex],
  );
  const innerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#5d636a",
        metalness: 0.55,
        roughness: 0.5,
        side: THREE.BackSide,
      }),
    [],
  );
  const ring = useMemo(() => new THREE.RingGeometry(inner, radius, 64), [inner, radius]);
  const capMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#a3aab2",
        metalness: 0.8,
        roughness: 0.32,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useLayoutEffect(() => {
    return () => {
      outer.dispose();
      innerG.dispose();
      ring.dispose();
      steel.dispose();
      innerMat.dispose();
      capMat.dispose();
    };
  }, [outer, innerG, ring, steel, innerMat, capMat]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={outer} material={steel} castShadow receiveShadow />
      <mesh geometry={innerG} material={innerMat} />
      <mesh geometry={ring} material={capMat} position={[0, height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={ring} material={capMat} position={[0, -height / 2, 0]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

export function SharpLip({ y }: { y: number }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const geo = useMemo(
    () => new THREE.TorusGeometry(CFG.pipeR - CFG.pipeWall * 0.5, 0.0042, 10, 80),
    [],
  );

  useFrame(() => {
    if (!matRef.current) return;
    const heat = simFrame.heat * (1 - simFrame.cheder);
    matRef.current.emissiveIntensity = heat * 2.4;
  });

  useLayoutEffect(() => () => geo.dispose(), [geo]);

  return (
    <mesh geometry={geo} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        ref={matRef}
        color="#d2d7de"
        metalness={0.95}
        roughness={0.18}
        emissive="#ff4d18"
        emissiveIntensity={0}
      />
    </mesh>
  );
}

export function ClampBand({ y }: { y: number }) {
  const tex = getTextures();
  const r = CFG.pipeR + CFG.chederRubber + CFG.compThickness + 0.018;
  const band = useMemo(() => new THREE.CylinderGeometry(r, r, CFG.clampH, 64, 1, true), [r]);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9aa3ac",
        map: tex.steel,
        metalness: 0.88,
        roughness: 0.3,
      }),
    [tex],
  );
  const bolt = useMemo(() => new THREE.BoxGeometry(0.07, 0.055, 0.09), []);
  const boltMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#6a7180",
        metalness: 0.9,
        roughness: 0.28,
      }),
    [],
  );

  useLayoutEffect(() => {
    return () => {
      band.dispose();
      mat.dispose();
      bolt.dispose();
      boltMat.dispose();
    };
  }, [band, mat, bolt, boltMat]);

  return (
    <group position={[0, y, 0]}>
      <mesh geometry={band} material={mat} castShadow />
      <mesh geometry={bolt} material={boltMat} position={[r + 0.02, 0, 0]} castShadow />
      <mesh position={[r + 0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.05, 12]} />
        <meshStandardMaterial color="#c5ccd4" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function Flange({ y }: { y: number }) {
  const r = CFG.pipeR + 0.09;
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[r, r, 0.032, 48]} />
        <meshStandardMaterial color="#7c838c" metalness={0.7} roughness={0.4} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (r - 0.035), 0.028, Math.sin(a) * (r - 0.035)]}>
            <cylinderGeometry args={[0.012, 0.012, 0.04, 10]} />
            <meshStandardMaterial color="#4e555e" metalness={0.85} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

export function UpperStack() {
  const top = CFG.upperRimY + CFG.upperPipeH;
  return (
    <group>
      <HollowPipe height={CFG.upperPipeH} position={[0, CFG.upperRimY + CFG.upperPipeH / 2, 0]} />
      <Flange y={CFG.upperRimY + 0.12} />
      <Flange y={top - 0.02} />
      <group position={[0, top, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.55, 0, 0]} castShadow>
          <cylinderGeometry args={[CFG.pipeR, CFG.pipeR, 1.1, 48]} />
          <meshStandardMaterial color="#858c94" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
      <ClampBand y={CFG.upperRimY - 0.055} />
    </group>
  );
}

export function LowerStub() {
  return (
    <group>
      <HollowPipe height={CFG.lowerPipeH} position={[0, CFG.lowerRimY - CFG.lowerPipeH / 2, 0]} />
      <ClampBand y={CFG.lowerRimY + 0.055} />
    </group>
  );
}
