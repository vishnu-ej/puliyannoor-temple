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
      masterGain.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 2.0);
      masterGain.connect(ctx.destination);

      // --- 1. Light, Atmospheric Tanpura / Shruti Box Drone in Background ---
      const shrutiGain = ctx.createGain();
      shrutiGain.gain.setValueAtTime(0.001, ctx.currentTime);
      shrutiGain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 2.5); // Soft and light
      shrutiGain.connect(masterGain);

      // 136.1 Hz is the sacred cosmic Om tuning (C#3)
      const baseSa = 136.1;
      const pa = 204.15; // Fifth (Pa)
      const highSa = 272.2; // Octave Sa
      const kharajSa = 68.05; // Deep lower Sa

      const shrutiTones = [
        { freq: kharajSa, type: 'sine' as OscillatorType, vol: 0.035 },
        { freq: baseSa, type: 'triangle' as OscillatorType, vol: 0.04 },
        { freq: pa, type: 'sine' as OscillatorType, vol: 0.025 },
        { freq: highSa, type: 'sine' as OscillatorType, vol: 0.015 },
      ];

      // Subtle slow breath LFO for tanpura undulating resonance
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.2, ctx.currentTime);
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
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(shrutiGain);
        osc.start();
      });

      // --- 2. Sacred Crisp & Resonant "Ohm" (ॐ) Vocal Chanting ---
      // Sanctum Sanctorum Ambient Delay/Echo
      const delay = ctx.createDelay();
      const delayFeedback = ctx.createGain();
      const delayFilter = ctx.createBiquadFilter();

      delay.delayTime.setValueAtTime(0.28, ctx.currentTime);
      delayFeedback.gain.setValueAtTime(0.32, ctx.currentTime);
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1800, ctx.currentTime);

      delay.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(delay);
      delayFilter.connect(masterGain);

      const chantOhm = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        const chantCtx = audioContextRef.current;
        const now = chantCtx.currentTime;
        const chantDuration = 7.5; // Each Ohm cycle lasts 7.5s

        // Vocal Master Voice Gain
        const vocalGain = chantCtx.createGain();
        vocalGain.gain.setValueAtTime(0.0001, now);
        vocalGain.gain.exponentialRampToValueAtTime(0.28, now + 1.5); // Crisp, prominent level
        vocalGain.gain.setValueAtTime(0.28, now + 4.8);
        vocalGain.gain.exponentialRampToValueAtTime(0.0001, now + chantDuration);

        // Vocal Vibrato LFO (5.2 Hz gentle human vibrato)
        const vibrato = chantCtx.createOscillator();
        const vibratoGain = chantCtx.createGain();
        vibrato.frequency.setValueAtTime(5.2, now);
        vibratoGain.gain.setValueAtTime(0.5, now);
        vibrato.connect(vibratoGain);
        vibrato.start(now);
        vibrato.stop(now + chantDuration);

        // 1. Primary Voice Generator (Sawtooth + subtle slide)
        const voiceOsc1 = chantCtx.createOscillator();
        voiceOsc1.type = 'sawtooth';
        voiceOsc1.frequency.setValueAtTime(136.1, now);
        voiceOsc1.frequency.linearRampToValueAtTime(135.2, now + chantDuration);
        vibratoGain.connect(voiceOsc1.frequency);

        // 2. Warm Body Sub-Voice (Triangle at fundamental)
        const voiceOsc2 = chantCtx.createOscillator();
        voiceOsc2.type = 'triangle';
        voiceOsc2.frequency.setValueAtTime(136.1, now);
        voiceOsc2.frequency.linearRampToValueAtTime(135.2, now + chantDuration);
        vibratoGain.connect(voiceOsc2.frequency);

        // Formant 1: Throat/Pharyngeal Tract (A -> U -> M vowel shaping)
        const formant1 = chantCtx.createBiquadFilter();
        formant1.type = 'bandpass';
        formant1.Q.setValueAtTime(4.8, now);
        formant1.frequency.setValueAtTime(750, now); // 'Aaa' (750 Hz)
        formant1.frequency.exponentialRampToValueAtTime(420, now + 2.8); // 'Ooo' (420 Hz)
        formant1.frequency.exponentialRampToValueAtTime(240, now + 5.2); // 'Mmm' (240 Hz)

        // Formant 2: Oral/Palatal Resonance
        const formant2 = chantCtx.createBiquadFilter();
        formant2.type = 'bandpass';
        formant2.Q.setValueAtTime(5.5, now);
        formant2.frequency.setValueAtTime(1250, now);
        formant2.frequency.exponentialRampToValueAtTime(800, now + 2.8);
        formant2.frequency.exponentialRampToValueAtTime(480, now + 5.2);

        // Formant 3: Crisp Vocal Presence & Overtones (High-definition clarity)
        const formant3 = chantCtx.createBiquadFilter();
        const f3Gain = chantCtx.createGain();
        formant3.type = 'bandpass';
        formant3.Q.setValueAtTime(4.2, now);
        formant3.frequency.setValueAtTime(2800, now); // Crisp presence
        formant3.frequency.exponentialRampToValueAtTime(2000, now + 3.0);
        formant3.frequency.exponentialRampToValueAtTime(1200, now + 5.2);
        f3Gain.gain.setValueAtTime(0.4, now);

        // Route oscillators through formant filters
        voiceOsc1.connect(formant1);
        voiceOsc1.connect(formant2);
        voiceOsc1.connect(formant3);

        voiceOsc2.connect(formant1);
        voiceOsc2.connect(formant2);

        formant1.connect(vocalGain);
        formant2.connect(vocalGain);
        formant3.connect(f3Gain);
        f3Gain.connect(vocalGain);

        // Direct output + Sanctum Sanctorum reverb delay routing
        vocalGain.connect(masterGain);
        vocalGain.connect(delay);

        voiceOsc1.start(now);
        voiceOsc2.start(now);
        voiceOsc1.stop(now + chantDuration + 0.1);
        voiceOsc2.stop(now + chantDuration + 0.1);
      };

      // Start initial Ohm chant after 0.5s, then repeat every 8.5s
      setTimeout(chantOhm, 500);
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
