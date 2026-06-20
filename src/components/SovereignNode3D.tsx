/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Activity, ShieldAlert, Cpu } from "lucide-react";

interface SovereignNode3DProps {
  neuralHz: number;
  heartRate: number;
}

export default function SovereignNode3D({ neuralHz, heartRate }: SovereignNode3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);
  const [activeMode, setActiveMode] = useState<"GENOMICS" | "NEURAL" | "LEDGER">("NEURAL");

  // Store telemetry variables in ref so Three.js render loop can read them in real-time
  const telemetryRef = useRef({ neuralHz, heartRate });
  
  useEffect(() => {
    telemetryRef.current = { neuralHz, heartRate };
  }, [neuralHz, heartRate]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Dimensions
    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 25;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.error("WebGL initialization failed", e);
      setWebglError(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Create Holographic Particle Genome Sphere
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color1 = new THREE.Color(0x00f0ff); // Neon Cyan
    const color2 = new THREE.Color(0x0088ff); // Deep Blue
    const color3 = new THREE.Color(0xbd00ff); // Purple

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 5.5 + Math.random() * 0.8; // Radius

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Interpolate colors for futuristic neon genomic look
      const t = Math.random();
      let mixedColor = color1.clone();
      if (t < 0.4) {
        mixedColor.lerp(color2, t * 2.5);
      } else {
        mixedColor.lerp(color3, (t - 0.4) * 1.6);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = 1.0 + Math.random() * 2.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom shader-like materials for glowing square stars
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // Inner Core Orb (Glowing Wireframe Sphere)
    const coreGeometry = new THREE.SphereGeometry(3.2, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Quantum Outer Satellite Ring / Halo
    const ringGeometry = new THREE.RingGeometry(7.2, 7.3, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2.5;
    scene.add(ringMesh);

    // Outer Latitudinal Wireframe Orb (for advanced medical node visualization)
    const orbitGeometry = new THREE.IcosahedronGeometry(7.5, 1);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0xbd00ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
    scene.add(orbitMesh);

    // Ambient Grid Floor
    const gridHelper = new THREE.GridHelper(50, 20, 0x00f0ff, 0x0b1329);
    gridHelper.position.y = -10;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.18;
    scene.add(gridHelper);

    // Mouse Controls
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseX = (event.clientX - rect.left - width / 2) * 0.01;
      mouseY = (event.clientY - rect.top - height / 2) * 0.01;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(mountRef.current);

    // Animation loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const currentTelemetry = telemetryRef.current;

      // Base dynamic speeds based on current Neural coherence or Heart rate metrics
      const speedMultiplier = 1.0 + (currentTelemetry.neuralHz - 35) / 10;
      const pulseScaling = 1.0 + Math.sin(elapsed * 4.0) * 0.05 * (currentTelemetry.heartRate / 70);

      // Smooth mouse damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate particle systems based on telemetries
      particleSystem.rotation.y = elapsed * 0.08 * speedMultiplier + targetX;
      particleSystem.rotation.x = elapsed * 0.05 + targetY;
      
      // Rotate nested cores in diverse axis
      coreMesh.rotation.y = -elapsed * 0.12 * speedMultiplier;
      coreMesh.rotation.z = elapsed * 0.06;
      coreMesh.scale.set(pulseScaling, pulseScaling, pulseScaling);

      orbitMesh.rotation.y = elapsed * 0.03 + targetX * 0.5;
      orbitMesh.rotation.x = -elapsed * 0.02 + targetY * 0.5;

      ringMesh.rotation.z = elapsed * 0.1 * speedMultiplier;

      // Custom pulse light simulation for metabolic updates
      if (currentTelemetry.heartRate > 85) {
        particleMaterial.size = 0.45 + Math.sin(elapsed * 12.0) * 0.1;
      } else {
        particleMaterial.size = 0.35 + Math.sin(elapsed * 6.0) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
    };
  }, []);

  return (
    <div id="vortex-neural-cell" className="relative w-full h-[360px] md:h-[420px] rounded-2xl glass-panel overflow-hidden flex flex-col justify-between p-5 border border-neon-cyan/20">
      {/* Background Overlay */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-neon-cyan/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 cyber-dot-grid opacity-30 pointer-events-none" />
      
      {/* Header telemetry metadata */}
      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-slate-400">DECEN_INTELLIGENCE_NODE</span>
        </div>
        <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-neon-cyan/10 gap-1 text-[10px] font-mono">
          {(["NEURAL", "GENOMICS", "LEDGER"] as const).map((m) => (
            <button
              id={`mode-${m.toLowerCase()}`}
              key={m}
              onClick={() => setActiveMode(m)}
              className={`px-2 py-0.5 rounded-md transition-all ${
                activeMode === m
                  ? "bg-neon-cyan text-cyber-dark font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {webglError ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center px-4">
          <ShieldAlert className="w-12 h-12 text-neon-rose mb-3 animate-pulse" />
          <p className="font-display font-medium text-white mb-1">WebGL Subsystem Deferred</p>
          <p className="text-xs text-slate-500 max-w-xs">Hardware acceleration is restricted or legacy in this runtime frame. Activating CSS core particle simulation.</p>
        </div>
      ) : (
        <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-pointer" />
      )}

      {/* Futuristic bottom HUD diagnostics overlay */}
      <div className="z-10 grid grid-cols-3 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border border-neon-cyan/10 gap-2.5 text-center transition-all duration-300">
        <div className="flex flex-col items-center justify-center border-r border-neon-cyan/10">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Cpu className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="text-[9px] font-mono tracking-wider">NEURAL_SYNAPSE</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-white font-mono">
            {neuralHz} <span className="text-[9px] text-neon-cyan">Hz</span>
          </span>
          <div className="text-[8px] font-mono text-neon-cyan/80 mt-0.5">Gamma Resonance</div>
        </div>

        <div className="flex flex-col items-center justify-center border-r border-neon-cyan/10">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-neon-blue" />
            <span className="text-[9px] font-mono tracking-wider">HEART_STABILIZER</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-white font-mono">
            {heartRate} <span className="text-[9px] text-neon-blue font-semibold">BPM</span>
          </span>
          <div className="text-[8px] font-mono text-neon-blue/80 mt-0.5">Pulse Synchrony</div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
            <span className="text-[9px] font-mono tracking-wider">CRYPT_LEDGER</span>
          </div>
          <span className="text-xs font-semibold tracking-tight text-slate-300 font-mono">ED25519_OK</span>
          <div className="text-[8px] font-mono text-neon-purple/80 mt-1">IPFS Block #641K</div>
        </div>
      </div>
    </div>
  );
}
