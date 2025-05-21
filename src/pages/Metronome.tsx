import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Play, Pause, Minus, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SOUNDS = [
  { id: 'default', name: 'Default Click', note: 'A5' },
  { id: 'snare', name: 'Snare Drum', note: 'D3' },
  { id: 'kick', name: 'Bass Drum', note: 'C2' },
  { id: 'crash', name: 'Crash Cymbal', note: 'A#4' }
];

// Tipos de compasso disponíveis
const TIME_SIGNATURES = [
  { id: '2/4', name: 'Binário (2/4)', beats: 2, accentPattern: [1, 0] },
  { id: '3/4', name: 'Ternário (3/4)', beats: 3, accentPattern: [1, 0, 0] },
  { id: '4/4', name: 'Quaternário (4/4)', beats: 4, accentPattern: [1, 0, 0, 0] }
];

// Função para transpor uma nota para cima
const transposeNoteUp = (note: string): string => {
  // Extrai a letra da nota e o número da oitava
  const noteLetter = note.charAt(0);
  const accidental = note.includes('#') ? '#' : (note.includes('b') ? 'b' : '');
  const octave = parseInt(note.charAt(note.length - 1));
  
  // Retorna a mesma nota uma oitava acima
  return `${noteLetter}${accidental}${octave + 1}`;
};

export default function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [count, setCount] = useState(1);
  const [selectedSound, setSelectedSound] = useState(SOUNDS[0]);
  const [selectedTimeSignature, setSelectedTimeSignature] = useState(TIME_SIGNATURES[2]); // Padrão 4/4
  
  const clickRef = useRef<Tone.Synth | null>(null);
  const accentRef = useRef<Tone.Synth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  // Inicializa os sintetizadores
  useEffect(() => {
    // Som principal (mais agudo para o primeiro tempo)
    accentRef.current = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();
    accentRef.current.volume.value = -5;

    // Som secundário (para os outros tempos)
    clickRef.current = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();
    clickRef.current.volume.value = -10;

    return () => {
      clickRef.current?.dispose();
      accentRef.current?.dispose();
      loopRef.current?.dispose();
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  // Ajusta os sons conforme seleção
  useEffect(() => {
    if (selectedSound.id === 'snare') {
      accentRef.current?.envelope.set({ decay: 0.2 });
      clickRef.current?.envelope.set({ decay: 0.2 });
    } else if (selectedSound.id === 'kick') {
      accentRef.current?.envelope.set({ decay: 0.3 });
      clickRef.current?.envelope.set({ decay: 0.3 });
    } else if (selectedSound.id === 'crash') {
      accentRef.current?.envelope.set({ decay: 1 });
      clickRef.current?.envelope.set({ decay: 1 });
    } else {
      accentRef.current?.envelope.set({ decay: 0.1 });
      clickRef.current?.envelope.set({ decay: 0.1 });
    }
  }, [selectedSound]);

  // Configura o loop do metrônomo utilizando o sistema de agendamento do Tone.js
  useEffect(() => {
    if (loopRef.current) {
      loopRef.current.dispose();
    }

    let currentBeat = 0;
    
    // Criando um novo loop
    loopRef.current = new Tone.Loop((time) => {
      // Incrementa a batida atual
      currentBeat = (currentBeat + 1) % selectedTimeSignature.beats;
      const displayBeat = currentBeat + 1;
      
      // Atualiza o contador visual no próximo frame de animação
      Tone.Draw.schedule(() => {
        setCount(displayBeat);
      }, time);
      
      // Toca o som apropriado:
      // - Acento no primeiro tempo
      // - Som mais agudo no último tempo
      // - Som normal nos demais tempos
      if (currentBeat === 0) {
        // Primeiro tempo - acento normal
        accentRef.current?.triggerAttackRelease(selectedSound.note, '32n', time);
      } else if (currentBeat === selectedTimeSignature.beats - 1) {
        // Último tempo - som mais agudo (uma oitava acima)
        const lastBeatNote = transposeNoteUp(selectedSound.note);
        accentRef.current?.triggerAttackRelease(lastBeatNote, '32n', time);
      } else {
        // Tempos intermediários - som normal
        clickRef.current?.triggerAttackRelease(selectedSound.note, '32n', time);
      }
    }, "4n").start(0); // A duração "4n" significa uma semínima, que é ajustada pelo BPM global

    return () => {
      if (loopRef.current) {
        loopRef.current.dispose();
      }
    };
  }, [selectedTimeSignature, selectedSound]);

  // Controla a reprodução e o BPM
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
    
    if (isPlaying) {
      if (Tone.Transport.state !== "started") {
        Tone.Transport.start();
      }
    } else {
      Tone.Transport.pause();
      // Reseta o contador quando parado
      setCount(1);
    }
    
    return () => {
      // Cleanup apenas quando o componente é desmontado
      if (isPlaying) {
        Tone.Transport.pause();
      }
    };
  }, [isPlaying, bpm]);

  const togglePlay = async () => {
    // Certifique-se de que o contexto de áudio está iniciado
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    setIsPlaying(!isPlaying);
  };

  const adjustBpm = (amount: number) => {
    setBpm(prev => Math.min(Math.max(prev + amount, 40), 220));
  };

  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('metronome.title')}</h1>
      
      <div className="bg-white shadow dark:bg-gray-800 rounded-lg p-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-6xl font-bold text-purple-400 animate-pulse-slow">
            {bpm} <span className="text-2xl text-gray-400">BPM</span>
          </div>
          
          {/* Seleção de som */}
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-md mb-4">
            {SOUNDS.map((sound) => (
              <button
                key={sound.id}
                onClick={() => setSelectedSound(sound)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedSound.id === sound.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white dark:text-gray-400'
                }`}
              >
                {sound.name}
              </button>
            ))}
          </div>
          
          {/* Seleção de compasso */}
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-md mb-4">
            {TIME_SIGNATURES.map((signature) => (
              <button
                key={signature.id}
                onClick={() => setSelectedTimeSignature(signature)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedTimeSignature.id === signature.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white dark:text-gray-400'
                }`}
              >
                {signature.name}
              </button>
            ))}
          </div>
          
          {/* Controles principais */}
          <div className="flex items-center space-x-4 text-white dark:text-gray-400">
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
          
          {/* Indicador visual dos tempos */}
          <div className="flex space-x-4">
            {Array.from({ length: selectedTimeSignature.beats }).map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-colors ${
                  count === index + 1 
                    ? index === 0 
                      ? 'bg-purple-400 scale-125' 
                      : index === selectedTimeSignature.beats - 1 
                        ? 'bg-green-400 scale-125' 
                        : 'bg-blue-400 scale-125'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Tempos comuns e dicas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t('metronome.commonTempos')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setBpm(60)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('metronome.slow')} (60 BPM)
            </button>
            <button
              onClick={() => setBpm(90)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('metronome.moderate')} (90 BPM)
            </button>
            <button
              onClick={() => setBpm(120)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('metronome.fast')} (120 BPM)
            </button>
            <button
              onClick={() => setBpm(140)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('metronome.veryFast')} (140 BPM)
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tips</h2>
          <ul className="space-y-2 text-gray-500 dark:text-gray-300">
            <li>• {t('metronome.tips.sound')}</li>
            <li>• {t('metronome.tips.headphones')}</li>
            <li>• {t('metronome.tips.slower')}</li>
            <li>• {t('metronome.tips.visual')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}