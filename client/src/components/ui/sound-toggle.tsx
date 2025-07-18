import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';

interface SoundToggleProps {
  className?: string;
}

export default function SoundToggle({ className = '' }: SoundToggleProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('neocore-sound-enabled');
    setSoundEnabled(saved === 'true');
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('neocore-sound-enabled', newState.toString());
  };

  const playSound = (type: 'click' | 'hover' | 'success' | 'error') => {
    if (!soundEnabled) return;

    // Create audio context for synthetic sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sound profiles
    const sounds = {
      click: { frequency: 800, duration: 0.1 },
      hover: { frequency: 600, duration: 0.05 },
      success: { frequency: 1000, duration: 0.2 },
      error: { frequency: 300, duration: 0.3 }
    };

    const sound = sounds[type];
    oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + sound.duration);
  };

  // Expose playSound function globally
  useEffect(() => {
    (window as any).playNeoCoreSound = playSound;
  }, [soundEnabled]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSound}
      className={`text-gray-400 hover:text-white ${className}`}
    >
      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </Button>
  );
}