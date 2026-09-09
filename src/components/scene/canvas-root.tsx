import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PlantScene } from "./plant-scene";

export function CanvasRoot() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [3.35, 1.15, 3.6], fov: 38, near: 0.08, far: 80 }}
      gl={{ antialias: true, localClippingEnabled: true, toneMappingExposure: 1.6 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#12161c");
      }}
      className="absolute inset-0 z-0"
      style={{ touchAction: "none" }}
    >
      <Suspense fallback={null}>
        <PlantScene />
      </Suspense>
    </Canvas>
  );
}
