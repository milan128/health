
import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { getFormTip } from '../services/geminiService';

interface ExerciseCardProps {
  exercise: Exercise;
  onToggle: (id: string) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onToggle }) => {
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    const fetchTip = async () => {
      const result = await getFormTip(exercise.name);
      setTip(result);
    };
    fetchTip();
  }, [exercise.name]);

  return (
    <div className={`p-6 rounded-2xl transition-all duration-300 border-2 ${
      exercise.completed 
        ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
        : 'bg-slate-800/50 border-slate-700 hover:border-indigo-500'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
            exercise.completed ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'
          }`}>
            <i className={`fa-solid ${exercise.icon}`}></i>
          </div>
          <div>
            <h3 className="font-bold text-lg">{exercise.name}</h3>
            <p className="text-slate-400 text-sm">{exercise.reps} Repetitions</p>
          </div>
        </div>
        <button 
          onClick={() => onToggle(exercise.id)}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
            exercise.completed 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'border-slate-500 text-transparent hover:border-indigo-500'
          }`}
        >
          {exercise.completed && <i className="fa-solid fa-check text-xs"></i>}
        </button>
      </div>
      
      <p className="text-slate-300 text-sm mb-3 italic">"{exercise.description}"</p>
      
      {tip && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">AI Coach Tip:</p>
          <p className="text-xs text-slate-400">{tip}</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
