import React, { useEffect, useRef } from 'react';

interface HolographicChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function HolographicChart({ 
  data, 
  width = 300, 
  height = 150, 
  color = '#00ff41',
  className = '' 
}: HolographicChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const drawChart = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = `${color}33`;
      ctx.lineWidth = 1;
      
      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical grid lines
      for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw data line
      if (data.length > 1) {
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue || 1;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((value, index) => {
          const x = (width / (data.length - 1)) * index;
          const y = height - ((value - minValue) / range) * height;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();

        // Draw glow effect
        ctx.strokeStyle = `${color}66`;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw data points
        ctx.fillStyle = color;
        data.forEach((value, index) => {
          const x = (width / (data.length - 1)) * index;
          const y = height - ((value - minValue) / range) * height;
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();

          // Glow effect for points
          ctx.fillStyle = `${color}66`;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = color;
        });
      }
    };

    drawChart();
  }, [data, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`drop-shadow-lg ${className}`}
      style={{
        filter: `drop-shadow(0 0 10px ${color}66)`,
      }}
    />
  );
}