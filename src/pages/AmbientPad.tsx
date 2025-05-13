import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface KeyType {
  name: string;
  label: string;
  file: string;
}

const KEYS: KeyType[] = [
  { name: 'C', label: 'Dó', file: '/assets/pad/fundations/C.mp3' },
  { name: 'C#', label: 'Dó#', file: '/assets/pad/fundations/Db.mp3' },
  { name: 'D', label: 'Ré', file: '/assets/pad/fundations/D.mp3' },
  { name: 'D#', label: 'Ré#', file: '/assets/pad/fundations/Eb.mp3' },
  { name: 'E', label: 'Mi', file: '/assets/pad/fundations/E.mp3' },
  { name: 'F', label: 'Fá', file: '/assets/pad/fundations/F.mp3' },
  { name: 'F#', label: 'Fá#', file: '/assets/pad/fundations/Gb.mp3' },
  { name: 'G', label: 'Sol', file: '/assets/pad/fundations/G.mp3' },
  { name: 'G#', label: 'Sol#', file: '/assets/pad/fundations/Ab.mp3' },
  { name: 'A', label: 'Lá', file: '/assets/pad/fundations/A.mp3' },
  { name: 'A#', label: 'Lá#', file: '/assets/pad/fundations/Bb.mp3' },
  { name: 'B', label: 'Si', file: '/assets/pad/fundations/B.mp3' }
];

