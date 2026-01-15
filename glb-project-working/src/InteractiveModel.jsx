// src/InteractiveModel.jsx
import { useGLTF } from "@react-three/drei"
import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"

export default function InteractiveModel() {
  const { scene } = useGLTF("/model.glb")

  const groupRef = useRef()

  const [dragging, setDragging] = useState(false)
  const lastX = useRef(0)

  // smooth motion state
  const velocity = useRef(0) // rotation speed
  const target = useRef(0)   // target rotation Y

  const { size } = useThree()

  const startDrag = (e) => {
    e.stopPropagation()
    setDragging(true)
    lastX.current = e.clientX
    e.target.setPointerCapture?.(e.pointerId)
  }

  const endDrag = (e) => {
    e.stopPropagation()
    setDragging(false)
    e.target.releasePointerCapture?.(e.pointerId)
  }

  const moveDrag = (e) => {
    if (!dragging || e.buttons !== 1) return
    e.stopPropagation()

    const dx = e.clientX - lastX.current
    lastX.current = e.clientX

    // convert drag distance to rotation delta
    const deltaRot = (dx / size.width) * Math.PI * 2

    // set velocity instead of snapping target
    velocity.current = deltaRot * 18 // sensitivity (increase/decrease)
  }

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // if not dragging, naturally slow down rotation (smooth transition)
    const friction = dragging ? 0.6 : 0.92
    velocity.current *= Math.pow(friction, delta * 60)

    // apply velocity to target, then smooth towards it
    target.current += velocity.current

    const current = groupRef.current.rotation.y
    const smooth = 1 - Math.exp(-1 * delta) // smoothness (lower=more floaty)
    groupRef.current.rotation.y = current + (target.current - current) * smooth

    // lock other axes
    groupRef.current.rotation.x = 0
    groupRef.current.rotation.z = 0
  })

  return (
    <group
      ref={groupRef}
      scale={10}
      onPointerDown={startDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onPointerMove={moveDrag}
    >
      <primitive object={scene} />
    </group>
  )
}
