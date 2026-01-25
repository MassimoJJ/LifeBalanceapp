
import React from 'react';

interface PillarCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  unit: string;
  color: string;
}

const PillarCard: React.FC<PillarCardProps> = ({ title, icon, value, unit, color }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-800 transition-all hover:shadow-md hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <span className="text-gray-400 dark:text-slate-500 text-xs font-black uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-gray-900 dark:text-white">{value}</span>
        <span className="text-gray-500 dark:text-slate-400 font-medium text-sm">{unit}</span>
      </div>
    </div>
  );
};

export default PillarCard;
