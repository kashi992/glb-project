// src/CameraRig.jsx
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useEffect } from "react"
import * as THREE from "three"

export default function CameraRig({ focus }) {
  const { camera } = useThree()

  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())

  useEffect(() => {
    // default camera view
    if (!focus) {
      targetPos.current.set(0, 1.2, 6)
      targetLook.current.set(0, 0.8, 0)
      return
    }

    // focus view (move camera near hotspot + look at it)
    targetPos.current.fromArray(focus.camPos)
    targetLook.current.fromArray(focus.lookAt)
  }, [focus])

  useFrame((_, delta) => {
    const t = 1 - Math.exp(-6 * delta) // smooth speed

    camera.position.lerp(targetPos.current, t)

    const lookNow = new THREE.Vector3()
    camera.getWorldDirection(lookNow) // not used, just placeholder
    camera.lookAt(targetLook.current)

    camera.updateProjectionMatrix()
  })

  return null
}
