/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { ShieldCheck, Cpu, Database, Info } from "lucide-react";

// Inner Tech Core of the Sovereign Health Vault
function VaultCore() {
  const coreRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.4;
      coreRef.current.rotation.x = elapsed * 0.2;
      
      // Heartbeat pulse simulation
      const pulse = 1.0 + Math.sin(elapsed * 3.0) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -elapsed * 0.8;
      ringRef.current.rotation.x = elapsed * 0.1;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = elapsed * 1.2;
    }
  });

  return (
    <group ref={coreRef}>
      {/* Central power node */}
      <mesh>
        <octahedronGeometry args={[0.7, 2]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Inner bright solid core */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Embedded tech rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.0, 1.1, 32]} />
        <meshBasicMaterial
          color="#0088ff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh ref={ringRef2} rotation={[0, Math.PI / 4, 0]}>
        <ringGeometry args={[1.3, 1.35, 4]} />
        <meshBasicMaterial
          color="#bd00ff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
          wireframe
        />
      </mesh>
    </group>
  );
}

// Fluid Glass Membrane surrounding the core (simulating highly refractive organic bubble)
function FluidMembrane() {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Rotate slowly for visual richness
      meshRef.current.rotation.y = elapsed * 0.15;
      meshRef.current.rotation.x = elapsed * 0.08;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2.0, 64, 64]}>
      {/* Using Drei's distorted material to warp vertices using animated simplex noise */}
      <MeshDistortMaterial
        color="#ffffff"
        distort={0.28} // Distort level
        speed={1.6} // Speed of the wave ripple animation
        roughness={0.01}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transmission={0.95} // High glass transmission
        ior={1.45} // High refraction index
        thickness={1.5}
        transparent
        opacity={0.85}
        attenuationColor="#00f0ff"
        attenuationDistance={0.5}
      />
    </Sphere>
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
      <FluidMembrane />

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
