/**
 * GalaxyBackground Component
 *
 * Creates an immersive galaxy-themed background with:
 * - Animated star field using canvas
 * - Parallax scrolling effect
 * - Nebula color gradients
 * - Performance-optimized rendering
 */

import { useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const STAR_COUNT = 200;
const SHOOTING_STAR_INTERVAL = 3000;

const GalaxyBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.6]);

  // Initialize stars
  const initStars = useCallback((canvas) => {
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, []);

  // Create shooting star
  const createShootingStar = useCallback((canvas) => {
    return {
      x: Math.random() * canvas.width,
      y: 0,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 4,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
      opacity: 1,
      trail: [],
    };
  }, []);

  // Draw nebula gradient
  const drawNebula = useCallback((ctx, canvas) => {
    const gradient1 = ctx.createRadialGradient(
      canvas.width * 0.3, canvas.height * 0.4, 0,
      canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.5
    );
    gradient1.addColorStop(0, 'rgba(124, 58, 237, 0.15)');
    gradient1.addColorStop(0.5, 'rgba(124, 58, 237, 0.05)');
    gradient1.addColorStop(1, 'transparent');

    const gradient2 = ctx.createRadialGradient(
      canvas.width * 0.7, canvas.height * 0.6, 0,
      canvas.width * 0.7, canvas.height * 0.6, canvas.width * 0.4
    );
    gradient2.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
    gradient2.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)');
    gradient2.addColorStop(1, 'transparent');

    const gradient3 = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.8, 0,
      canvas.width * 0.5, canvas.height * 0.8, canvas.width * 0.3
    );
    gradient3.addColorStop(0, 'rgba(244, 114, 182, 0.1)');
    gradient3.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gradient3;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Animation loop
  const animate = useCallback((ctx, canvas, time) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw nebula
    drawNebula(ctx, canvas);

    // Draw and animate stars
    starsRef.current.forEach((star) => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const currentOpacity = star.opacity * (0.7 + twinkle * 0.3);

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
      ctx.fill();

      // Add glow to larger stars
      if (star.size > 1.5) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${currentOpacity * 0.3})`;
        ctx.fill();
      }

      // Move stars slowly
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });

    // Shooting stars
    shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;
      star.opacity -= 0.02;

      // Draw trail
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(
        star.x - Math.cos(star.angle) * star.length,
        star.y - Math.sin(star.angle) * star.length
      );

      const gradient = ctx.createLinearGradient(
        star.x, star.y,
        star.x - Math.cos(star.angle) * star.length,
        star.y - Math.sin(star.angle) * star.length
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
      gradient.addColorStop(1, 'transparent');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw head
      ctx.beginPath();
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();

      return star.opacity > 0 && star.x < canvas.width && star.y < canvas.height;
    });

    animationRef.current = requestAnimationFrame((t) => animate(ctx, canvas, t));
  }, [drawNebula]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas);
    };

    resize();
    window.addEventListener('resize', resize);

    // Start animation
    animationRef.current = requestAnimationFrame((t) => animate(ctx, canvas, t));

    // Periodically add shooting stars
    const shootingInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        shootingStarsRef.current.push(createShootingStar(canvas));
      }
    }, SHOOTING_STAR_INTERVAL);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
      clearInterval(shootingInterval);
    };
  }, [initStars, animate, createShootingStar]);

  return (
    <motion.div
      className="galaxy-background"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div className="galaxy-bg__base" />

      {/* Parallax nebula layers */}
      <motion.div className="galaxy-bg__nebula galaxy-bg__nebula--1" style={{ y: y1 }} />
      <motion.div className="galaxy-bg__nebula galaxy-bg__nebula--2" style={{ y: y2 }} />

      {/* Star canvas */}
      <canvas ref={canvasRef} className="galaxy-bg__stars" />

      {/* Vignette overlay */}
      <div className="galaxy-bg__vignette" />

      <style>{`
        .galaxy-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .galaxy-bg__base {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 50%,
            var(--bg-secondary) 0%,
            var(--bg-primary) 70%
          );
        }

        .galaxy-bg__nebula {
          position: absolute;
          inset: -20%;
          background-size: cover;
          opacity: 0.4;
          mix-blend-mode: screen;
        }

        .galaxy-bg__nebula--1 {
          background: radial-gradient(ellipse at 30% 40%,
            rgba(124, 58, 237, 0.3) 0%,
            transparent 50%
          ),
          radial-gradient(ellipse at 70% 60%,
            rgba(6, 182, 212, 0.2) 0%,
            transparent 40%
          );
        }

        .galaxy-bg__nebula--2 {
          background: radial-gradient(ellipse at 60% 30%,
            rgba(244, 114, 182, 0.15) 0%,
            transparent 45%
          ),
          radial-gradient(ellipse at 20% 70%,
            rgba(129, 140, 248, 0.2) 0%,
            transparent 50%
          );
        }

        .galaxy-bg__stars {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .galaxy-bg__vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center,
            transparent 50%,
            rgba(10, 10, 26, 0.6) 100%
          );
        }
      `}</style>
    </motion.div>
  );
};

export default GalaxyBackground;
