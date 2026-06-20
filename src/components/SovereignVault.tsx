/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Icosahedron, Float } from "@react-three/drei";
import * as THREE from "three";
import { ShieldCheck, Cpu, Database, Info } from "lucide-react";

// Concentric Orbiting Cryptographic Security Rings
function CryptoSecurityRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (groupRef.current) {
      const rings = groupRef.current.children;
      // Reverse and varying speeds for gorgeous dynamic movement
      if (rings[0]) rings[0].rotation.z = elapsed * 0.45;
      if (rings[1]) rings[1].rotation.x = -elapsed * 0.3;
      if (rings[2]) rings[2].rotation.y = elapsed * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Cyan Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.05, 64]} />
        <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      {/* Tilted Purple Segment ring */}
      <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <ringGeometry args={[2.2, 2.23, 64]} />
        <meshBasicMaterial color="#bd00ff" side={THREE.DoubleSide} transparent opacity={0.35} />
      </mesh>

      {/* Inner Blue Tech Segment */}
      <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[2.3, 2.38, 6, 1, 0, Math.PI * 1.6]} />
        <meshBasicMaterial color="#0088ff" side={THREE.DoubleSide} transparent opacity={0.4} wireframe />
      </mesh>
    </group>
  );
}

// Quantum Bits orbiting inside containment shield (Data Starfield)
function QuantumDataParticles({ count = 150 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute points spherically within the containment shield radius
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.5 + Math.random() * 1.1; // Orbiting between center core and geodesic shield

      temp[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      temp[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      temp[i * 3 + 2] = r * Math.cos(phi);
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = -elapsed * 0.12;
      pointsRef.current.rotation.x = elapsed * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Sleek, Multi-Faceted Geodesic energy shield (replaces wobbly cell membrane)
function CryptographicGeodesicShield() {
  const shieldRef = useRef<THREE.Mesh>(null);
  const coreGridRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (shieldRef.current) {
      shieldRef.current.rotation.y = elapsed * 0.08;
      shieldRef.current.rotation.z = elapsed * 0.04;
    }
    if (coreGridRef.current) {
      coreGridRef.current.rotation.y = -elapsed * 0.12;
      coreGridRef.current.rotation.x = elapsed * 0.06;
    }
  });

  return (
    <group>
      {/* Geodesic faceted pristine glass shield */}
      <mesh ref={shieldRef}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshPhysicalMaterial
          color="#061e2f"
          emissive="#002d44"
          roughness={0.15}
          metalness={0.9}
          transmission={0.65}
          ior={1.4}
          thickness={0.8}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cybernetic Wireframe outer alignment grid */}
      <mesh ref={coreGridRef}>
        <icosahedronGeometry args={[1.71, 1]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Soft neon energy envelope */}
      <mesh>
        <sphereGeometry args={[1.76, 32, 32]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Inner Tech Core of the Sovereign Health Vault
function VaultCore() {
  const coreRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.65;
      coreRef.current.rotation.x = elapsed * 0.35;
      
      // Heartbeat pulse simulation
      const pulse = 1.0 + Math.sin(elapsed * 3.5) * 0.12;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={coreRef}>
      {/* Central power octahedron */}
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Inner bright solid active core */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Embedded orbiting core satellites */}
      <group rotation={[Math.PI / 4, 0, 0]}>
        <mesh position={[0.42, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color="#bd00ff" />
        </mesh>
        <mesh position={[-0.42, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color="#bd00ff" />
        </mesh>
      </group>
    </group>
  );
}

// Interactive floating nodes connecting to the bubble
function ExternalProbes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Probe 1 */}
      <Float speed={2} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        <mesh position={[3.2, 0.5, 1.2]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshBasicMaterial color="#00f0ff" wireframe />
        </mesh>
        {/* Connection line helper */}
        <mesh position={[2.1, 0.25, 0.6]} rotation={[0, 0.2, 0.3]}>
          <boxGeometry args={[1.5, 0.02, 0.02]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.2} />
        </mesh>
      </Float>

      {/* Probe 2 */}
      <Float speed={1.5} floatIntensity={0.8} floatingRange={[-0.3, 0.3]}>
        <mesh position={[-3.0, -0.8, -1.0]}>
          <octahedronGeometry args={[0.25, 1]} />
          <meshBasicMaterial color="#bd00ff" wireframe />
        </mesh>
        {/* Connection line helper */}
        <mesh position={[-2.0, -0.4, -0.5]} rotation={[0.4, -0.2, -0.3]}>
          <boxGeometry args={[1.5, 0.02, 0.02]} />
          <meshBasicMaterial color="#bd00ff" transparent opacity={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

// Setup scene elements (Lights, Camera)
function VaultScene() {
  const { camera } = useThree();

  useEffect(() => {
    // Lock start position
    camera.position.set(0, 0, 7);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -15, -10]} intensity={1.0} color="#bd00ff" />
      <pointLight position={[5, 5, 5]} intensity={2.0} color="#00f0ff" />
      
      <ExternalProbes />
      <VaultCore />
      <CryptographicGeodesicShield />
      <QuantumDataParticles />
      <CryptoSecurityRings />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
}

export default function SovereignVault() {
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    // Gracefully catch any WebGL unavailability
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setWebglError(true);
    }
  }, []);

  return (
    <div id="sovereign-vault-card" className="w-full h-[400px] md:h-[460px] rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between p-5 border border-neon-cyan/20">
      <div className="absolute inset-0 cyber-dot-grid opacity-25 pointer-events-none" />
      
      {/* Decorative top hud specs */}
      <div className="z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Database className="w-4 h-4 text-neon-cyan animate-pulse" />
            <span className="font-mono text-[9px] tracking-widest font-bold text-slate-400">LEDGER_VAULT_ENGINE</span>
          </div>
          <h3 className="font-display text-base font-bold text-white mt-1">Sovereign Health Vault</h3>
        </div>
        <div className="bg-slate-950/80 px-2.5 py-1 rounded-lg border border-neon-cyan/15 text-[9px] font-mono text-neon-cyan font-bold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-neon-green" /> MEMBRANE_SECURED
        </div>
      </div>

      {/* Panoramic fluid 3D view */}
      {webglError ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center px-4">
          {/* Stunning CSS Fallback Fluid pulse container if WebGL is disabled */}
          <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
            {/* Pulsating back ripples */}
            <div className="absolute inset-0 rounded-full bg-neon-cyan/5 border-2 border-neon-cyan/30 animate-pulse scale-125" />
            <div className="absolute inset-2 rounded-full bg-neon-purple/5 border border-neon-purple/20 animate-ping" />
            {/* Core glass shape */}
            <div className="absolute w-28 h-28 rounded-full border border-neon-cyan/50 bg-gradient-to-tr from-cyber-dark/80 to-neon-cyan/20 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.25)]">
              <Cpu className="w-10 h-10 text-neon-cyan animate-pulse" />
            </div>
          </div>
          <p className="font-display font-semibold text-white text-xs mb-1">Interactive Fluid Engine Fallback</p>
          <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed">Highly refractive fluid membrane emulation initialized. Client hardware pipeline redirected to CSS Core.</p>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
            <Suspense fallback={null}>
              <VaultScene />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Cyber stats overview footer */}
      <div className="z-10 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border border-neon-cyan/15 grid grid-cols-2 gap-3 divide-x divide-slate-900 text-center text-xs">
        <div>
          <span className="font-mono text-[8px] text-slate-500 block uppercase">CIPHER_TRANSFORMS</span>
          <span className="font-mono text-[10px] text-slate-200 mt-0.5 inline-block font-semibold">ChaCha20-Poly1305</span>
        </div>
        <div>
          <span className="font-mono text-[8px] text-slate-500 block uppercase">MEMBRANE_COHERENCE</span>
          <span className="font-mono text-[10px] text-neon-cyan mt-0.5 inline-block font-bold">99.987% FLUID</span>
        </div>
      </div>
    </div>
  );
}
