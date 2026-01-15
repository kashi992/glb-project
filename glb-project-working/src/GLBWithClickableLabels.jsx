import React from 'react'
import { Html } from '@react-three/drei'

// Define the positions where your labels are located in the 3D model
const labelDefinitions = [
  {
    id: 'data_systems',
    name: 'Data Systems',
    position: [-8, 4, -5], // Approximate 3D position of the label
    screenOffset: [0, 0]    // Optional 2D offset from the 3D position
  },
  {
    id: 'energy',
    name: 'Energy',
    position: [0, 6, -3],
    screenOffset: [0, 0]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    position: [8, 5, -2],
    screenOffset: [0, 0]
  },
  {
    id: 'mechanical',
    name: 'Mechanical',
    position: [12, 8, 0],
    screenOffset: [0, 0]
  },
  {
    id: 'control_center',
    name: 'Control Center',
    position: [8, 7, 2],
    screenOffset: [0, 0]
  }
]

function ClickableLabel({ label, onLabelClick }) {
  return (
    <group position={label.position}>
      {/* Invisible clickable sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onLabelClick?.(label.id, label.name)
        }}
      >
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshBasicMaterial 
          transparent 
          opacity={0} 
          // Set to 0.1 for debugging to see the clickable areas
        />
      </mesh>

      {/* Optional: Visual indicator when hovering */}
      <Html
        center
        distanceFactor={10}
        transform
        occlude="blending"
        style={{ pointerEvents: 'none' }} // Prevent interference with 3D clicks
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '14px',
            color: 'white',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(4px)',
            cursor: 'pointer',
            transform: `translate(${label.screenOffset[0]}px, ${label.screenOffset[1]}px)`
          }}
        >
          {label.name}
        </div>
      </Html>
    </group>
  )
}

export default function GLBWithClickableLabels({ onLabelClick }) {
  return (
    <>
      {labelDefinitions.map((label) => (
        <ClickableLabel
          key={label.id}
          label={label}
          onLabelClick={onLabelClick}
        />
      ))}
    </>
  )
}