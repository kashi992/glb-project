// src/DraggableX.jsx
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

export default function DraggableX({ children }) {
  const { gl } = useThree()
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startModelX = useRef(0)

  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = (e) => {
      isDragging.current = true
      startX.current = e.clientX
      startModelX.current = children.props.position.x // Assumes you pass position via props
    }

    const handleMouseMove = (e) => {
      if (!isDragging.current) return

      const deltaX = e.clientX - startX.current
      const scale = 0.05 // Adjust sensitivity (smaller = slower drag)

      // Update only X position
      children.props.position.x = startModelX.current + deltaX * scale

      // Trigger re-render (if needed)
      if (children.ref && children.ref.current) {
        children.ref.current.position.x = children.props.position.x
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }, [gl, children])

  return children
}