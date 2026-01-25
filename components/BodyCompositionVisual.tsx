
'use client'

import React, { useMemo } from 'react';
import { Card } from './ui/card';
import { Spotlight } from './ui/spotlight';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../translations';

interface BodyCompositionVisualProps {
  weight: number;
  height: number;
  gender: string;
  age: number;
  language: LanguageCode;
}

export function BodyCompositionVisual({ weight, height, gender, age, language }: BodyCompositionVisualProps) {
  const t = TRANSLATIONS[language];
  const isRTL = language === 'ar' || language === 'fa';

  const bmi = useMemo(() => {
    const heightInMeters = height / 100;
    if (heightInMeters === 0) return 0;
    return weight / (heightInMeters * heightInMeters);
  }, [weight, height]);

  const status = useMemo(() => {
    if (bmi < 18.5) return { label: t.bmiUnderweight, color: 'text-blue-400', bg: 'bg-blue-400', position: 'left-[10%]' };
    if (bmi < 25) return { label: t.bmiNormal, color: 'text-emerald-400', bg: 'bg-emerald-400', position: 'left-[40%]' };
    if (bmi < 30) return { label: t.bmiOverweight, color: 'text-amber-400', bg: 'bg-amber-400', position: 'left-[70%]' };
    return { label: t.bmiObese, color: 'text-rose-500', bg: 'bg-rose-500', position: 'left-[90%]' };
  }, [bmi, t]);

  // Marker calculation for visual positioning (clamped between 0-100%)
  // BMI range roughly 10 to 40 for the visual scale
  const markerPosition = useMemo(() => {
    const min = 10;
    const max = 40;
    const percent = ((bmi - min) / (max - min)) * 100;
    return Math.min(Math.max(percent, 0), 100);
  }, [bmi]);

  return (
    <Card className="w-full bg-slate-950 relative overflow-hidden border-slate-800 mb-12 shadow-2xl p-8 md:p-12">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        {/* Left Side: Text & Score */}
        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
            {t.bmiTitle}
          </h2>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl md:text-8xl font-black text-white">
              {bmi.toFixed(1)}
            </span>
            <span className="text-xl font-bold text-slate-500 uppercase tracking-widest">
              {t.bmiScore}
            </span>
          </div>
          <div className={`inline-flex px-6 py-2 rounded-2xl border-2 font-black text-xl uppercase tracking-widest ${status.color} border-current bg-white/5`}>
            {status.label}
          </div>
          <p className="mt-8 text-neutral-400 max-w-md text-lg leading-relaxed">
            {t.appTitle} logic uses this core biological metric to adapt your caloric requirements and performance recommendations.
          </p>
        </div>

        {/* Right Side: Visual Gauge */}
        <div className="flex-1 w-full max-w-xl">
          <div className="relative h-24 mb-12">
            {/* The Bar */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 bg-slate-900 rounded-full flex overflow-hidden border-2 border-slate-800">
               <div className="h-full bg-blue-500/80" style={{ width: '25%' }}></div>
               <div className="h-full bg-emerald-500/80" style={{ width: '25%' }}></div>
               <div className="h-full bg-amber-500/80" style={{ width: '25%' }}></div>
               <div className="h-full bg-rose-600/80" style={{ width: '25%' }}></div>
            </div>

            {/* Labels below the bar */}
            <div className="absolute inset-x-0 top-[75%] flex justify-between px-1 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
              <span>10</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40+</span>
            </div>

            {/* The Marker */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out"
              style={{ left: `${markerPosition}%` }}
            >
              <div className={`w-8 h-8 rounded-full border-4 border-slate-950 shadow-2xl pulse-glow ${status.bg}`}></div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-indigo-500/30"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.gender}</span>
              <span className="text-xl font-black text-white capitalize">{gender === 'male' ? t.male : t.female}</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.age}</span>
              <span className="text-xl font-black text-white">{age} <span className="text-xs text-slate-500">y</span></span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .pulse-glow {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
      `}} />
    </Card>
  );
}
