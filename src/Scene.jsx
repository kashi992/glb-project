import * as THREE from "three"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html } from "@react-three/drei"
import { useLayoutEffect, useMemo, useRef } from "react"

function Hotspot({ label, position, onClick }) {
  return (
    <group position={position}>
      {/* click target */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onClick?. ()
        }}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial />
      </mesh>

      {/* label text */}
      <Html
        center
        distanceFactor={8}
        transform
        sprite
        style={{
          transition:  'opacity 0.2s',
          pointerEvents: 'auto'
        }}
      >
        <div
          onClick={(e) => {
            e. stopPropagation()
            onClick?.()
          }}
          style={{
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            whiteSpace: "nowrap",
            cursor: "pointer",
            userSelect: "none",
            boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

function ModelWithHotspots() {
  const controls = useRef()
  const { camera } = useThree()
  const { scene } = useGLTF("/model.glb")

  // Store model scale info
  const maxDimRef = useRef(1)

  // Animation state
  const startLookAt = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const cameraCurve = useRef(null)
  const isFlying = useRef(false)
  const flyProgress = useRef(0)

  // Put hotspot points in MODEL LOCAL SPACE
  const hotspots = useMemo(
    () => [
      { id: "A", label: "Data Systems", pos: [-15, 10, -15] },
      { id:  "B", label: "Pipe Section", pos: [-5, 0.15, 0.25] },
      { id: "C", label: "Tank Area", pos: [10, 0.4, -0.2] },
    ],
    []
  )

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    maxDimRef.current = maxDim

    // center model
    scene.position. sub(center)

    // camera distance based on FOV
    const fov = camera.fov * (Math.PI / 180)
    const distance = maxDim / (2 * Math.tan(fov / 2))

    camera.near = maxDim / 100
    camera.far = maxDim * 100
    camera. position.set(0, maxDim * 0.2, distance * 0.5)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    if (controls.current) {
      controls.current.target.set(0, 0, 0)
      controls.current.update()
    }
  }, [scene, camera])

  // SMOOTH DRONE ANIMATION
  useFrame(() => {
    if (!isFlying.current || !cameraCurve.current) return

    // Animation speed
    const speed = 0.004
    flyProgress.current = Math. min(flyProgress.current + speed, 1)

    // Smooth easing
    const easeInOutCubic = (t) => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    
    const t = easeInOutCubic(flyProgress.current)

    // Get position along the smooth curve
    const camPos = cameraCurve.current.getPoint(t)
    camera.position.copy(camPos)
    
    // Smoothly interpolate look-at target
    const lookAt = new THREE.Vector3()
    lookAt.lerpVectors(startLookAt.current, targetLookAt.current, t)
    
    // Update controls target smoothly
    controls. current?.target.copy(lookAt)
    controls.current?.update()

    // Stop when complete
    if (flyProgress.current >= 1) {
      isFlying.current = false
      flyProgress.current = 0
      if (controls. current) {
        controls.current.enabled = true
        // Keep rotation unlocked after animation
        controls.current.minPolarAngle = Math.PI / 6
        controls.current.maxPolarAngle = Math.PI / 2.2
      }
    }
  })

  const flyToHotspot = (hotspotLocal) => {
    const maxDim = maxDimRef.current

    // Target position (look-at point)
    const target = new THREE.Vector3(... hotspotLocal)

    // Calculate final camera position near target
    const zoomDistance = Math.max(maxDim * 0.3, 0.5)
    
    // Direction from target toward camera (in XZ plane)
    const dirFromTarget = new THREE.Vector3(
      camera.position.x - target.x,
      0,
      camera.position.z - target.z
    ).normalize()
    
    const finalPos = target.clone().add(dirFromTarget.multiplyScalar(zoomDistance))
    finalPos.y = target.y + maxDim * 0.15

    // CREATE DRONE CURVE - NO BACKWARD MOTION!
    
    // Point 0: Current camera position
    const p0 = camera.position.clone()
    
    // Point 1: Go STRAIGHT UP from current position (no horizontal movement)
    const p1 = new THREE.Vector3(
      p0.x,
      p0.y + maxDim * 0.4,
      p0.z
    )
    
    // Point 2: Continue UP while moving TOWARD target (25% of the way)
    const towardTarget = new THREE.Vector3().lerpVectors(p0, target, 0.25)
    const p2 = new THREE.Vector3(
      towardTarget.x,
      p0.y + maxDim * 0.7, // Higher
      towardTarget.z
    )
    
    // Point 3: High point, 60% toward target
    const nearTarget = new THREE.Vector3().lerpVectors(p0, target, 0.6)
    const p3 = new THREE.Vector3(
      nearTarget.x,
      Math.max(p0.y, target.y) + maxDim * 0.7, // Stay high
      nearTarget.z
    )
    
    // Point 4: Right above target, ready to descend
    const p4 = new THREE.Vector3(
      target.x,
      target.y + maxDim * 0.4,
      target.z
    )
    
    // Point 5: Final position
    const p5 = finalPos.clone()

    // Create smooth curve - always moving forward! 
    const curve = new THREE. CatmullRomCurve3([
      p0, // Start
      p1, // Up
      p2, // Up + toward target
      p3, // High + more toward target
      p4, // Above target
      p5  // Final
    ], false, 'catmullrom', 0.2)

    cameraCurve.current = curve
    
    // Store look-at points
    startLookAt.current.copy(controls.current?.target || new THREE.Vector3(0, 0, 0))
    targetLookAt.current.copy(target)
    
    // Start animation
    flyProgress.current = 0
    isFlying.current = true

    // Unlock rotation and disable controls during flight
    if (controls.current) {
      controls.current.minPolarAngle = 0
      controls.current.maxPolarAngle = Math.PI
      controls.current.enabled = false
    }
  }

  return (
    <>
      <primitive object={scene} />

      {/* Hotspots */}
      {hotspots.map((h) => (
        <Hotspot
          key={h.id}
          label={h.label}
          position={h.pos}
          onClick={() => flyToHotspot(h.pos)}
        />
      ))}

      <OrbitControls
        ref={controls}
        enableZoom={false}
        enablePan={false}
        // LOCKED to horizontal (X-axis) rotation initially
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

export default function Scene() {
  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onWheel={(e) => e.preventDefault()}
    >
      <Canvas camera={{ position: [0, 1, 3], fov: 45 }}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 5, 5]} intensity={1.0} />
        <ModelWithHotspots />
      </Canvas>
    </div>
  )
}