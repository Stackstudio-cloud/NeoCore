export default function AnimatedBackground() {
  return (
    <div className="particle-bg">
      <div 
        className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
        style={{ top: '10%', left: '10%', animationDelay: '0s' }}
      />
      <div 
        className="absolute w-1 h-1 bg-green-400 rounded-full animate-float"
        style={{ top: '20%', left: '80%', animationDelay: '0.5s' }}
      />
      <div 
        className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float"
        style={{ top: '60%', left: '20%', animationDelay: '1s' }}
      />
      <div 
        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
        style={{ top: '80%', left: '90%', animationDelay: '1.5s' }}
      />
      <div 
        className="absolute w-1 h-1 bg-pink-400 rounded-full animate-float"
        style={{ top: '40%', left: '60%', animationDelay: '2s' }}
      />
    </div>
  );
}
