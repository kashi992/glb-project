// src/App.jsx
import { Canvas } from "@react-three/fiber"
import Scene from "./Scene"
import { useEffect } from "react"
import './App.css'

export default function App() {
  useEffect(() => {
    const onWheel = (e) => {
      // Trackpad pinch often comes as ctrl+wheel
      if (e.ctrlKey) e.preventDefault()
    }

    const prevent = (e) => e.preventDefault()

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("gesturestart", prevent, { passive: false })
    window.addEventListener("gesturechange", prevent, { passive: false })
    window.addEventListener("gestureend", prevent, { passive: false })

    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("gesturestart", prevent)
      window.removeEventListener("gesturechange", prevent)
      window.removeEventListener("gestureend", prevent)
    }
  }, [])
  return (
      <Scene />
  )
}
