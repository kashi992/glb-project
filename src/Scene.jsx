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
        backgroundPosition:   "center",
        transition: "transform 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.  style.background = "rgba(0,0,0,0.5)"
        }}
      />
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
        right: 0,
        width: "calc(100vw - 350px)",
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
          fontSize:   "24px",
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

      <video
        src={videoUrl}
        controls
        autoPlay
        style={{
          maxWidth: "80%",
          maxHeight: "80%",
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
    D: {
      thumbnail: "/thumbnails/thumb1.jpg",
      video: "/videos/video2.mp4"
    },
    E: {
      thumbnail:   "/thumbnails/thumb1.jpg",
      video: "/videos/video2.mp4"
    },
  }

  return (
    <div
      style={{
        position: "fixed",
        top:   0,
        left: 0,
        width: "350px",
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
          fontSize: "20px",
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

      <h2 style={{
        marginTop: 0,
        marginBottom: "10px",
        fontSize: "28px",
        fontWeight: "700",
        paddingRight: "30px",
      }}>
        UGL Projects Where this system has been used:   
        <span style={{ display: "none" }}>{hotspot.label}</span>
      </h2>

      <div style={{
        width: "60px",
        height: "4px",
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
        marginBottom: "25px",
        borderRadius: "2px"
      }}></div>

      <div style={{ fontSize: "15px", lineHeight: "1.7" }}>
        <div style={{ marginBottom: "25px", display: 'none' }}>
          <h3 style={{
            fontSize: "18px",
            marginBottom: "12px",
            color: "#60a5fa"
          }}>
            Overview
          </h3>
          <p style={{ margin: 0, color: "#cbd5e1" }}>
            {hotspot.id === "A" && "Advanced data management and control systems for monitoring industrial operations in real-time.  "}
            {hotspot. id === "B" && "Critical pipeline infrastructure responsible for fluid transportation across the facility.  "}
            {hotspot. id === "C" && "Large-scale storage tanks for material containment and distribution management. "}
          </p>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h3 style={{
            fontSize: "18px",
            marginBottom: "12px",
            color: "#60a5fa",
            display: 'none'
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
            {hotspot.  id === "C" && (
              <>
                <li>Cross River Rail</li>
                <li>Sydney Metro</li>
                <li>Transmission Line West</li>
              </>
            )}
            {hotspot.id === "D" && (
              <>
                <li>Cross River Rail</li>
                <li>Sydney Metro</li>
                <li>Transmission Line West</li>
              </>
            )}
            {hotspot.id === "E" && (
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
            fontSize: "18px",
            marginBottom: "12px",
            color: "#60a5fa"
          }}>
            CASE STUDY
          </h3>
          <VideoThumbnail
            thumbnailUrl={videoData[hotspot. id]?.thumbnail}
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
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onClick?.  ()
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>

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
            e.  stopPropagation()
            onClick?.()
          }}
          style={{
            color: "#000",
            padding: "20px 30px",
            borderRadius: "12px",
            fontSize: "90px",
            fontWeight: "700",
            whiteSpace: "nowrap",
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            boxShadow: "0 1rem 3rem rgba(255,255,255,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.  style.transform = "scale(1.15)"
          }}
          onMouseLeave={(e) => {
            e.  currentTarget. style.transform = "scale(1)"
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

  const maxDimRef = useRef(1)
  
  const savedCameraPos = useRef(new THREE.Vector3())
  const savedCameraTarget = useRef(new THREE.Vector3())

  const startPos = useRef(new THREE.Vector3())
  const endPos = useRef(new THREE.  Vector3())
  const startTarget = useRef(new THREE.Vector3())
  const endTarget = useRef(new THREE.Vector3())
  
  const isAnimating = useRef(false)
  const animProgress = useRef(0)
  const isReturning = useRef(false)
  
  const pendingHotspotData = useRef(null)

  const hotspots = useMemo(
    () => [
      { id: "A", label: "Data Systems", pos: [2.36, -1.90, 21.35] },
      { id: "B", label: "Energy", pos: [9.05, 2.77, 7.90] },
      { id: "C", label: "Mechanical", pos: [14.25, 1.68, -2.77] },
      { id: "D", label: "Electrical", pos: [-14.06, -0.37, -0.24] },
      { id: "E", label: "Control Center", pos: [-2.61, 2.65, -14.41] },
    ],
    []
  )

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    maxDimRef.current = maxDim

    scene.position.sub(center)

    const fov = camera.fov * (Math.PI / 180)
    const distance = maxDim / (2 * Math.tan(fov / 2))

    camera.near = maxDim / 100
    camera.far = maxDim * 100
    
    // YOUR EXACT DESIRED CAMERA POSITION!  
    camera.position.set(2.39, 26.69, 63.85)
    
    // Look at center
    const lookAtPoint = new THREE.Vector3(0, 0, 0)
    camera.lookAt(lookAtPoint)
    camera.updateProjectionMatrix()

    // Calculate the polar angle from YOUR position (67.33°)
    const currentPolarAngle = Math.atan2(
      Math.sqrt(camera.position.x * camera.position.x + camera. position.z * camera.position. z),
      camera.position. y
    )

    if (controls.current) {
      controls.current.target.copy(lookAtPoint)
      
      // LOCKED TO YOUR DESIRED ANGLE - X-axis rotation only
      controls.current.minPolarAngle = currentPolarAngle
      controls.current.maxPolarAngle = currentPolarAngle
      
      controls.current.update()
    }

    console.log("✅ CAMERA LOCKED TO YOUR DESIRED POSITION:")
    console.log("  Position: { x: 2.39, y: 26.69, z: 63.85 }")
    console.log("  Target: { x: 0.00, y: 0.00, z: 0.00 }")
    console.log("  Distance: 69.25")
    console.log("  Tilt angle: 67.33°")
    console.log("  🔒 Zoom:  DISABLED")
    console.log("  🔒 Vertical rotation: LOCKED")
    console.log("  ✅ Horizontal rotation: ENABLED")
    
  }, [scene, camera])

  useFrame(() => {
    if (!  isAnimating.current) return

    const speed = 0.008
    animProgress.current = Math.min(animProgress.current + speed, 1)

    const smoothstep = (t) => {
      return t * t * (3 - 2 * t)
    }

    const t = smoothstep(animProgress.  current)

    camera.position.lerpVectors(startPos.current, endPos.current, t)
    
    if (controls.current) {
      controls.current.target.lerpVectors(startTarget.current, endTarget.current, t)
      controls.current.update()
    }

    if (animProgress.current >= 1) {
      isAnimating.current = false
      animProgress.current = 0

      if (isReturning. current) {
        isReturning.current = false
        
        setTimeout(() => {
          if (controls.current) {
            controls.  current.enabled = true
            
            // Restore the locked angle when returning
            const returnPolarAngle = Math.atan2(
              Math.sqrt(savedCameraPos.current.x * savedCameraPos.current.x + savedCameraPos.current. z * savedCameraPos.current.z),
              savedCameraPos.current.y
            )
            controls.current.  minPolarAngle = returnPolarAngle
            controls.current. maxPolarAngle = returnPolarAngle
          }
        }, 16)
      } else {
        if (pendingHotspotData.current) {
          onHotspotClick(pendingHotspotData.current)
          pendingHotspotData.current = null
        }
        
        if (controls.current) {
          controls.current.enabled = true
          controls.current.minPolarAngle = Math.PI / 6
          controls.current.maxPolarAngle = Math.PI / 2.2
        }
      }
    }
  })

  const flyToHotspot = (hotspotLocal, hotspotData) => {
    savedCameraPos.current.  copy(camera.position)
    savedCameraTarget.current.copy(controls.current?. target || new THREE.  Vector3(0, 0, 0))

    const maxDim = maxDimRef.current
    const target = new THREE.Vector3(...  hotspotLocal)
    const zoomDistance = Math.max(maxDim * 0.3, 0.5)

    const dirFromTarget = new THREE.Vector3(
      camera.position.x - target.x,
      0,
      camera.position.z - target.z
    ).normalize()

    const finalPos = target.clone().add(dirFromTarget.multiplyScalar(zoomDistance))
    finalPos.y = target.y + maxDim * 0.15

    startPos.current.copy(camera. position)
    endPos.current.copy(finalPos)
    startTarget.current.copy(controls.current?.target || new THREE. Vector3(0, 0, 0))
    endTarget.current.copy(target)

    animProgress.current = 0
    isAnimating.current = true
    isReturning.current = false

    pendingHotspotData.current = hotspotData

    if (controls.current) {
      controls.current.minPolarAngle = 0
      controls.current.maxPolarAngle = Math.PI
      controls.current.enabled = false
    }
  }

  const returnToSavedPosition = () => {
    startPos.current.copy(camera.  position)
    endPos.current.copy(savedCameraPos.  current)
    startTarget.current.copy(controls.current?.target || new THREE.Vector3(0, 0, 0))
    endTarget.current.copy(savedCameraTarget. current)

    animProgress.current = 0
    isAnimating.current = true
    isReturning.current = true

    if (controls.current) {
      controls.current.enabled = false
    }
  }

  useLayoutEffect(() => {
    if (onReturnToInitial) {
      onReturnToInitial.  current = returnToSavedPosition
    }
  }, [onReturnToInitial])

  return (
    <>
      <primitive object={scene} />

      {hotspots.map((h) => (
        <Hotspot
          key={h.id}
          label={h.label}
          position={h.pos}
          onClick={() => flyToHotspot(h.pos, h)}
          isHidden={activeHotspot !== null}
        />
      ))}

      <OrbitControls
        ref={controls}
        enableZoom={false}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        makeDefault
      />
    </>
  )
}

export default function Scene() {
  const [activeHotspot, setActiveHotspot] = useState(null)
  const returnToInitialRef = useRef(null)

  const handleCloseSidebar = () => {
    setActiveHotspot(null)
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