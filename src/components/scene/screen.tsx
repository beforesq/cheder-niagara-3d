import { useMemo } from "react";
import * as THREE from "three";
import { CFG } from "@/lib/sim-config";

function HelixSpring({ position }: { position: [number, number, number] }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 7;
    const segs = 80;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const a = t * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 0.055, t * 0.38, Math.sin(a) * 0.055));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 80, 0.011, 7, false);
  }, []);
  return (
    <mesh geometry={geo} position={position} castShadow>
      <meshStandardMaterial color="#6e7782" metalness={0.8} roughness={0.32} />
    </mesh>
  );
}

export function VibratingScreen() {
  const y = CFG.lowerRimY - CFG.lowerPipeH - CFG.screenH * 0.35;
  const hw = CFG.screenW * 0.5;
  const hd = CFG.screenD * 0.5;

  return (
    <group position={[0, y, 0]} rotation={[-0.06, 0, 0]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[CFG.screenW, CFG.screenH, CFG.screenD]} />
        <meshStandardMaterial color="#5f656e" metalness={0.55} roughness={0.48} />
      </mesh>
      <mesh position={[0, CFG.screenH * 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CFG.screenW - 0.18, CFG.screenD - 0.18, 18, 10]} />
        <meshStandardMaterial color="#9aa15a" metalness={0.2} roughness={0.7} wireframe />
      </mesh>
      <mesh position={[0, CFG.screenH * 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CFG.screenW - 0.22, CFG.screenD - 0.22]} />
        <meshStandardMaterial color="#3d3a32" metalness={0.1} roughness={0.9} />
      </mesh>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}${sz}`}
            position={[sx * (hw - 0.08), CFG.screenH * 0.15, sz * (hd - 0.08)]}
          >
            <boxGeometry args={[0.08, CFG.screenH * 1.1, 0.08]} />
            <meshStandardMaterial color="#4b5158" metalness={0.6} roughness={0.4} />
          </mesh>
        )),
      )}
      <HelixSpring position={[hw - 0.22, -CFG.screenH * 0.72, hd - 0.18]} />
      <HelixSpring position={[-hw + 0.22, -CFG.screenH * 0.72, hd - 0.18]} />
      <HelixSpring position={[hw - 0.22, -CFG.screenH * 0.72, -hd + 0.18]} />
      <HelixSpring position={[-hw + 0.22, -CFG.screenH * 0.72, -hd + 0.18]} />
      <group position={[hw + 0.12, 0.05, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.34, 24]} />
          <meshStandardMaterial color="#3a4048" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0.12, 0.12, 0.08]} castShadow>
          <boxGeometry args={[0.08, 0.16, 0.16]} />
          <meshStandardMaterial color="#2c3138" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
      <mesh position={[0, -CFG.screenH * 0.55, 0.1]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.85, 0.12, 0.55]} />
        <meshStandardMaterial color="#6a717a" metalness={0.5} roughness={0.45} />
      </mesh>
    </group>
  );
}
