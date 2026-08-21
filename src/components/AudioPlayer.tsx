'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AudioPlayer: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorGroupRef = useRef<{ [key: string]: any }>({});
  const intervalRef = useRef<any>(null);

  // Initialize or toggle sound
  const toggleAudio = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
  };

  const startSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Create a master gain node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Create warm drone oscillators (Om root note C# / 136.1 Hz frequency)
      const fundamental = 136.1; // Sacred Om / Earth frequency
      const freqs = [fundamental, fundamental * 1.5, fundamental * 2, fundamental * 3];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const volume = 0.08 / (idx + 1);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 3);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();

        oscillatorGroupRef.current[`drone_${idx}`] = { osc, gain };
      });

      // Periodic gentle temple bell chime (every 6 seconds)
      const playBell = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        const bellCtx = audioContextRef.current;
        const now = bellCtx.currentTime;

        const bellOsc = bellCtx.createOscillator();
        const bellGain = bellCtx.createGain();

        bellOsc.type = 'sine';
        // High harmonic temple bell tone
        bellOsc.frequency.setValueAtTime(1088, now);
        bellOsc.frequency.exponentialRampToValueAtTime(544, now + 2.5);

        bellGain.gain.setValueAtTime(0.09, now);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        bellOsc.connect(bellGain);
        bellGain.connect(masterGain);

        bellOsc.start(now);
        bellOsc.stop(now + 3.1);
      };

      // First bell after 1 second, then periodic
      setTimeout(playBell, 1000);
      intervalRef.current = setInterval(playBell, 7000);

      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  const stopSound = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (err) {}
      audioContextRef.current = null;
    }
    oscillatorGroupRef.current = {};
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none border ${
        isPlaying
          ? 'bg-[#C99738] text-[#1A0409] border-[#E6BE65] shadow-md shadow-[#C99738]/20 animate-pulse-glow'
          : 'bg-[#FAF5E8]/80 hover:bg-[#FAF5E8] text-[#610C1B] border-[#E4D5AE] hover:border-[#C99738]'
      }`}
      title={isPlaying ? t('audio_pause') : t('audio_play')}
      aria-label={isPlaying ? t('audio_pause') : t('audio_play')}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 animate-bounce text-[#1A0409]" />
          <span className="font-semibold">{t('audio_title')}</span>
          {/* Animated sound wave bars */}
          <span className="flex items-center gap-0.5 ml-1">
            <span className="w-1 h-3 bg-[#1A0409] rounded-full animate-pulse" />
            <span className="w-1 h-4 bg-[#1A0409] rounded-full animate-pulse delay-75" />
            <span className="w-1 h-2 bg-[#1A0409] rounded-full animate-pulse delay-150" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#8C6219]" />
          <span className="font-medium">{t('audio_title')}</span>
        </>
      )}
    </button>
  );
};
