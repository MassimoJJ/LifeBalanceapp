
import React, { useState, useMemo } from 'react';
import { DailyLog, LoggedFood, LoggedActivity, LanguageCode } from '../types';
import { FOOD_DATABASE, ACTIVITY_DATABASE } from '../constants';
import { TRANSLATIONS } from '../translations';

interface LogFormProps {
  onSubmit: (log: Partial<DailyLog>) => void;
  isLoading: boolean;
  language: LanguageCode;
}

const LogForm: React.FC<LogFormProps> = ({ onSubmit, isLoading, language }) => {
  const t = TRANSLATIONS[language];
  const isRTL = language === 'ar' || language === 'fa';

  // State for Food
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [currentCategory, setCurrentCategory] = useState('fruit');
  const [currentItem, setCurrentItem] = useState('apple');
  const [quantity, setQuantity] = useState(1);

  // State for Activity
  const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>([]);
  const [currentActCategory, setCurrentActCategory] = useState('general');
  const [currentActItem, setCurrentActItem] = useState('walking');
  const [actQuantity, setActQuantity] = useState(30);

  // State for Non-loggable data
  const [nonLogData, setNonLogData] = useState({
    workHours: 8,
    sleepHours: 7,
    sleepQuality: 3,
  });

  // Food Select Helpers
  const selectedItemData = useMemo(() => 
    FOOD_DATABASE[currentCategory].items[currentItem]
  , [currentCategory, currentItem]);

  const handleCategorySelect = (categoryKey: string) => {
    setCurrentCategory(categoryKey);
    const firstItemKey = Object.keys(FOOD_DATABASE[categoryKey].items)[0];
    setCurrentItem(firstItemKey);
    setQuantity(getDefaultQuantity(categoryKey, firstItemKey));
  };

  const getDefaultQuantity = (category: string, itemKey: string) => {
    const item = FOOD_DATABASE[category].items[itemKey];
    if (category === 'seeds') return 30;
    if (category === 'meat' || category === 'carbs' || category === 'veggies') {
        if (item.type === 'weight') return 100;
    }
    return item.type === 'weight' ? 100 : 1;
  };

  const handleAddFood = () => {
    const newItem: LoggedFood = {
      itemId: currentItem,
      name: t.foodItems[currentItem] || selectedItemData.name,
      quantity,
      totalCalories: selectedItemData.kcal * quantity
    };
    setLoggedFoods([...loggedFoods, newItem]);
  };

  const removeFood = (index: number) => {
    setLoggedFoods(prev => prev.filter((_, i) => i !== index));
  };

  // Activity Select Helpers
  const selectedActData = useMemo(() => 
    ACTIVITY_DATABASE[currentActCategory].items[currentActItem]
  , [currentActCategory, currentActItem]);

  const handleActCategorySelect = (categoryKey: string) => {
    setCurrentActCategory(categoryKey);
    const firstItemKey = Object.keys(ACTIVITY_DATABASE[categoryKey].items)[0];
    setCurrentActItem(firstItemKey);
    setActQuantity(ACTIVITY_DATABASE[categoryKey].items[firstItemKey].unitType === 'set' ? 4 : 30);
  };

  const handleAddActivity = () => {
    const newAct: LoggedActivity = {
      activityId: currentActItem,
      name: t.activities[currentActItem] || selectedActData.name,
      quantity: actQuantity,
      unit: selectedActData.unitType,
      totalBurn: selectedActData.kcalPerUnit * actQuantity
    };
    setLoggedActivities([...loggedActivities, newAct]);
  };

  const removeActivity = (index: number) => {
    setLoggedActivities(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalFoodCalories = loggedFoods.reduce((sum, item) => sum + item.totalCalories, 0);
    onSubmit({
      ...nonLogData,
      foodCalories: totalFoodCalories,
      loggedFoods,
      loggedActivities
    });
  };

  // Category Icons Mapping
  const foodIcons: Record<string, React.ReactNode> = {
    fruit: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c4.97 0 9-3.134 9-7 0-3.866-4.03-7-9-7s-9 3.134-9 7c0 3.866 4.03 7 9 7z" /><path d="M12 8V2" /><path d="M15 5c-1 0-2.5 1-3 2" /></svg>),
    meat: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 6c-3.31 0-6 2.69-6 6 0 2.21 1.2 4.14 3 5.17V20h4v-2.83c1.8-1.03 3-2.96 3-5.17 0-3.31-2.69-6-6-6z" /><circle cx="14" cy="14" r="2" /><path d="M10 2l4 4-4 4" /></svg>),
    seeds: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /><circle cx="12" cy="7" r="3" /></svg>),
    sweets: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0-4.418-3.582-8-8-8s-8 3.582-8 8v10h16V10z" /><path d="M8 10h8" /></svg>),
    drinks: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /></svg>),
    carbs: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 20l4-16m2 16l4-16M2 9h20M2 15h20" /></svg>),
    veggies: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20a7 7 0 0 1-7-7c0-3.87 3.13-7 7-7s7 3.13 7 7a7 7 0 0 1-7 7z" /><path d="M11 6V2" /></svg>),
  };

  const activityIcons: Record<string, React.ReactNode> = {
    general: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="3" /><path d="M9 22V12h6v10" /><path d="M18 10l-1.5-1.5L12 12 7.5 8.5 6 10" /></svg>),
    gym: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 7.5h12M6 16.5h12M12 4v16M12 4L8 8m4-4l4 4m-4 12l-4-4m4 4l4-4" /><circle cx="12" cy="12" r="3" /><path d="M4 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM20 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM20 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>),
    sports: (<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20" /><path d="M12 2a15 15 0 0 0 0 20" /></svg>),
  };

  const activityLabel = selectedActData?.unitType === 'set' ? t.unitSets : t.activityMin;
  const activityStep = selectedActData?.unitType === 'set' ? 1 : 5;

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-800">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">LB</span>
          {t.precisionDailyLog}
        </h3>
        
        {/* Step 1: Food Intake */}
        <div className="mb-10 p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 text-center">{t.step1}</label>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {Object.entries(FOOD_DATABASE).map(([key, db]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleCategorySelect(key)}
                className={`group flex flex-col items-center justify-center p-6 rounded-3xl border-4 transition-all duration-300 min-w-[120px] ${
                  currentCategory === key 
                  ? 'border-indigo-600 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-xl scale-105' 
                  : 'border-white dark:border-slate-900 bg-white/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className={`mb-3 ${currentCategory === key ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-700'}`}>{foodIcons[key]}</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center">{t.categories[key] || db.category}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-6">
              <label className="text-xs font-black text-slate-500 mb-3 block uppercase tracking-widest">{t.selectItem}</label>
              <select value={currentItem} onChange={(e) => setCurrentItem(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-4 border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 bg-white dark:bg-slate-800 text-xl font-black text-slate-900 dark:text-white transition-colors">
                {Object.entries(FOOD_DATABASE[currentCategory].items).map(([key, item]) => (
                  <option key={key} value={key}>{t.foodItems[key] || item.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-4">
              <label className="text-xs font-black text-slate-500 mb-3 block uppercase tracking-widest">{t.quantity} ({selectedItemData.unit})</label>
              <input type="number" step="0.5" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)} className="w-full px-6 py-4 rounded-2xl border-4 border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 bg-white dark:bg-slate-800 text-xl font-black text-slate-900 dark:text-white transition-colors" />
            </div>
            <button type="button" onClick={handleAddFood} className="md:col-span-2 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg uppercase tracking-widest text-xs">
              {t.addToLog}
            </button>
          </div>
        </div>

        {/* Step 2: Activity & Performance */}
        <div className="mb-10 p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 text-center">{t.step2}</label>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {Object.entries(ACTIVITY_DATABASE).map(([key, db]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleActCategorySelect(key)}
                className={`flex items-center gap-3 px-8 py-4 rounded-3xl border-4 transition-all duration-300 min-w-[150px] justify-center ${
                  currentActCategory === key 
                  ? 'border-rose-600 bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-400 shadow-xl scale-105' 
                  : 'border-white dark:border-slate-900 bg-white/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className={`${currentActCategory === key ? 'text-rose-600 dark:text-rose-400' : 'text-slate-300 dark:text-slate-700'}`}>{activityIcons[key]}</div>
                <span className="text-sm font-black uppercase tracking-widest">{t.categories[key] || db.category}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-6">
              <label className="text-xs font-black text-slate-500 mb-3 block uppercase tracking-widest">{t.selectActivity}</label>
              <select value={currentActItem} onChange={(e) => setCurrentActItem(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-4 border-slate-200 dark:border-slate-800 focus:border-rose-600 dark:focus:border-rose-500 bg-white dark:bg-slate-800 text-xl font-black text-slate-900 dark:text-white transition-colors">
                {Object.entries(ACTIVITY_DATABASE[currentActCategory].items).map(([key, item]) => (
                  <option key={key} value={key}>{t.activities[key] || item.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-4">
              <label className="text-xs font-black text-slate-500 mb-3 block uppercase tracking-widest">{activityLabel}</label>
              <input type="number" step={activityStep} value={actQuantity} onChange={(e) => setActQuantity(parseFloat(e.target.value) || 0)} className="w-full px-6 py-4 rounded-2xl border-4 border-slate-200 dark:border-slate-800 focus:border-rose-600 dark:focus:border-rose-500 bg-white dark:bg-slate-800 text-xl font-black text-slate-900 dark:text-white transition-colors" />
            </div>
            <button type="button" onClick={handleAddActivity} className="md:col-span-2 py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all shadow-lg uppercase tracking-widest text-xs">
              {t.addActivity}
            </button>
          </div>
        </div>

        {/* Metabolic Essentials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-600 mb-3 uppercase tracking-[0.2em]">{t.focusH}</label>
            <input type="number" step="0.5" value={nonLogData.workHours} onChange={(e) => setNonLogData(p => ({...p, workHours: parseFloat(e.target.value) || 0}))} className="w-full bg-transparent text-3xl font-black focus:ring-0 border-none p-0 text-center text-slate-900 dark:text-white" />
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-600 mb-3 uppercase tracking-[0.2em]">{t.sleepH}</label>
            <input type="number" step="0.5" value={nonLogData.sleepHours} onChange={(e) => setNonLogData(p => ({...p, sleepHours: parseFloat(e.target.value) || 0}))} className="w-full bg-transparent text-3xl font-black focus:ring-0 border-none p-0 text-center text-slate-900 dark:text-white" />
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-600 mb-3 uppercase tracking-[0.2em]">{t.quality}</label>
            <select value={nonLogData.sleepQuality} onChange={(e) => setNonLogData(p => ({...p, sleepQuality: parseInt(e.target.value)}))} className="w-full bg-transparent text-xl font-black focus:ring-0 border-none p-0 appearance-none text-center text-slate-900 dark:text-white">
              {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}/5 {t.quality}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className={`w-full py-6 rounded-[2rem] text-white font-black text-2xl shadow-xl transition-all ${isLoading ? 'bg-slate-300 dark:bg-slate-800' : 'bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500'}`}>
          {isLoading ? t.processing : t.syncData}
        </button>
      </form>

      {/* Real-time Inventory Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-lg border border-gray-100 dark:border-slate-800">
          <label className="block text-xs font-black text-slate-400 dark:text-slate-600 mb-6 uppercase tracking-[0.3em]">{t.inventory}</label>
          <div className="space-y-3">
            {loggedFoods.map((f, i) => (
              <div key={i} className="group flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/40 transition-all">
                <div className="flex-1">
                  <div className="font-black text-slate-900 dark:text-slate-100">{f.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{f.quantity} units</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-black text-indigo-600 dark:text-indigo-400">+{Math.round(f.totalCalories)}</div>
                  <button 
                    type="button"
                    onClick={() => removeFood(i)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    aria-label="Delete item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
            {loggedFoods.length === 0 && <div className="text-slate-300 dark:text-slate-800 text-center py-8 font-black uppercase text-xs tracking-widest">{t.noItems}</div>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-lg border border-gray-100 dark:border-slate-800">
          <label className="block text-xs font-black text-slate-400 dark:text-slate-600 mb-6 uppercase tracking-[0.3em]">{t.activityInventory}</label>
          <div className="space-y-3">
            {loggedActivities.map((a, i) => (
              <div key={i} className="group flex justify-between items-center p-4 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-transparent dark:border-rose-900/20 hover:border-rose-200 dark:hover:border-rose-800 transition-all">
                <div className="flex-1">
                  <div className="font-black text-rose-900 dark:text-rose-300">{a.name}</div>
                  <div className="text-[10px] font-bold text-rose-400 dark:text-slate-500">
                    {a.quantity} {a.unit === 'set' ? t.unitSets : t.unitMins}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-black text-rose-600 dark:text-rose-400">-{Math.round(a.totalBurn)}</div>
                  <button 
                    type="button"
                    onClick={() => removeActivity(i)}
                    className="p-2 text-rose-300 dark:text-rose-900/30 hover:text-rose-600 transition-colors"
                    aria-label="Delete activity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
            {loggedActivities.length === 0 && <div className="text-slate-300 dark:text-slate-800 text-center py-8 font-black uppercase text-xs tracking-widest">{t.noItems}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogForm;
