import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './button';

interface EnhancedButtonProps extends ButtonProps {
  glowColor?: string;
  soundEnabled?: boolean;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, glowColor, soundEnabled = true, onClick, onMouseEnter, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundEnabled && (window as any).playNeoCoreSound) {
        (window as any).playNeoCoreSound('click');
      }
      onClick?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundEnabled && (window as any).playNeoCoreSound) {
        (window as any).playNeoCoreSound('hover');
      }
      onMouseEnter?.(e);
    };

    const glowStyle = glowColor ? {
      boxShadow: `0 0 20px ${glowColor}66, inset 0 0 20px ${glowColor}11`,
      border: `1px solid ${glowColor}88`
    } : {};

    return (
      <Button
        ref={ref}
        className={`transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
        style={glowStyle}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;