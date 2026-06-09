/**
 * Portfolio3D Component
 *
 * Main 3D scene using React Three Fiber featuring:
 * - Floating geometric shapes
 * - Interactive project hotspots
 * - Smooth camera animations
 * - Performance-optimized rendering
 */

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, OrbitControls, Text, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveHotspot from './InteractiveHotspot';

// Galaxy core sphere
const GalaxyCore = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    meshRef.current.rotation.y = t * 0.2;
    materialRef.current.distort = 0.3 + Math.sin(t * 0.5) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.5, 4]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.8}
          distort={0.3}
          speed={2}
          wireframe
        />
      </mesh>
    </Float>
  );
};

// Orbital ring
const OrbitalRing = ({ radius, color, speed, tilt }) => {
  const ringRef = useRef();

  useFrame((state) => {
    ringRef.current.rotation.z = state.clock.getElapsedTime() * speed;
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <group rotation={tilt}>
      <line ref={ringRef} geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </line>
    </group>
  );
};

// Floating project card in 3D
const FloatingProject = ({ position, project, onClick }) => {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    glowRef.current.material.opacity = 0.1 + Math.sin(t * 2) * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={position}>
        {/* Main card mesh */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <boxGeometry args={[2, 1.4, 0.1]} />
          <meshPhysicalMaterial
            color="#1a1a3e"
            roughness={0.5}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Glow effect */}
        <mesh ref={glowRef} scale={1.1}>
          <boxGeometry args={[2, 1.4, 0.1]} />
          <meshBasicMaterial
            color={project.color || '#7c3aed'}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Project title */}
        <Text
          position={[0, 0.3, 0.06]}
          fontSize={0.15}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {project.title}
        </Text>

        {/* Project description */}
        <Text
          position={[0, -0.1, 0.06]}
          fontSize={0.08}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {project.description}
        </Text>

        {/* Tech badges */}
        {project.tech?.slice(0, 3).map((tech, i) => (
          <Text
            key={tech}
            position={[-0.6 + i * 0.5, -0.5, 0.06]}
            fontSize={0.06}
            color="#a78bfa"
            anchorX="center"
            anchorY="middle"
          >
            {tech}
          </Text>
        ))}
      </group>
    </Float>
  );
};

// Particle system for cosmic dust
const CosmicDust = () => {
  const particlesRef = useRef();
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#7c3aed"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Scene content
const SceneContent = ({ projects, onProjectClick }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#7c3aed" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#06b6d4" />
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#f472b6" />

      {/* Background stars */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

      {/* Galaxy core */}
      <GalaxyCore />

      {/* Orbital rings */}
      <OrbitalRing radius={3} color="#7c3aed" speed={0.2} tilt={[0.3, 0, 0]} />
      <OrbitalRing radius={4.5} color="#06b6d4" speed={-0.15} tilt={[0.5, 0.3, 0]} />
      <OrbitalRing radius={6} color="#f472b6" speed={0.1} tilt={[0.2, 0.5, 0.3]} />

      {/* Sparkles */}
      <Sparkles count={100} scale={10} size={2} speed={0.3} color="#7c3aed" />

      {/* Cosmic dust */}
      <CosmicDust />

      {/* Project hotspots */}
      {projects?.map((project, index) => {
        const angle = (index / projects.length) * Math.PI * 2;
        const radius = 5;
        const position = [
          Math.cos(angle) * radius,
          Math.sin(index * 0.5) * 1.5,
          Math.sin(angle) * radius
        ];

        return (
          <FloatingProject
            key={project.id}
            position={position}
            project={project}
            onClick={() => onProjectClick(project)}
          />
        );
      })}

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

// Loading fallback
const Loader = () => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
  }}>
    Loading 3D Scene...
  </div>
);

// Main component
const Portfolio3D = ({ projects, onProjectClick }) => {
  return (
    <div className="portfolio-3d" role="img" aria-label="Interactive 3D galaxy portfolio scene">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 60 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <SceneContent projects={projects} onProjectClick={onProjectClick} />
        </Suspense>
      </Canvas>

      <style>{`
        .portfolio-3d {
          width: 100%;
          height: 100vh;
          position: relative;
          z-index: 1;
        }

        .portfolio-3d canvas {
          touch-action: none;
        }
      `}</style>
    </div>
  );
};

export default Portfolio3D;
