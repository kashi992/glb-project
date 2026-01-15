// src/Hotspot.jsx
export default function Hotspot({ position = [0, 0, 0], onClick }) {
  return (
    <mesh position={position} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
      <sphereGeometry args={[0.06, 24, 24]} />
      <meshStandardMaterial emissiveIntensity={2} emissive="orange" color="white" />
    </mesh>
  )
}
