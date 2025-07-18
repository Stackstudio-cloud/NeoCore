import React, { useEffect, useRef } from 'react';

interface DataStreamProps {
  className?: string;
  color?: string;
  speed?: number;
  lines?: number;
}

export default function DataStream({ 
  className = '', 
  color = '#00ff41',
  speed = 2,
  lines = 5
}: DataStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const streamElements: HTMLElement[] = [];

    // Create data stream lines
    for (let i = 0; i < lines; i++) {
      const line = document.createElement('div');
      line.className = 'absolute text-xs font-mono whitespace-nowrap';
      line.style.cssText = `
        color: ${color};
        opacity: 0.7;
        top: ${Math.random() * 100}%;
        left: -200px;
        animation: dataFlow ${10 + Math.random() * 20}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
      `;

      // Random data content
      const dataTypes = [
        '{"user_id": 1847, "action": "query", "table": "users"}',
        'SELECT * FROM projects WHERE status = "active"',
        'POST /api/v1/functions/execute',
        'WebSocket connection established: ws://neocore.io',
        'AI Model: gpt-4 | Tokens: 2847 | Latency: 120ms',
        'Database sync: 99.7% | Queries/sec: 1,247',
        'Storage: 847.2GB | Bandwidth: 2.1TB/month',
        'Functions deployed: 23 | Invocations: 847,293'
      ];

      line.textContent = dataTypes[Math.floor(Math.random() * dataTypes.length)];
      container.appendChild(line);
      streamElements.push(line);
    }

    // Add CSS animation if not exists
    if (!document.getElementById('data-stream-styles')) {
      const style = document.createElement('style');
      style.id = 'data-stream-styles';
      style.textContent = `
        @keyframes dataFlow {
          0% {
            transform: translateX(-200px);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateX(calc(100vw + 200px));
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      streamElements.forEach(el => el.remove());
    };
  }, [color, speed, lines]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    />
  );
}