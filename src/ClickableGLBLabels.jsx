import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function ClickableGLBLabels({ onLabelClick }) {
  const { scene } = useGLTF("/model-2.glb")
  const { raycaster, mouse, camera, gl } = useThree()
  const modelRef = useRef()

  useEffect(() => {
    if (!scene) return

    // Find all text meshes in the GLB file
    const textMeshes = []
    
    scene.traverse((child) => {
      // Look for meshes that might be text labels
      // You may need to adjust this based on your GLB structure
      if (child.isMesh && (
        child.name.toLowerCase().includes('text') ||
        child.name.toLowerCase().includes('label') ||
        child.material?.name?.toLowerCase().includes('text') ||
        child.geometry?.type === 'TextGeometry'
      )) {
        textMeshes.push(child)
      }
    })

    console.log('Found text meshes:', textMeshes.map(m => m.name))

    // Make text meshes clickable
    textMeshes.forEach((mesh) => {
      mesh.userData.clickable = true
      mesh.userData.labelName = mesh.name
    })

    // Add click handler
    const handleClick = (event) => {
      const rect = gl.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(textMeshes)

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object
        if (clickedMesh.userData.clickable) {
          onLabelClick?.(clickedMesh.userData.labelName, clickedMesh)
        }
      }
    }

    gl.domElement.addEventListener('click', handleClick)

    return () => {
      gl.domElement.removeEventListener('click', handleClick)
    }
  }, [scene, raycaster, mouse, camera, gl, onLabelClick])

  return <primitive ref={modelRef} object={scene} />
}