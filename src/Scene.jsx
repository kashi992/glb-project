import * as THREE from "three"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html } from "@react-three/drei"
import { useLayoutEffect, useMemo, useRef,React, useState } from "react"

function Sidebar({ hotspot, onClose }) {
  if (!hotspot) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "400px",
        height: "100vh",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
        padding: "30px",
        zIndex: 1000,
        color: "#fff",
        overflowY: "auto",
        animation: "slideIn 0.4s ease-out",
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          color: "#fff",
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize:  "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255,255,255,0.2)"
          e.target.style.transform = "scale(1.1)"
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255,255,255,0.1)"
          e.target.style.transform = "scale(1)"
        }}
      >
        ✕
      </button>

      {/* Content */}
      <h2 style={{ 
        marginTop: 0, 
        marginBottom: "10px",
        fontSize: "28px",
        fontWeight: "700"
      }}>
        {hotspot.label}
      </h2>

      <div style={{
        width: "60px",
        height: "4px",
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
        marginBottom: "25px",
        borderRadius: "2px"
      }}></div>

      <div style={{ fontSize: "15px", lineHeight: "1.7" }}>
        <section style={{ marginBottom: "25px" }}>
          <h3 style={{ 
            fontSize: "18px", 
            marginBottom: "12px",
            color: "#60a5fa"
          }}>
            Overview
          </h3>
          <p style={{ margin: 0, color: "#cbd5e1" }}>
            {hotspot.id === "A" && "Advanced data management and control systems for monitoring industrial operations in real-time."}
            {hotspot.id === "B" && "Critical pipeline infrastructure responsible for fluid transportation across the facility."}
            {hotspot.id === "C" && "Large-scale storage tanks for material containment and distribution management."}
          </p>
        </section>

        <section style={{ marginBottom: "25px" }}>
          <h3 style={{ 
            fontSize:  "18px", 
            marginBottom: "12px",
            color: "#60a5fa"
          }}>
            Specifications
          </h3>
          <ul style={{ 
            margin: 0, 
            paddingLeft: "20px",
            color: "#cbd5e1"
          }}>
            {hotspot.id === "A" && (
              <>
                <li>Control Units: 12 nodes</li>
                <li>Processing Speed: 2.4 GHz</li>
                <li>Network:  Redundant fiber</li>
                <li>Uptime: 99.9%</li>
              </>
            )}
            {hotspot.id === "B" && (
              <>
                <li>Diameter:  24 inches</li>
                <li>Material: Carbon steel</li>
                <li>Pressure: 150 PSI</li>
                <li>Flow Rate: 500 GPM</li>
              </>
            )}
            {hotspot.id === "C" && (
              <>
                <li>Capacity: 50,000 gallons</li>
                <li>Material: Stainless steel</li>
                <li>Temperature: -20°C to 80°C</li>
                <li>Safety: Auto pressure relief</li>
              </>
            )}
          </ul>
        </section>

        <section style={{ marginBottom: "25px" }}>
          <h3 style={{ 
            fontSize:  "18px", 
            marginBottom: "12px",
            color: "#60a5fa"
          }}>
            Status
          </h3>
          <div style={{ 
            display: "flex", 
            gap: "10px",
            flexWrap: "wrap"
          }}>
            <span style={{
              padding: "6px 14px",
              background: "rgba(34, 197, 94, 0.2)",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              borderRadius: "20px",
              fontSize: "13px",
              color: "#86efac"
            }}>
              ✓ Operational
            </span>
            <span style={{
              padding: "6px 14px",
              background:  "rgba(59, 130, 246, 0.2)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              borderRadius: "20px",
              fontSize:  "13px",
              color:  "#93c5fd"
            }}>
              ⚡ Active
            </span>
            <span style={{
              padding: "6px 14px",
              background: "rgba(168, 85, 247, 0.2)",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              borderRadius: "20px",
              fontSize:  "13px",
              color:  "#c4b5fd"
            }}>
              🔒 Secured
            </span>
          </div>
        </section>

        <section>
          <h3 style={{ 
            fontSize: "18px", 
            marginBottom: "12px",
            color: "#60a5fa"
          }}>
            Last Inspection
          </h3>
          <p style={{ margin: 0, color: "#cbd5e1" }}>
            January 10, 2026 - No issues detected
          </p>
        </section>
      </div>
    </div>
  )
}

