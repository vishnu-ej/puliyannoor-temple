'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AudioPlayer: React.FC = () => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);

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

      // Master Gain for smooth volume control
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 2.5);
      masterGain.connect(ctx.destination);

      // --- 1. Pure Tanpura / Shruti Box Drone (Sa - Pa - Sa' - Kharaj) ---
      // 136.1 Hz is the sacred Indian Classical Sadharana Gandhara / cosmic Om tuning (C#3)
      const baseSa = 136.1;
      const pa = 204.15; // Fifth (Pa)
      const highSa = 272.2; // Octave Sa
      const kharajSa = 68.05; // Deep lower Sa

      const shrutiTones = [
        { freq: kharajSa, type: 'sine' as OscillatorType, vol: 0.12 },
        { freq: baseSa, type: 'triangle' as OscillatorType, vol: 0.14 },
        { freq: pa, type: 'sine' as OscillatorType, vol: 0.09 },
        { freq: highSa, type: 'sine' as OscillatorType, vol: 0.05 },
      ];

      // Subtle LFO for natural tanpura undulating resonance
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.25, ctx.currentTime); // 0.25 Hz slow breath cycle
      lfoGain.gain.setValueAtTime(1.8, ctx.currentTime);
      lfo.connect(lfoGain);
      lfo.start();

      shrutiTones.forEach(({ freq, type, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        lfoGain.connect(osc.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start();
      });

      // --- 2. Sacred Deep "Ohm" (ॐ) Chanting Synthesis ---
      const chantOhm = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        const chantCtx = audioContextRef.current;
        const now = chantCtx.currentTime;
        const chantDuration = 7.5; // Each Ohm cycle lasts 7.5s

        // Voice Oscillator 1 (Vocal fundamental ~136.1 Hz)
        const voiceOsc1 = chantCtx.createOscillator();
        voiceOsc1.type = 'sawtooth';
        voiceOsc1.frequency.setValueAtTime(136.1, now);
        // Gentle downward vocal slide as chant settles into Mmm sound
        voiceOsc1.frequency.linearRampToValueAtTime(135.2, now + chantDuration);

        // Formant Filter 1 (Vocal vowel shaping A -> U -> M)
        const formant1 = chantCtx.createBiquadFilter();
        formant1.type = 'bandpass';
        formant1.Q.setValueAtTime(4.0, now);
        // Starts at 'Ah' (700Hz) -> shifts to 'Oo' (380Hz) -> settles in 'Mmm' (220Hz)
        formant1.frequency.setValueAtTime(650, now);
        formant1.frequency.exponentialRampToValueAtTime(380, now + 3.0);
        formant1.frequency.exponentialRampToValueAtTime(220, now + 5.5);

        // Formant Filter 2 (Higher nasal resonance)
        const formant2 = chantCtx.createBiquadFilter();
        formant2.type = 'bandpass';
        formant2.Q.setValueAtTime(5.0, now);
        formant2.frequency.setValueAtTime(1100, now);
        formant2.frequency.exponentialRampToValueAtTime(750, now + 3.2);
        formant2.frequency.exponentialRampToValueAtTime(450, now + 5.5);

        // Voice Gain Envelope (Gentle fade in, sustain, long meditative fade out)
        const voiceGain = chantCtx.createGain();
        voiceGain.gain.setValueAtTime(0.0001, now);
        voiceGain.gain.exponentialRampToValueAtTime(0.16, now + 1.8);
        voiceGain.gain.setValueAtTime(0.16, now + 4.5);
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + chantDuration);

        // Parallel routing through formants
        voiceOsc1.connect(formant1);
        voiceOsc1.connect(formant2);
        formant1.connect(voiceGain);
        formant2.connect(voiceGain);
        voiceGain.connect(masterGain);

        voiceOsc1.start(now);
        voiceOsc1.stop(now + chantDuration + 0.1);
      };

      // Start initial Ohm chant after 0.8s, then repeat continuously every 8.5s
      setTimeout(chantOhm, 800);
      intervalRef.current = setInterval(chantOhm, 8500);

      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio synthesis error:', e);
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
          <Volume2 className="w-3.5 h-3.5 text-[#1A0409] animate-bounce" />
          <span className="font-semibold">{language === 'en' ? 'Ohm Chant' : 'ഓം മന്ത്രം'}</span>
          <span className="flex items-center gap-0.5 ml-0.5">
            <span className="w-1 h-3 bg-[#1A0409] rounded-full animate-pulse" />
            <span className="w-1 h-4 bg-[#1A0409] rounded-full animate-pulse delay-75" />
            <span className="w-1 h-2 bg-[#1A0409] rounded-full animate-pulse delay-150" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#8C6219]" />
          <span className="font-medium">{language === 'en' ? 'Ohm Chant' : 'ഓം മന്ത്രം'}</span>
        </>
      )}
    </button>
  );
};
