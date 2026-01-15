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
          onClick?.()
        }}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial />
      </mesh>

      {/* label text */}
      <Html center distanceFactor={10}>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          style={{
            background: "rgba(0,0,0,0.65)",
            color: "#fff",
            padding: "30px",
            borderRadius: "8px",
            fontSize: "60px",
            whiteSpace: "nowrap",
            cursor: "pointer",
            userSelect: "none",
            display: "none",
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
  const { scene } = useGLTF("/model-2.glb") // <-- change path if needed

  // Store model scale info
  const maxDimRef = useRef(1)

  // Smooth fly-to state
  const targetPos = useRef(new THREE.Vector3())
  const camGoalPos = useRef(new THREE.Vector3())
  const isFlying = useRef(false)

  // Put hotspot points in MODEL LOCAL SPACE (after centering)
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

  // Smooth camera animation (lerp)
  useFrame(() => {
    if (!isFlying.current) return

    // smoothness: smaller = slower, bigger = faster
    const t = 0.10

    camera.position.lerp(camGoalPos.current, t)
    controls.current?.target.lerp(targetPos.current, t)
    controls.current?.update()

    // stop when close enough
    if (
      camera.position.distanceTo(camGoalPos.current) < 0.01 &&
      controls.current?.target.distanceTo(targetPos.current) < 0.01
    ) {
      isFlying.current = false
    }
  })

  const flyToHotspot = (hotspotLocal) => {
    const maxDim = maxDimRef.current

    // Hotspot world position (since scene is centered, this matches well)
    const target = new THREE.Vector3(...hotspotLocal)

    // Move camera closer to target ("go inside" feeling)
    // We keep y fixed by using OrbitControls polar lock; camera can still be positioned slightly above
    const zoomDistance = Math.max(maxDim * 0.18, 0.3) // closer = more “inside”
    const currentDir = camera.position.clone().sub(target).normalize()

    // Goal camera position = near target, along current view direction
    const goalCam = target.clone().add(currentDir.multiplyScalar(zoomDistance))
    goalCam.y = Math.max(goalCam.y, maxDim * 0.08) // prevent going under floor

    targetPos.current.copy(target)
    camGoalPos.current.copy(goalCam)
    isFlying.current = true
  }


  return (
    <>
      <primitive object={scene} />

      {/* Hotspots are children of the same "world" as the model, so they stick */}
      {hotspots.map((h) => (
        // <mesh key={h.id} position={h.pos}>
        //   <sphereGeometry args={[0.03, 16, 16]} />
        //   <meshStandardMaterial />
        // </mesh>
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
        // lock vertical rotation:
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        // optional: smoother feel
        enableDamping
        dampingFactor={0.08}
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
