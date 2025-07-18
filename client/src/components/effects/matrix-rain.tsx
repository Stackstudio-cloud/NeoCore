import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
  density?: number;
  speed?: number;
  opacity?: number;
}

export default function MatrixRain({ 
  className = '', 
  density = 0.02, 
  speed = 50, 
  opacity = 0.3 
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');

    let animationId: number;
    let columns: number;
    let drops: number[];

    const initMatrix = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const fontSize = 12;
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(0);

      // Initialize drops at random positions
      for (let i = 0; i < drops.length; i++) {
        drops[i] = Math.random() * -canvas.height;
      }
    };

    const draw = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - opacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff41';
      ctx.font = '12px monospace';

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Draw character
        ctx.fillText(char, i * 12, drops[i]);

        // Reset drop if it goes off screen
        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i] += speed / 10;
      }

      animationId = requestAnimationFrame(draw);
    };

    // Initialize and start animation
    initMatrix();
    draw();

    // Handle resize
    const handleResize = () => {
      initMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [density, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
}