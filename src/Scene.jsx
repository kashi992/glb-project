import * as THREE from "three"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html } from "@react-three/drei"
import { useLayoutEffect, useMemo, useRef, useState } from "react"

function VideoThumbnail({ thumbnailUrl, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        height: "180px",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
        backgroundImage: `url(${thumbnailUrl})`,
        backgroundSize: "cover",
        backgroundPosition:  "center",
        transition: "transform 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.5)"
        }}
      />

      {/* Play Button */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(59, 130, 246, 0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "18px solid white",
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            marginLeft: "4px",
          }}
        />
      </div>
    </div>
  )
}
function VideoModal({ videoUrl, onClose }) {
  if (!videoUrl) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "30px",
          right: "30px",
          background: "rgba(255,255,255,0.2)",
          border: "2px solid rgba(255,255,255,0.3)",
          color: "#fff",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize:  "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
          zIndex: 2001,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255,255,255,0.3)"
          e.target.style.transform = "scale(1.1)"
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255,255,255,0.2)"
          e.target.style.transform = "scale(1)"
        }}
      >
        ✕
      </button>

      {/* Video Player */}
      <video
        src={videoUrl}
        controls
        autoPlay
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: "8px",
          boxShadow: "0 10px 50px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

function Sidebar({ hotspot, onClose }) {
  const [videoUrl, setVideoUrl] = useState(null)
  if (!hotspot) return null

   // Video data for each hotspot
  const videoData = {
    A: { 
      thumbnail: "/thumbnails/thumb1.jpg", 
      video: "/videos/video2.mp4" 
    },
    B: { 
  thumbnail: "/thumbnails/thumb1.jpg", 
      video: "/videos/video2.mp4" 
    },
    C: { 
     thumbnail: "/thumbnails/thumb1.jpg", 
      video: "/videos/video2.mp4" 
    },
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left:  0,
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
        fontWeight: "700",
        paddingRight: "30px",
      }}>
        UGL Projects Where this system has been used:
        <span style={{display:"none"}}>{hotspot.label}</span>
      </h2>

      <div style={{
        width: "60px",
        height: "4px",
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
        marginBottom: "25px",
        borderRadius: "2px"
      }}></div>

      <div style={{ fontSize: "15px", lineHeight: "1.7" }}>
        <div style={{ marginBottom: "25px",display:'none' }}>
          <h3 style={{ 
            fontSize: "18px", 
            marginBottom: "12px",
            color: "#60a5fa"
          }}>
            Overview
          </h3>
          <p style={{ margin: 0, color: "#cbd5e1" }}>
            {hotspot.id === "A" && "Advanced data management and control systems for monitoring industrial operations in real-time. "}
            {hotspot.id === "B" && "Critical pipeline infrastructure responsible for fluid transportation across the facility."}
            {hotspot. id === "C" && "Large-scale storage tanks for material containment and distribution management."}
          </p>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ 
            fontSize:  "18px", 
            marginBottom: "12px",
            color: "#60a5fa",
            display:'none'
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
                <li>Cross River Rail</li>
                <li>Sydney Metro</li>
                <li>Transmission Line West</li>
              </>
            )}
            {hotspot.id === "B" && (
              <>
             <li>Cross River Rail</li>
                <li>Sydney Metro</li>
                <li>Transmission Line West</li>
              </>
            )}
            {hotspot.id === "C" && (
              <>
            <li>Cross River Rail</li>
                <li>Sydney Metro</li>
                <li>Transmission Line West</li>
              </>
            )}
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ 
            fontSize:  "18px", 
            marginBottom: "12px",
            color: "#60a5fa"
          }}>
            CASE STUDY
          </h3>
          {/* <div style={{ 
            display: "flex", 
            gap: "10px",
            flexWrap: "wrap"
          }}>
           Thumb of a video with a play Button. Onclick the play icon button open a modal to play the video in the whole screen.
          </div> */}
           <VideoThumbnail
            thumbnailUrl={videoData[hotspot.id]?.thumbnail}
            onClick={() => setVideoUrl(videoData[hotspot.id]?.video)}
          />
        </div>
      </div>
      <VideoModal 
        videoUrl={videoUrl} 
        onClose={() => setVideoUrl(null)} 
      />
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
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>

      {/* label text - MUCH BIGGER */}
      <Html
        center
        distanceFactor={3.5}
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
            padding:  "30px",
            borderRadius: "12px",
            fontSize: "90px",
            fontWeight: "700",
            whiteSpace: "nowrap",
            cursor: "pointer",
            userSelect: "none",
            border: "2px solid rgba(255,255,255,0.4)",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.15)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style. transform = "scale(1)"
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