export default function AmbientPad(): JSX.Element {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [currentKey, setCurrentKey] = useState<KeyType>(KEYS[0]);
  
  // Refs for audio elements and timers
  const primaryAudioRef = useRef<HTMLAudioElement | null>(null);
  const secondaryAudioRef = useRef<HTMLAudioElement | null>(null);
  const crossfadeTimerRef = useRef<number | null>(null);
  const loopCheckIntervalRef = useRef<number | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    // Create primary audio element
    primaryAudioRef.current = new Audio();
    primaryAudioRef.current.loop = false; // We'll handle looping manually
    primaryAudioRef.current.volume = volume;
    
    // Create secondary audio element for crossfading
    secondaryAudioRef.current = new Audio();
    secondaryAudioRef.current.loop = false;
    secondaryAudioRef.current.volume = 0;
    
    return () => {
      // Clean up on component unmount
      if (primaryAudioRef.current) {
        primaryAudioRef.current.pause();
        primaryAudioRef.current.src = '';
      }
      
      if (secondaryAudioRef.current) {
        secondaryAudioRef.current.pause();
        secondaryAudioRef.current.src = '';
      }
      
      if (crossfadeTimerRef.current) {
        clearTimeout(crossfadeTimerRef.current);
      }
      
      if (loopCheckIntervalRef.current) {
        clearInterval(loopCheckIntervalRef.current);
      }
    };
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    if (primaryAudioRef.current) {
      primaryAudioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Set up continuous playback monitoring
  useEffect(() => {
    if (isPlaying) {
      startContinuousPlayback();
    } else {
      stopContinuousPlayback();
    }
    
    return () => {
      stopContinuousPlayback();
    };
  }, [isPlaying, currentKey]);
  
  // Function to start continuous playback with seamless looping
  const startContinuousPlayback = (): void => {
    const audio = primaryAudioRef.current;
    
    if (!audio) return;
    
    // Load the current key's audio file
    audio.src = currentKey.file;
    audio.volume = volume;
    audio.play().catch(err => console.error("Error playing audio:", err));
    
    // Set up the loop check interval
    loopCheckIntervalRef.current = window.setInterval(() => {
      // If there's no duration yet (audio not loaded) or audio not playing, skip this check
      if (!audio.duration || audio.paused) return;
      
      // If less than 5 seconds remaining before the end of the audio
      const timeRemaining = audio.duration - audio.currentTime;
      
      // When we're approaching the end of the track (5 seconds before end)
      if (timeRemaining < 5 && timeRemaining > 0) {
        // Prepare the secondary audio for crossfade
        const secondary = secondaryAudioRef.current;
        if (!secondary) return;
        
        secondary.src = currentKey.file;
        secondary.volume = 0;
        
        // Start playing from the beginning with a little buffer
        // We start from 0.5 seconds in to avoid any initial silence
        secondary.currentTime = 0.5;
        secondary.play().catch(err => console.error("Error playing secondary audio:", err));
        
        // Start crossfade process
        crossfade();
      }
    }, 1000); // Check every second
  };
  
  // Function to handle crossfade between audio elements
  const crossfade = (): void => {
    const primary = primaryAudioRef.current;
    const secondary = secondaryAudioRef.current;
    
    if (!primary || !secondary) return;
    
    // Duration of the crossfade in milliseconds
    const crossfadeDuration = 3000;
    const stepTime = 50; // Update every 50ms
    const steps = crossfadeDuration / stepTime;
    const volumeStep = volume / steps;
    
    let step = 0;
    
    // Start crossfade process
    const fadeInterval = window.setInterval(() => {
      step++;
      
      // Gradually decrease volume of primary audio
      primary.volume = Math.max(0, volume - (step * volumeStep));
      
      // Gradually increase volume of secondary audio
      secondary.volume = Math.min(volume, step * volumeStep);
      
      // When crossfade is complete
      if (step >= steps) {
        clearInterval(fadeInterval);
        
        // Stop the primary audio
        primary.pause();
        
        // Swap the audio references
        const temp = primaryAudioRef.current;
        primaryAudioRef.current = secondaryAudioRef.current;
        secondaryAudioRef.current = temp;
      }
    }, stepTime);
  };
  
  // Function to stop all playback
  const stopContinuousPlayback = (): void => {
    if (primaryAudioRef.current) {
      primaryAudioRef.current.pause();
    }
    
    if (secondaryAudioRef.current) {
      secondaryAudioRef.current.pause();
    }
    
    if (loopCheckIntervalRef.current) {
      clearInterval(loopCheckIntervalRef.current);
      loopCheckIntervalRef.current = null;
    }
    
    if (crossfadeTimerRef.current) {
      clearTimeout(crossfadeTimerRef.current);
      crossfadeTimerRef.current = null;
    }
  };
  
  // Toggle play/pause
  const togglePlay = async (): Promise<void> => {
    if (!isPlaying) {
      // Ensure we have a fresh start
      if (primaryAudioRef.current) {
        primaryAudioRef.current.currentTime = 0;
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };
  
  // Change the key of the pad
  const changeKey = (key: KeyType): void => {
    if (key.name === currentKey.name) return;
    
    // If currently playing, perform a smooth transition
    if (isPlaying && primaryAudioRef.current) {
      // First, fade out the current audio
      const fadeOutSteps = 20;
      const fadeOutDuration = 1000; // 1 second fade out
      const stepTime = fadeOutDuration / fadeOutSteps;
      const volumeStep = volume / fadeOutSteps;
      
      let step = 0;
      const fadeOutInterval = window.setInterval(() => {
        step++;
        if (primaryAudioRef.current) {
          primaryAudioRef.current.volume = Math.max(0, volume - (step * volumeStep));
        }
        
        // When fade out is complete
        if (step >= fadeOutSteps) {
          clearInterval(fadeOutInterval);
          
          // Change to the new key
          setCurrentKey(key);
          
          // Short delay before starting the new key
          crossfadeTimerRef.current = window.setTimeout(() => {
            if (primaryAudioRef.current) {
              primaryAudioRef.current.src = key.file;
              primaryAudioRef.current.volume = 0;
              primaryAudioRef.current.play().catch(err => console.error("Error playing new key audio:", err));
              
              // Fade in the new audio
              let fadeInStep = 0;
              const fadeInInterval = window.setInterval(() => {
                fadeInStep++;
                if (primaryAudioRef.current) {
                  primaryAudioRef.current.volume = Math.min(volume, fadeInStep * volumeStep);
                }
                
                if (fadeInStep >= fadeOutSteps) {
                  clearInterval(fadeInInterval);
                }
              }, stepTime);
            }
          }, 100);
        }
      }, stepTime);
    } else {
      // If not playing, just update the current key
      setCurrentKey(key);
    }
  };

  const bgColor = theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface';
  const textColor = theme === 'dark' ? 'text-dark-text' : 'text-light-text';
  const mutedColor = theme === 'dark' ? 'text-dark-muted' : 'text-light-muted';
  const primaryColor = theme === 'dark' ? 'text-dark-primary' : 'text-light-primary';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('pad.title')}</h1>
      
      <div className={`${bgColor} rounded-lg p-8 mb-8`}>
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center space-x-4">
            <Music className={primaryColor + " w-8 h-8"} />
            <span className={`text-2xl font-semibold ${textColor}`}>
              {t('pad.currentKey')}: {currentKey.label} ({currentKey.name})
            </span>
          </div>
          
          <button
            onClick={togglePlay}
            className={`w-24 h-24 rounded-full ${theme === 'dark' ? 'bg-dark-primary' : 'bg-light-primary'} 
              hover:opacity-90 flex items-center justify-center transition-all transform hover:scale-105`}
          >
            {isPlaying ? (
              <Pause className="w-12 h-12 text-white" />
            ) : (
              <Play className="w-12 h-12 text-white" />
            )}
          </button>
          
          <div className="w-full max-w-md">
            <div className="flex items-center space-x-4">
              <VolumeX className={mutedColor + " w-6 h-6"} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <Volume2 className={mutedColor + " w-6 h-6"} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8">
        {KEYS.map((key) => (
          <button
            key={key.name}
            onClick={() => changeKey(key)}
            className={`p-4 rounded-lg transition-colors ${
              currentKey.name === key.name
                ? theme === 'dark' ? 'bg-dark-primary text-white' : 'bg-light-primary text-white'
                : `${bgColor} hover:opacity-80`
            }`}
          >
            <div className="text-lg font-semibold">{key.label}</div>
            <div className="text-sm opacity-75">{key.name}</div>
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${bgColor} rounded-lg p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('pad.howTo.title')}</h2>
          <ul className={`space-y-2 ${mutedColor}`}>
            <li>• {t('pad.howTo.select')}</li>
            <li>• {t('pad.howTo.play')}</li>
            <li>• {t('pad.howTo.volume')}</li>
            <li>• {t('pad.howTo.change')}</li>
          </ul>
        </div>
        
        <div className={`${bgColor} rounded-lg p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('pad.tips.title')}</h2>
          <ul className={`space-y-2 ${mutedColor}`}>
            <li>• {t('pad.tips.key')}</li>
            <li>• {t('pad.tips.volume')}</li>
            <li>• {t('pad.tips.prayer')}</li>
            <li>• {t('pad.tips.transition')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}