import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Play, Pause, Minus, Plus } from 'lucide-react';

const SOUNDS = [
  { id: 'default', name: 'Default Click', note: 'A5' },
  { id: 'snare', name: 'Snare Drum', note: 'D3' },
  { id: 'kick', name: 'Bass Drum', note: 'C2' },
  { id: 'crash', name: 'Crash Cymbal', note: 'A#4' }
];

export default function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [count, setCount] = useState(1);
  const [selectedSound, setSelectedSound] = useState(SOUNDS[0]);
  const timerRef = useRef<number | null>(null);
  const clickRef = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    const synthSettings = {
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    };

    if (selectedSound.id === 'snare') {
      synthSettings.envelope.decay = 0.2;
    } else if (selectedSound.id === 'kick') {
      synthSettings.envelope.decay = 0.3;
    } else if (selectedSound.id === 'crash') {
      synthSettings.envelope.decay = 1;
    }

    clickRef.current = new Tone.Synth(synthSettings).toDestination();
    clickRef.current.volume.value = -10;

    return () => {
      clickRef.current?.dispose();
    };
  }, [selectedSound]);

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.bpm.value = bpm;
      timerRef.current = window.setInterval(() => {
        clickRef.current?.triggerAttackRelease(selectedSound.note, '32n');
        setCount((prev) => (prev % 4) + 1);
      }, (60 / bpm) * 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, bpm, selectedSound]);

  const togglePlay = async () => {
    await Tone.start();
    setIsPlaying(!isPlaying);
  };

  const adjustBpm = (amount: number) => {
    setBpm((prev) => Math.min(Math.max(prev + amount, 40), 220));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-center">Metronome</h1>
      
      <div className="bg-gray-800 rounded-lg p-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-6xl font-bold text-purple-400 animate-pulse-slow">
            {bpm} <span className="text-2xl text-gray-400">BPM</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-md mb-4">
            {SOUNDS.map((sound) => (
              <button
                key={sound.id}
                onClick={() => setSelectedSound(sound)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedSound.id === sound.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {sound.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => adjustBpm(-1)}
              className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-transform hover:scale-105"
            >
              <Minus className="w-6 h-6" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center transition-all transform hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10" />
              ) : (
                <Play className="w-10 h-10" />
              )}
            </button>
            
            <button
              onClick={() => adjustBpm(1)}
              className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-transform hover:scale-105"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((beat) => (
              <div
                key={beat}
                className={`w-4 h-4 rounded-full transition-colors ${
                  count === beat ? 'bg-purple-400 scale-125' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Common Tempos</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setBpm(60)}
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              Slow (60 BPM)
            </button>
            <button
              onClick={() => setBpm(90)}
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              Moderate (90 BPM)
            </button>
            <button
              onClick={() => setBpm(120)}
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              Fast (120 BPM)
            </button>
            <button
              onClick={() => setBpm(140)}
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              Very Fast (140 BPM)
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tips</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Choose your preferred sound</li>
            <li>• Practice with headphones</li>
            <li>• Start slower than needed</li>
            <li>• Use visual beat indicator</li>
          </ul>
        </div>
      </div>
    </div>
  );
}