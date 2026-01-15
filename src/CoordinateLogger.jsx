// src/CoordinateLogger.jsx
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

export default function CoordinateLogger() {
  const { camera, scene, gl } = useThree() // ✅ Get scene directly

  useEffect(() => {
    if (!scene || !camera || !gl) return // ✅ Safety check

    const handlePointerMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera({ x, y }, camera)

      // ✅ Use scene from useThree (more reliable)
      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        const point = intersects[0].point
        if (!window.lastLoggedPoint || point.distanceTo(window.lastLoggedPoint) > 0.1) {
          console.log('World position:', [
            parseFloat(point.x.toFixed(3)),
            parseFloat(point.y.toFixed(3)),
            parseFloat(point.z.toFixed(3))
          ])
          window.lastLoggedPoint = point.clone()
        }
      }
    }

    const canvas = gl.domElement
    canvas.addEventListener('pointermove', handlePointerMove)

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove)
      delete window.lastLoggedPoint
    }
  }, [camera, scene, gl]) // ✅ Depend on scene, camera, gl

  return null
}