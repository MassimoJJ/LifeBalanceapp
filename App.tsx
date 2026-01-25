
import React, { useState, useMemo, useEffect } from 'react';
import { DailyLog, LanguageCode, Gender } from './types';
import { calculateDailySummary } from './services/logic';
import { getAIOptimizationTip, generateMetabolicArt } from './services/geminiService';
import PillarCard from './components/PillarCard';
import LogForm from './components/LogForm';
import { BodyCompositionVisual } from './components/BodyCompositionVisual';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TRANSLATIONS } from './translations';

const DEFAULT_LOG: DailyLog = {
  id: 'current-day',
  timestamp: new Date().toISOString(),
  weight: 75,
  height: 180,
  age: 30,
  gender: 'male',
  foodCalories: 0,
  loggedFoods: [],
  loggedActivities: [],
  activityMinutes: 0,
  workHours: 0,
  sleepHours: 8,
  sleepQuality: 3,
  aiOptimizationTip: "",
  language: 'en'
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [metabolicArt, setMetabolicArt] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const t = TRANSLATIONS[language];

  const [log, setLog] = useState<DailyLog>({
    ...DEFAULT_LOG,
    aiOptimizationTip: TRANSLATIONS.en.coachTips.balanced,
    foodCalories: 2150,
    activityMinutes: 45,
    workHours: 7.5
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const summary = useMemo(() => calculateDailySummary(log), [log]);

  const handleUpdateLog = async (data: Partial<DailyLog>) => {
    setIsProcessing(true);
    const updatedLog: DailyLog = { ...log, ...data, language };
    
    try {
      const { tip } = await getAIOptimizationTip(updatedLog, language, isOnlineMode);
      
      if (isOnlineMode) {
        const art = await generateMetabolicArt(summary.status);
        if (art) setMetabolicArt(art);
      } else {
        setMetabolicArt(null);
      }

      setLog({ ...updatedLog, aiOptimizationTip: tip });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetSession = () => {
    if (window.confirm(t.confirmReset)) {
      setLog({ ...DEFAULT_LOG, aiOptimizationTip: t.coachTips.balanced, language });
      setMetabolicArt(null);
      setResetKey(prev => prev + 1); 
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'Balanced') return t.statusBalanced;
    if (status === 'Surplus') return t.statusSurplus;
    return t.statusDeficit;
  };

  const chartData = [
    { name: t.intake, kcal: summary.totalIntake, fill: 'url(#colorIntake)' },
    { name: t.burn, kcal: summary.totalBurn, fill: 'url(#colorBurn)' }
  ];

  const isRTL = language === 'ar' || language === 'fa';

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  ];

  return (
    <div className={`min-h-screen pb-12 transition-all duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${isRTL ? 'rtl font-arabic' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Bio-Profile Header - ENLARGED cockpit row */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-10">
             <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.gender}</span>
                <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                  {(['male', 'female'] as Gender[]).map(g => (
                    <button
                      key={g}
                      onClick={() => handleUpdateLog({ gender: g })}
                      className={`px-6 py-3 rounded-xl text-lg font-black transition-all ${log.gender === g ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                      {g === 'male' ? t.male : t.female}
                    </button>
                  ))}
                </div>
             </div>
             
             <div className="flex flex-col gap-2">
               <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.weight}</label>
               <div className="flex items-baseline gap-2">
                 <input 
                   type="number" 
                   value={log.weight} 
                   onChange={e => handleUpdateLog({ weight: parseFloat(e.target.value) || 0 })}
                   className="w-24 bg-transparent text-3xl font-black text-indigo-600 dark:text-indigo-400 focus:outline-none border-b-4 border-slate-200 dark:border-slate-800 focus:border-indigo-600 transition-colors"
                 />
                 <span className="text-sm font-black text-slate-400 uppercase">kg</span>
               </div>
             </div>

             <div className="flex flex-col gap-2">
               <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.height}</label>
               <div className="flex items-baseline gap-2">
                 <input 
                   type="number" 
                   value={log.height} 
                   onChange={e => handleUpdateLog({ height: parseFloat(e.target.value) || 0 })}
                   className="w-24 bg-transparent text-3xl font-black text-indigo-600 dark:text-indigo-400 focus:outline-none border-b-4 border-slate-200 dark:border-slate-800 focus:border-indigo-600 transition-colors"
                 />
                 <span className="text-sm font-black text-slate-400 uppercase">cm</span>
               </div>
             </div>

             <div className="flex flex-col gap-2">
               <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.age}</label>
               <div className="flex items-baseline gap-2">
                 <input 
                   type="number" 
                   value={log.age} 
                   onChange={e => handleUpdateLog({ age: parseFloat(e.target.value) || 0 })}
                   className="w-20 bg-transparent text-3xl font-black text-indigo-600 dark:text-indigo-400 focus:outline-none border-b-4 border-slate-200 dark:border-slate-800 focus:border-indigo-600 transition-colors"
                 />
                 <span className="text-sm font-black text-slate-400 uppercase">y</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4 bg-indigo-600 dark:bg-indigo-500 px-8 py-5 rounded-[2rem] shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/20 border-b-4 border-indigo-800 dark:border-indigo-400">
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100/70 leading-none mb-1">Biological BMR</span>
               <span className="text-3xl font-black text-white leading-none">{Math.round(summary.bmr)} <span className="text-xs font-medium opacity-70">kcal</span></span>
             </div>
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <header className={`${summary.colorClass} text-white py-12 px-6 shadow-xl transition-colors duration-500`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-2 flex flex-col md:flex-row items-center gap-3">
              {t.appTitle}
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">{t.version}</span>
            </h1>
            <p className="text-white/80 text-lg font-medium">{t.slogan}</p>
          </div>
          <div className="text-center md:text-right bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner min-w-[240px]">
            <span className="block text-xs uppercase tracking-widest font-bold text-white/60 mb-1">{t.energyState}</span>
            <span className="text-4xl font-black tracking-tight">{getStatusText(summary.status)}</span>
            <div className={`mt-2 text-xl font-bold flex items-center gap-2 ${isRTL || 'justify-center'} md:justify-end`}>
              {summary.netResult > 0 ? '+' : ''}{Math.round(summary.netResult)} 
              <span className="text-sm text-white/70">{t.unitKcal}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-8">
        {/* Settings Bar */}
        <div className="mb-8 flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white dark:border-slate-800 inline-flex gap-1 overflow-x-auto max-w-full no-scrollbar">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  language === lang.code 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg scale-105' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="hidden sm:inline">{lang.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-white dark:border-slate-800 shadow-lg hover:scale-105 transition-all"
              title={theme === 'light' ? t.themeDark : t.themeLight}
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

            <button 
              onClick={() => setIsOnlineMode(!isOnlineMode)}
              className={`px-6 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-3 border shadow-lg ${
                isOnlineMode 
                  ? 'bg-indigo-600 text-white border-indigo-400' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-white dark:border-slate-800'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isOnlineMode ? 'bg-green-400 animate-pulse' : 'bg-slate-300'}`}></div>
              {isOnlineMode ? t.modeOnline : t.modeOffline}
            </button>

            <button 
              onClick={handleResetSession}
              className="px-6 py-4 rounded-2xl text-sm font-black bg-white dark:bg-slate-900 text-rose-500 border border-white dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all flex items-center gap-3 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              {t.resetSession}
            </button>
          </div>
        </div>

        {/* Body Composition Visual */}
        <BodyCompositionVisual 
          weight={log.weight} 
          height={log.height} 
          gender={log.gender} 
          age={log.age} 
          language={language} 
        />

        {/* The Four Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <PillarCard 
            title={t.pillarIntake} 
            unit={t.unitKcal} 
            value={Math.round(log.foodCalories)} 
            color="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
          <PillarCard 
            title={t.pillarActivity} 
            unit={t.unitMins} 
            value={log.activityMinutes} 
            color="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
          <PillarCard 
            title={t.pillarMental} 
            unit={t.unitHours} 
            value={log.workHours} 
            color="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
          />
          <PillarCard 
            title={t.pillarRest} 
            unit={t.unitHours} 
            value={log.sleepHours} 
            color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
          />
        </div>

        <LogForm key={resetKey} onSubmit={handleUpdateLog} isLoading={isProcessing} language={language} />

        {/* Enhanced Daily Flux & AI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 mt-16">
          {/* Energy Flux Chart Section */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <svg className="w-32 h-32" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" /></svg>
            </div>
            
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-gray-900 dark:text-white font-black text-2xl tracking-tight mb-1">
                  {t.dailyEnergyFlux}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  Metabolic Real-time Monitoring
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Net Delta</span>
                <div className={`text-lg font-black ${summary.netResult > 0 ? 'text-orange-500' : 'text-blue-500'}`}>
                  {summary.netResult > 0 ? '+' : ''}{Math.round(summary.netResult)} <span className="text-[10px] opacity-70">kcal</span>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 800}} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc'}}
                    contentStyle={{
                      borderRadius: '24px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', 
                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                      padding: '16px'
                    }}
                    itemStyle={{fontWeight: '900', color: '#fff'}}
                  />
                  <Bar dataKey="kcal" radius={[12, 12, 0, 0]} barSize={80} animationDuration={1500} animationBegin={200}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex justify-between px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 dark:border-white/5 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div> {t.pillarIntake}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div> {t.burn}
              </div>
            </div>
          </div>

          {/* AI Intelligence Analysis Section */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-10 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-between overflow-hidden relative border border-white/10 h-full">
              {/* Animated HUD Element */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-500/20 p-3 rounded-2xl backdrop-blur-md border border-indigo-500/30">
                      {isProcessing ? (
                        <svg className="w-6 h-6 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-xl tracking-tight leading-none mb-1">{t.aiCoachAnalysis}</h3>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80">Neural Link Processing</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <span className="text-xs font-black text-indigo-300">AI</span>
                  </div>
                </div>
                
                <div className="relative p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl mb-8 group overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {isProcessing ? (
                    <div className="space-y-4 py-2">
                      <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-white/10 rounded-full w-1/2 animate-pulse"></div>
                      <p className="text-indigo-300/60 text-xs font-bold uppercase tracking-widest text-center mt-4">{t.thinking}</p>
                    </div>
                  ) : (
                    <p className="text-indigo-50 text-xl font-medium leading-relaxed italic">
                      "{log.aiOptimizationTip || 'Awaiting synchronization...'}"
                    </p>
                  )}
                </div>
              </div>

              {metabolicArt && !isProcessing && (
                <div className="relative -mx-10 -mb-10 mt-4 h-56 overflow-hidden group border-t border-white/10">
                  <img 
                    src={metabolicArt} 
                    alt="Metabolic Art" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Dynamic Visualization</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {!metabolicArt && (
                <div className="mt-4 grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-indigo-300 text-[10px] font-black uppercase block mb-1 tracking-widest">{t.activeBurn}</span>
                    <span className="text-2xl font-black">{summary.activityBurn} <span className="text-xs font-normal opacity-50">{t.unitKcal}</span></span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-indigo-300 text-[10px] font-black uppercase block mb-1 tracking-widest">{t.focusBurn}</span>
                    <span className="text-2xl font-black">{summary.workBurn} <span className="text-xs font-normal opacity-50">{t.unitKcal}</span></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio-Sync Analysis Footer */}
        <div className="mt-12 p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 p-12 opacity-5 pointer-events-none ${isRTL ? 'left-0' : 'right-0'}`}>
            <svg className="w-48 h-48 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-1.136-1.21-1.54-.231-.406-.318-.741-.345-1.011-.027-.27-.006-.534.1-.786.107-.252.272-.486.446-.66a1 1 0 00.454-.454c.174-.174.408-.339.66-.446.252-.106.516-.127.786-.1a1.631 1.631 0 011.011.345c.404.23.95.618 1.54 1.21A1 1 0 0019 11a9 9 0 01-9 9 9 9 0 01-9-9 9.124 9.124 0 01.517-3.038A3.5 3.5 0 015 3.5c.357 0 .707.053 1.038.15a1 1 0 001.03-1.518c-.623-.934-.747-2.124-.37-3.21.378-1.083 1.246-1.87 2.333-2.149a1 1 0 00.392-1.22z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative z-10">
            <h4 className="text-gray-900 dark:text-white font-black text-2xl mb-4 tracking-tight">{t.precisionAnalysis}</h4>
            <p className="text-gray-500 dark:text-slate-400 max-w-2xl text-lg leading-relaxed mb-10">
              {t.analysisDesc(summary.bmr, log.loggedFoods.length)}
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-6 py-3 rounded-2xl text-sm font-black border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                 {t.logicApplied(getStatusText(summary.status))}
               </div>
               <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-6 py-3 rounded-2xl text-sm font-black border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                 {isOnlineMode ? 'Hybrid Neural Compute' : 'Local Bio-Compute'}
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center mt-20 text-gray-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">
        {t.appTitle} SYSTEM ARCHITECTURE &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
