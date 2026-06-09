/**
 * InteractiveHotspot Component
 *
 * 3D interactive point that reveals project information
 * when hovered or clicked. Features:
 * - Pulse animation
 * - Tooltip display
 * - Smooth transitions
 * - Accessibility support
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

const InteractiveHotspot = ({ position, project, onClick }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulse animation
    const scale = 1 + Math.sin(t * 2) * 0.1;
    meshRef.current.scale.setScalar(hovered ? 1.3 : scale);

    // Glow animation
    glowRef.current.material.opacity = 0.2 + Math.sin(t * 3) * 0.1;
    glowRef.current.scale.setScalar(hovered ? 2 : 1.5 + Math.sin(t * 2) * 0.3);
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setActive(!active);
    onClick?.(project);
  };

  return (
    <group position={position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color={project.color || '#7c3aed'}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Main hotspot */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={project.color || '#7c3aed'}
          emissive={project.color || '#7c3aed'}
          emissiveIntensity={hovered ? 1 : 0.5}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Tooltip */}
      {hovered && (
        <Billboard>
          <Html
            center
            distanceFactor={8}
            style={{
              transition: 'all 0.3s ease',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1)' : 'scale(0.8)',
            }}
          >
            <div className="hotspot-tooltip" role="tooltip">
              <h4>{project.title}</h4>
              <p>{project.shortDescription}</p>
              <span className="hotspot-tooltip__action">Click to explore</span>
            </div>
          </Html>
        </Billboard>
      )}

      {/* Connection lines to core */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, ...position.map(p => -p * 0.8)])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={project.color || '#7c3aed'}
          transparent
          opacity={hovered ? 0.4 : 0.1}
        />
      </line>

      <style>{`
        .hotspot-tooltip {
          background: rgba(22, 22, 58, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 12px;
          padding: 12px 16px;
          min-width: 180px;
          max-width: 220px;
          pointer-events: none;
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
        }

        .hotspot-tooltip h4 {
          color: #e2e8f0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        .hotspot-tooltip p {
          color: #94a3b8;
          font-size: 0.75rem;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .hotspot-tooltip__action {
          color: #a78bfa;
          font-size: 0.7rem;
          font-weight: 500;
        }
      `}</style>
    </group>
  );
};

export default InteractiveHotspot;
