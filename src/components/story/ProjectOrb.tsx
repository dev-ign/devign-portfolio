import React from 'react';
import { motion } from 'motion/react';
import { projects } from '@/data/projects';

const RADIUS = 285;
const IMAGE_W = 88;
const IMAGE_H = 112;
const ORBIT_W = (RADIUS + IMAGE_W / 2) * 2;
const ORBIT_H = (RADIUS + IMAGE_H / 2) * 2;

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Radial gradient centered on the text column area (~36% down the viewport).
// Only fades images that sit directly behind the text — the bottom of the orbit stays visible.
const MASK =
  'radial-gradient(ellipse 34vw 40vh at 50% 36%, transparent 0%, transparent 40%, rgba(0,0,0,0.88) 72%, black 100%)';

interface Props {
  show: boolean;
}

export default function ProjectOrb({ show }: Props) {
  return (
    // Fixed so it fills the viewport regardless of page scroll / overflow rules
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      {/* Entrance: fades in slowly, no lateral movement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 3, ease: EASE, delay: show ? 1.0 : 0 }}
        style={{
          position: 'absolute',
          top: `calc(50% - ${ORBIT_H / 2}px)`,
          left: `calc(50% - ${ORBIT_W / 2}px)`,
        }}
      >
        {/* 3D perspective context */}
        <div style={{ perspective: '900px' }}>
          {/* Tilt: circle recedes toward the top */}
          <div style={{ transform: 'rotateX(52deg)' }}>
            {/* Orbit: images continuously travel the circle path */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop',
              }}
              style={{
                position: 'relative',
                width: ORBIT_W,
                height: ORBIT_H,
              }}
            >
              {projects.map((project, i) => {
                const angle = (i / projects.length) * 2 * Math.PI;
                const x = RADIUS * Math.cos(angle);
                const y = RADIUS * Math.sin(angle);
                return (
                  <div
                    key={project.id}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: IMAGE_W,
                      height: IMAGE_H,
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      borderRadius: 10,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }}
                  >
                    <img
                      src={project.image}
                      alt=""
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
