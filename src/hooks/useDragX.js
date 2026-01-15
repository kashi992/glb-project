// src/hooks/useDragX.js
import { useState, useEffect, useRef } from 'react'

export function useDragX(initialX = 0) {
  const [x, setX] = useState(initialX)
  const isDragging = useRef(false)
  const startXRef = useRef(0)
  const startValueRef = useRef(0)

  useEffect(() => {
    const handleMouseDown = (e) => {
      isDragging.current = true
      startXRef.current = e.clientX
      startValueRef.current = x
    }

    const handleMouseMove = (e) => {
      if (!isDragging.current) return

      const deltaX = e.clientX - startXRef.current
      const sensitivity = 0.05 // Adjust this to control drag speed
      setX(startValueRef.current + deltaX * sensitivity)
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [x])

  return [x, setX]
}