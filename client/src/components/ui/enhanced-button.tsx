import React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  icon?: React.ComponentType<{ className?: string }>;
  soundEnabled?: boolean;
}

export function EnhancedButton({
  children,
  loading = false,
  success = false,
  error = false,
  loadingText = "Loading...",
  successText = "Success!",
  errorText = "Error",
  icon: Icon,
  soundEnabled = false,
  className,
  disabled,
  onClick,
  ...props
}: EnhancedButtonProps) {
  const [internalState, setInternalState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Reset internal state when external props change
  React.useEffect(() => {
    if (success) {
      setInternalState('success');
      setTimeout(() => setInternalState('idle'), 2000);
    } else if (error) {
      setInternalState('error');
      setTimeout(() => setInternalState('idle'), 3000);
    } else if (loading) {
      setInternalState('loading');
    } else {
      setInternalState('idle');
    }
  }, [loading, success, error]);
  
  const playSound = React.useCallback((type: 'click' | 'success' | 'error') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    
    // Create audio context for interaction feedback
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different actions
      switch (type) {
        case 'click':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
          break;
        case 'success':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.2);
          break;
        case 'error':
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
          break;
      }
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Ignore audio errors
    }
  }, [soundEnabled]);
  
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (internalState === 'loading' || disabled) return;
    
    playSound('click');
    onClick?.(event);
  }, [onClick, internalState, disabled, playSound]);
  
  // Play sound effects for state changes
  React.useEffect(() => {
    if (internalState === 'success') {
      playSound('success');
    } else if (internalState === 'error') {
      playSound('error');
    }
  }, [internalState, playSound]);
  
  const getContent = () => {
    switch (internalState) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {loadingText}
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
            {successText}
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className="w-4 h-4 mr-2 text-red-400" />
            {errorText}
          </>
        );
      default:
        return (
          <>
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
          </>
        );
    }
  };
  
  const getVariant = () => {
    switch (internalState) {
      case 'success':
        return 'outline' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return props.variant;
    }
  };
  
  return (
    <Button
      {...props}
      variant={getVariant()}
      disabled={disabled || internalState === 'loading'}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        internalState === 'loading' && "cursor-not-allowed",
        internalState === 'success' && "border-green-400/50 bg-green-400/10 text-green-400",
        internalState === 'error' && "border-red-400/50",
        // Hover effects
        "hover:shadow-lg hover:scale-105",
        // Modern glow effect
        "hover:shadow-cyan-400/25",
        className
      )}
    >
      {/* Ripple effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      
      {/* Content */}
      <span className="relative z-10">
        {getContent()}
      </span>
    </Button>
  );
}

// Specialized button variants
export function ModernButton({
  children,
  glowColor = "cyan",
  ...props
}: EnhancedButtonProps & { glowColor?: "cyan" | "green" | "purple" | "red" }) {
  const glowColors = {
    cyan: "hover:shadow-cyan-400/50 hover:border-cyan-400/50",
    green: "hover:shadow-green-400/50 hover:border-green-400/50",
    purple: "hover:shadow-purple-400/50 hover:border-purple-400/50",
    red: "hover:shadow-red-400/50 hover:border-red-400/50",
  };
  
  return (
    <EnhancedButton
      {...props}
      className={cn(
        "glass-card border-gray-600/50 hover:bg-gray-800/50",
        glowColors[glowColor],
        props.className
      )}
    >
      {children}
    </EnhancedButton>
  );
}

export function ActionButton({
  action,
  onAction,
  children,
  ...props
}: Omit<EnhancedButtonProps, 'onClick'> & {
  action: () => Promise<void>;
  onAction?: (success: boolean) => void;
}) {
  const [state, setState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const handleAction = async () => {
    setState('loading');
    try {
      await action();
      setState('success');
      onAction?.(true);
    } catch (error) {
      setState('error');
      onAction?.(false);
    }
  };
  
  return (
    <EnhancedButton
      {...props}
      loading={state === 'loading'}
      success={state === 'success'}
      error={state === 'error'}
      onClick={handleAction}
    >
      {children}
    </EnhancedButton>
  );
}