function ModelWithHotspots({ activeHotspot, onHotspotClick, onReturnToInitial }) {
  const controls = useRef()
  const { camera } = useThree()
  const { scene } = useGLTF("/model.glb")

  // Store model scale info
  const maxDimRef = useRef(1)
  const initialCameraPos = useRef(new THREE.Vector3())
  const initialCameraTarget = useRef(new THREE.Vector3())

  // Animation state
  const startLookAt = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const cameraCurve = useRef(null)
  const isFlying = useRef(false)
  const flyProgress = useRef(0)
  const pendingHotspot = useRef(null)
  const isReturningHome = useRef(false)

  // Put hotspot points in MODEL LOCAL SPACE
  const hotspots = useMemo(
    () => [
      { id: "A", label: "Data Systems", pos: [-5, 0.5, -15] },
      { id: "B", label: "Pipe Section", pos: [-5, 0.15, 0.25] },
      { id: "C", label: "Tank Area", pos: [10, 0.4, -0.2] },
    ],
    []
  )

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size. x, size.y, size. z)
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

    // Store initial camera position
    initialCameraPos.current. copy(camera.position)
    initialCameraTarget.current.set(0, 0, 0)

    if (controls.current) {
      controls.current.target.set(0, 0, 0)
      controls.current.update()
    }
  }, [scene, camera])

  // SMOOTH DRONE ANIMATION
  useFrame(() => {
    if (!isFlying.current || !cameraCurve.current) return

    // Animation speed
    const speed = isReturningHome.current ? 0.006 : 0.004
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
    if (flyProgress.current >= 1) {
      isFlying.current = false
      flyProgress.current = 0
      
      if (isReturningHome.current) {
        // Finished returning home
        isReturningHome.current = false
        if (controls.current) {
          controls. current.enabled = true
          // Lock back to horizontal rotation
          controls.current.minPolarAngle = Math.PI / 2
          controls.current.maxPolarAngle = Math.PI / 2
        }
      } else {
        // Finished flying to hotspot
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
    }
  })

  const flyToHotspot = (hotspotLocal, hotspotData) => {
    const maxDim = maxDimRef. current

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
    const p2 = new THREE. Vector3(towardTarget.x, p0.y + maxDim * 0.7, towardTarget.z)
    const nearTarget = new THREE.Vector3().lerpVectors(p0, target, 0.6)
    const p3 = new THREE.Vector3(nearTarget.x, Math.max(p0.y, target.y) + maxDim * 0.7, nearTarget.z)
    const p4 = new THREE.Vector3(target.x, target.y + maxDim * 0.4, target.z)
    const p5 = finalPos. clone()

    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4, p5], false, 'catmullrom', 0.2)

    cameraCurve.current = curve
    startLookAt.current.copy(controls.current?. target || new THREE.Vector3(0, 0, 0))
    targetLookAt.current.copy(target)
    pendingHotspot.current = hotspotData
    
    flyProgress.current = 0
    isFlying.current = true
    isReturningHome.current = false

    if (controls.current) {
      controls.current.minPolarAngle = 0
      controls.current.maxPolarAngle = Math.PI
      controls.current.enabled = false
    }
  }

  const returnToInitial = () => {
    const maxDim = maxDimRef.current

    // Current position
    const p0 = camera.position.clone()
    
    // Go up from current position
    const p1 = new THREE.Vector3(p0.x, p0.y + maxDim * 0.5, p0.z)
    
    // High point moving toward center
    const towardCenter = new THREE.Vector3().lerpVectors(p0, initialCameraTarget.current, 0.5)
    const p2 = new THREE.Vector3(towardCenter.x, p1.y, towardCenter.z)
    
    // Above initial position
    const p3 = new THREE.Vector3(
      initialCameraPos.current.x,
      initialCameraPos.current.y + maxDim * 0.3,
      initialCameraPos.current.z
    )
    
    // Final initial position
    const p4 = initialCameraPos.current.clone()

    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4], false, 'catmullrom', 0.2)

    cameraCurve.current = curve
    startLookAt. current.copy(controls.current?. target || new THREE.Vector3(0, 0, 0))
    targetLookAt.current.copy(initialCameraTarget. current)
    
    flyProgress.current = 0
    isFlying.current = true
    isReturningHome.current = true

    if (controls. current) {
      controls.current.enabled = false
    }
  }

  // Expose returnToInitial to parent
  useLayoutEffect(() => {
    if (onReturnToInitial) {
      onReturnToInitial. current = returnToInitial
    }
  }, [onReturnToInitial])

  return (
    <>
      <primitive object={scene} />

      {/* Hotspots - HIDE ALL when any is active */}
      {hotspots.map((h) => (
        <Hotspot
          key={h.id}
          label={h.label}
          position={h.pos}
          onClick={() => flyToHotspot(h. pos, h)}
          isHidden={activeHotspot !== null}
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
  const returnToInitialRef = useRef(null)

  const handleCloseSidebar = () => {
    setActiveHotspot(null)
    // Trigger return to initial position
    if (returnToInitialRef.current) {
      returnToInitialRef.current()
    }
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
          onReturnToInitial={returnToInitialRef}
        />
      </Canvas>
      
      <Sidebar 
        hotspot={activeHotspot} 
        onClose={handleCloseSidebar} 
      />
    </div>
  )
}