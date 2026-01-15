// src/ClickablePoint.jsx
import { useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

export default function ClickablePoint({ name, label, position, onPointClick }) {
  const { camera } = useThree()
  const [isVisible, setIsVisible] = useState(true)
  const pointRef = useRef(new THREE.Vector3())

  // Update visibility based on camera angle
  useEffect(() => {
    if (!camera) return

    const updateVisibility = () => {
      pointRef.current.set(...position)

      const camToPnt = pointRef.current.clone().sub(camera.position).normalize()
      const camForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
      const dot = camForward.dot(camToPnt)

      setIsVisible(dot > -0.2) // Show if facing camera
    }

    updateVisibility()
  }, [camera, position])

  if (!isVisible) return null

  return (
    <group position={position}>
      {/* Invisible sphere for reliable click detection */}
      <mesh onPointerDown={(e) => {
        e.stopPropagation()
        onPointClick(name)
      }}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visible 3D text label */}
      <Text
        color="white"
        fontSize={0.2}
        anchorX="center"
        anchorY="middle"
        maxWidth={1}
        textAlign="center"
        material-toneMapped={false}
      >
        {label || name}
      </Text>
    </group>
  )
}