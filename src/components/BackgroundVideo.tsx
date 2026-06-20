/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface BackgroundVideoProps {
  opacity?: number;
}

export default function BackgroundVideo({ opacity = 0.4 }: BackgroundVideoProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Background Video Player */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="object-cover w-full h-full filter brightness-[0.35] saturate-[1.3]"
        style={{ opacity }}
      >
        {/* Attempt to play the exact uploaded user video file in the container path */}
        <source src="/Make_fluid_like_animation_202606201802.mp4" type="video/mp4" />
        {/* Support local route in case file prefix differs */}
        <source src="./Make_fluid_like_animation_202606201802.mp4" type="video/mp4" />
        {/* Liquid blue/metal wave high quality backup stream */}
        <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-neon-glowing-wave-lines-41855-large.mp4" type="video/mp4" />
      </video>

      {/* Cyber overlay screen layers */}
      <div className="absolute inset-0 bg-cyber-dark/40 z-1" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70 z-1" />
    </div>
  );
}
