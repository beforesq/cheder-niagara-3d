import { getTextures } from "@/lib/textures";

export function Hall() {
  const tex = getTextures();
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.55, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={tex.concrete} color="#6a655e" roughness={0.95} metalness={0.02} />
      </mesh>
      {[-6, 6].map((x) =>
        [-6, 4].map((z) => (
          <group key={`${x}${z}`} position={[x, -0.2, z]}>
            <mesh position={[0, 1.4, 0]} castShadow>
              <boxGeometry args={[0.28, 6.2, 0.28]} />
              <meshStandardMaterial color="#4a5058" metalness={0.6} roughness={0.45} />
            </mesh>
            <mesh position={[0, 4.5, 0]}>
              <boxGeometry args={[x > 0 ? -x * 0.3 : 0.3, 0.18, 8]} />
              <meshStandardMaterial color="#3e444c" metalness={0.55} roughness={0.5} />
            </mesh>
          </group>
        )),
      )}
      <mesh position={[0, 4.8, -8]} receiveShadow>
        <boxGeometry args={[22, 8, 0.4]} />
        <meshStandardMaterial color="#2a3038" roughness={0.9} />
      </mesh>
    </group>
  );
}
