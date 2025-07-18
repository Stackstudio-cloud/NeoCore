import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ParticleSystemProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  speed?: number;
}

export default function ParticleSystem({ 
  className = '', 
  particleCount = 50,
  colors = ['#00ff41', '#0099ff', '#ff0099', '#ffff00'],
  speed = 1
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const initParticles = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          life: Math.random() * 60 + 60,
          maxLife: Math.random() * 60 + 60,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1
        });
      }
    };

    const updateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Reset particle if it dies or goes off screen
        if (particle.life <= 0 || 
            particle.x < 0 || particle.x > canvas.width ||
            particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * speed;
          particle.vy = (Math.random() - 0.5) * speed;
          particle.life = particle.maxLife;
          particle.color = colors[Math.floor(Math.random() * colors.length)];
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
        ctx.fill();

        // Glow effect
        ctx.fillStyle = `${particle.color}${Math.floor(alpha * 0.3 * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      initParticles();
    };

    initParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [particleCount, colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}