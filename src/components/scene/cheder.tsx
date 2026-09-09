import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CFG } from "@/lib/sim-config";
import { simFrame } from "@/lib/sim-frame";
import { getTextures } from "@/lib/textures";

function uProfile(innerR: number, outerR: number, rubber: number, leg: number, web: number) {
  const pts: THREE.Vector2[] = [];
  const t = rubber;
  pts.push(new THREE.Vector2(outerR + t, -leg));
  pts.push(new THREE.Vector2(outerR + t, web));
  pts.push(new THREE.Vector2(innerR - t, web));
  pts.push(new THREE.Vector2(innerR - t, -leg));
  pts.push(new THREE.Vector2(innerR - t * 0.15, -leg));
  pts.push(new THREE.Vector2(innerR, -leg + t * 0.4));
  pts.push(new THREE.Vector2(innerR, 0));
  pts.push(new THREE.Vector2(outerR, 0));
  pts.push(new THREE.Vector2(outerR, -leg + t * 0.4));
  pts.push(new THREE.Vector2(outerR + t * 0.15, -leg));
  return pts;
}

function metalInsert(innerR: number, outerR: number, rubber: number, leg: number, web: number) {
  const inset = rubber * 0.45;
  const pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(outerR + inset, -leg * 0.82));
  pts.push(new THREE.Vector2(outerR + inset, web * 0.55));
  pts.push(new THREE.Vector2(innerR - inset, web * 0.55));
  pts.push(new THREE.Vector2(innerR - inset, -leg * 0.82));
  pts.push(new THREE.Vector2(innerR - inset * 0.2, -leg * 0.82));
  pts.push(new THREE.Vector2(innerR + rubber * 0.15, -leg * 0.55));
  pts.push(new THREE.Vector2(innerR + rubber * 0.15, rubber * 0.2));
  pts.push(new THREE.Vector2(outerR - rubber * 0.15, rubber * 0.2));
  pts.push(new THREE.Vector2(outerR - rubber * 0.15, -leg * 0.55));
  pts.push(new THREE.Vector2(outerR + inset * 0.2, -leg * 0.82));
  return pts;
}

export function Cheder({ y, flip }: { y: number; flip?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const tex = getTextures();
  const innerR = CFG.pipeInnerR;
  const outerR = CFG.pipeR;

  const rubberGeo = useMemo(
    () => new THREE.LatheGeometry(uProfile(innerR, outerR, CFG.chederRubber, CFG.chederLeg, CFG.chederWeb), 96),
    [innerR, outerR],
  );
  const metalGeo = useMemo(
    () =>
      new THREE.LatheGeometry(
        metalInsert(innerR, outerR, CFG.chederRubber, CFG.chederLeg, CFG.chederWeb),
        64,
      ),
    [innerR, outerR],
  );

  const rubberMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1e3d73"),
      map: tex.herringbone,
      roughness: 0.62,
      metalness: 0.04,
      clearcoat: 0.18,
      clearcoatRoughness: 0.5,
      side: THREE.DoubleSide,
    });
  }, [tex]);

  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c5ccd3",
        metalness: 0.92,
        roughness: 0.28,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const teeth = useMemo(() => {
    const dummy = new THREE.Object3D();
    const geo = new THREE.ConeGeometry(CFG.toothW * 0.45, CFG.toothLen, 5);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: "#d7dde4",
      metalness: 0.85,
      roughness: 0.32,
    });
    const inst = new THREE.InstancedMesh(geo, mat, CFG.toothCount * 2);
    inst.castShadow = true;
    const n = CFG.toothCount;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      dummy.position.set(
        ca * (outerR + CFG.chederRubber * 0.15),
        -CFG.chederLeg * 0.28,
        sa * (outerR + CFG.chederRubber * 0.15),
      );
      dummy.lookAt(ca * (outerR + 0.2), -CFG.chederLeg * 0.28, sa * (outerR + 0.2));
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);

      dummy.position.set(
        ca * (innerR - CFG.chederRubber * 0.15),
        -CFG.chederLeg * 0.28,
        sa * (innerR - CFG.chederRubber * 0.15),
      );
      dummy.lookAt(0, -CFG.chederLeg * 0.28, 0);
      dummy.updateMatrix();
      inst.setMatrixAt(n + i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    return inst;
  }, [innerR, outerR]);

  useFrame(() => {
    const amount = simFrame.cheder;
    if (!group.current) return;
    const s = 0.12 + 0.88 * amount;
    group.current.visible = amount > 0.02;
    group.current.scale.setScalar(s);
  });

  useLayoutEffect(() => {
    return () => {
      rubberGeo.dispose();
      metalGeo.dispose();
      rubberMat.dispose();
      metalMat.dispose();
      teeth.geometry.dispose();
      (teeth.material as THREE.Material).dispose();
    };
  }, [rubberGeo, metalGeo, rubberMat, metalMat, teeth]);

  return (
    <group ref={group} position={[0, y, 0]} rotation={[flip ? Math.PI : 0, 0, 0]} visible={false}>
      <mesh geometry={rubberGeo} material={rubberMat} castShadow receiveShadow />
      <mesh geometry={metalGeo} material={metalMat} />
      <primitive object={teeth} />
    </group>
  );
}
