
'use client'

import React from "react";
import { SplineScene } from "./ui/splite";
import { Card } from "./ui/card";
import { Spotlight } from "./ui/spotlight";
import { LanguageCode } from "../types";
import { TRANSLATIONS } from "../translations";
 
interface SplineSceneBasicProps {
  language: LanguageCode;
}

export function SplineSceneBasic({ language }: SplineSceneBasicProps) {
  const t = TRANSLATIONS[language];
  
  return (
    <Card className="w-full h-[400px] md:h-[500px] bg-slate-950 relative overflow-hidden border-slate-800 mb-12 shadow-2xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
            Metabolic Digital Twin
          </h2>
          <p className="mt-6 text-neutral-400 max-w-lg text-lg leading-relaxed">
            {t.slogan}. Visualize your biological state through a high-fidelity human digital simulation.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              Live Neural Link
            </div>
            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              Active Sync
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative h-[300px] md:h-full">
          <SplineScene 
            scene="https://prod.spline.design/6Wq1Q7YAncaZuOXh/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
