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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loopCheckIntervalRef = useRef<number | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = false; // We'll handle looping manually
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      clearLoopCheck();
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle play/pause and key changes
  useEffect(() => {
    if (isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
    
    return () => {
      stopPlayback();
    };
  }, [isPlaying, currentKey]);

  const startPlayback = async () => {
    if (!audioRef.current) return;
    
    try {
      audioRef.current.src = currentKey.file;
      audioRef.current.currentTime = 10; // Start at 10 seconds to have buffer
      await audioRef.current.play();
      
      // Start checking for loop point
      setupLoopCheck();
    } catch (err) {
      console.error("Error starting playback:", err);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    clearLoopCheck();
  };

  const setupLoopCheck = () => {
    clearLoopCheck();
    
    loopCheckIntervalRef.current = window.setInterval(() => {
      if (!audioRef.current || !audioRef.current.duration) return;
      
      // Calculate remaining time (with 2 second buffer)
      const remaining = audioRef.current.duration - audioRef.current.currentTime;
      
      // If we're within 10 seconds of the end, jump back to 10 seconds
      if (remaining < 10) {
        // Smooth transition by fading out and in quickly
        fadeAudio(0.3, () => {
          if (audioRef.current) {
            audioRef.current.currentTime = 10;
            fadeAudio(volume);
          }
        });
      }
    }, 500); // Check every 500ms
  };

  const clearLoopCheck = () => {
    if (loopCheckIntervalRef.current) {
      clearInterval(loopCheckIntervalRef.current);
      loopCheckIntervalRef.current = null;
    }
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeAudio = (targetVolume: number, callback?: () => void) => {
    if (!audioRef.current) return;
    
    const initialVolume = audioRef.current.volume;
    const duration = 300; // 300ms fade duration
    const steps = 10;
    const stepTime = duration / steps;
    const volumeStep = (targetVolume - initialVolume) / steps;
    
    let step = 0;
    
    clearInterval(fadeIntervalRef.current!);
    
    fadeIntervalRef.current = window.setInterval(() => {
      step++;
      
      if (audioRef.current) {
        audioRef.current.volume = initialVolume + (step * volumeStep);
      }
      
      if (step >= steps) {
        clearInterval(fadeIntervalRef.current!);
        if (callback) callback();
      }
    }, stepTime);
  };

  const togglePlay = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const changeKey = (key: KeyType) => {
    if (key.name === currentKey.name) return;
    
    // Fade out current audio before changing key
    fadeAudio(0, () => {
      setCurrentKey(key);
      if (isPlaying && audioRef.current) {
        audioRef.current.src = key.file;
        audioRef.current.currentTime = 10;
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
          fadeAudio(volume);
        });
      }
    });
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