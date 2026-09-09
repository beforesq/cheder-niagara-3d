import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CameraControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { CFG, STEPS } from "@/lib/sim-config";
import { simFrame } from "@/lib/sim-frame";
import { useSim } from "@/lib/sim-store";
import { Cheder } from "./cheder";
import { Compensator, CutFlap } from "./compensator";
import { LowerStub, SharpLip, UpperStack } from "./pipes";
import { VibratingScreen } from "./screen";
import { Hall } from "./hall";
import { Callouts } from "./callouts";

export function PlantScene() {
  const lower = useRef<THREE.Group>(null);
  const controls = useRef<CameraControls>(null);
  const lastCam = useRef(-1);
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.02), []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    const store = useSim.getState();
    store.tick(d);

    const t = store.time;
    const amp = store.playing ? 1 : 0.18;
    simFrame.shift.set(
      Math.sin(t * CFG.vibFreq) * CFG.vibAmpX * amp,
      Math.sin(t * CFG.vibFreq * 1.13 + 0.4) * CFG.vibAmpZ * amp,
    );
    if (lower.current) {
      lower.current.position.x = simFrame.shift.x;
      lower.current.position.z = simFrame.shift.y;
    }

    simFrame.cut = store.cut;
    simFrame.heat = store.heat;
    simFrame.cheder = store.chederOn;

    const gl = state.gl;
    if (store.section) {
      gl.clippingPlanes = [clipPlane];
      gl.localClippingEnabled = true;
    } else {
      gl.clippingPlanes = [];
      gl.localClippingEnabled = false;
    }

    if (controls.current && lastCam.current !== store.step) {
      lastCam.current = store.step;
      const c = STEPS[store.step]?.camera;
      if (c) {
        const sectional = store.section && (store.step === 2 || store.step === 4);
        const look = sectional
          ? { px: 2.15, py: c.ty + 0.05, pz: 0.05, tx: 0, ty: c.ty, tz: 0 }
          : c;
        void controls.current.setLookAt(look.px, look.py, look.pz, look.tx, look.ty, look.tz, true);
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#2a3340"]} />
<fog attach="fog" args={["#2a3340", 14, 38]} />

<hemisphereLight args={["#eef2f6", "#4a4538", 1.0]} />
<ambientLight intensity={2.0} />
<directionalLight
  position={[12, 22, 12]}
  intensity={3.5}
  castShadow
  shadow-mapSize-width={2048}
  shadow-mapSize-height={2048}
  shadow-camera-far={30}
  shadow-camera-left={-10}
  shadow-camera-right={10}
  shadow-camera-top={10}
  shadow-camera-bottom={-10}
/>
<directionalLight position={[-8, 6, -5]} intensity={1.8} color={"#b8c8e0"} />
<spotLight
  position={[10, 22, 10]}
  intensity={3.0}
  angle={0.5}
  penumbra={0.5}
  distance={20}
  castShadow
/>

      <Hall />

      <group>
        <UpperStack />
        <Cheder y={CFG.upperRimY} flip />
        <SharpLip y={CFG.upperRimY} />
        <Compensator />
        <CutFlap />
        <group ref={lower}>
          <LowerStub />
          <Cheder y={CFG.lowerRimY} />
          <SharpLip y={CFG.lowerRimY} />
          <VibratingScreen />
        </group>
      </group>

      <Callouts />
      <ContactShadows position={[0, -2.54, 0]} opacity={0.45} scale={18} blur={2.4} far={8} />

      <CameraControls
        ref={controls}
        makeDefault
        minDistance={0.7}
        maxDistance={12}
        maxPolarAngle={Math.PI * 0.49}
        smoothTime={0.35}
      />
    </>
  );
}