function Hotspot({ label, position, onClick, isHidden }) {
  if (isHidden) return null

  return (
    <group position={position}>
      {/* click target */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onClick?. ()
        }}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* label text - BIGGER */}
      <Html
        center
        distanceFactor={5}
        transform
        sprite
        style={{
          transition: 'opacity 0.2s',
          pointerEvents: 'auto'
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          style={{
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(99, 102, 241, 0.95) 100%)",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "10px",
            fontSize: "20px",
            fontWeight: "700",
            whiteSpace: "nowrap",
            cursor: "pointer",
            userSelect: "none",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
            border: "2px solid rgba(255,255,255,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)"
            e.currentTarget. style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.6)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style. transform = "scale(1)"
            e.currentTarget.style. boxShadow = "0 4px 15px rgba(0,0,0,0.4)"
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

function ModelWithHotspots({ activeHotspot, onHotspotClick }) {
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
  const pendingHotspot = useRef(null)

  // Put hotspot points in MODEL LOCAL SPACE
  const hotspots = useMemo(
    () => [
      { id: "A", label: "Data Systems", pos: [-15, 10, -15] },
      { id: "B", label: "Pipe Section", pos: [-5, 0.15, 0.25] },
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
    scene.position.sub(center)

    // camera distance based on FOV
    const fov = camera.fov * (Math.PI / 180)
    const distance = maxDim / (2 * Math.tan(fov / 2))

    camera.near = maxDim / 100
    camera.far = maxDim * 100
    camera.position.set(0, maxDim * 0.2, distance * 0.5)
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
    flyProgress.current = Math.min(flyProgress.current + speed, 1)

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
    controls.current?. target.copy(lookAt)
    controls.current?.update()

    // Stop when complete
    if (flyProgress. current >= 1) {
      isFlying.current = false
      flyProgress.current = 0
      if (controls.current) {
        controls.current.enabled = true
        // Keep rotation unlocked after animation
        controls.current.minPolarAngle = Math.PI / 6
        controls.current.maxPolarAngle = Math.PI / 2.2
      }
      
      // Show sidebar when animation completes
      if (pendingHotspot.current) {
        onHotspotClick(pendingHotspot.current)
        pendingHotspot.current = null
      }
    }
  })

  const flyToHotspot = (hotspotLocal, hotspotData) => {
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

    // CREATE DRONE CURVE
    const p0 = camera.position. clone()
    const p1 = new THREE.Vector3(p0.x, p0.y + maxDim * 0.4, p0.z)
    const towardTarget = new THREE.Vector3().lerpVectors(p0, target, 0.25)
    const p2 = new THREE.Vector3(towardTarget.x, p0.y + maxDim * 0.7, towardTarget.z)
    const nearTarget = new THREE.Vector3().lerpVectors(p0, target, 0.6)
    const p3 = new THREE.Vector3(nearTarget.x, Math.max(p0.y, target.y) + maxDim * 0.7, nearTarget.z)
    const p4 = new THREE.Vector3(target.x, target.y + maxDim * 0.4, target.z)
    const p5 = finalPos.clone()

    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4, p5], false, 'catmullrom', 0.2)

    cameraCurve.current = curve
    startLookAt.current.copy(controls.current?.target || new THREE.Vector3(0, 0, 0))
    targetLookAt.current.copy(target)
    pendingHotspot.current = hotspotData
    
    flyProgress.current = 0
    isFlying.current = true

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
          onClick={() => flyToHotspot(h.pos, h)}
          isHidden={activeHotspot?.id === h. id}
        />
      ))}

      <OrbitControls
        ref={controls}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

export default function Scene() {
  const [activeHotspot, setActiveHotspot] = useState(null)

  const handleCloseSidebar = () => {
    setActiveHotspot(null)
  }

  return (
    <div
      style={{ width: "100vw", height: "100vh", position: "relative" }}
      onWheel={(e) => e.preventDefault()}
    >
      <Canvas camera={{ position: [0, 1, 3], fov: 45 }}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 5, 5]} intensity={1.0} />
        <ModelWithHotspots 
          onHotspotClick={setActiveHotspot} 
          activeHotspot={activeHotspot} 
        />
      </Canvas>
      
      <Sidebar 
        hotspot={activeHotspot} 
        onClose={handleCloseSidebar} 
      />
    </div>
  )
}