
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise, UserStats } from './types';
import { INITIAL_EXERCISES, DEFAULT_INTERVAL_MS } from './constants';
import ExerciseCard from './components/ExerciseCard';
import CircularTimer from './components/CircularTimer';
import { getMotivation } from './services/geminiService';

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_INTERVAL_MS);
  const [isBreakActive, setIsBreakActive] = useState<boolean>(false);
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [motivation, setMotivation] = useState<string>("Stay healthy, stay moving!");
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('activebreak_stats');
    return saved ? JSON.parse(saved) : { dailyCompletions: 0, lastWorkoutTime: 0, streakDays: 0 };
  });

  // Fix: Changed 'NodeJS.Timeout' to 'any' to resolve the 'Cannot find namespace NodeJS' error in browser environments.
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }, []);

  const triggerBreak = useCallback(async () => {
    setIsBreakActive(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked until interaction"));
    }
    const quote = await getMotivation();
    setMotivation(quote);
    
    // Notification API
    if (Notification.permission === "granted") {
      new Notification("ActiveBreak Time!", {
        body: "Time to do 10 squats, 10 push-ups, and 10 sit-ups!",
        icon: "https://picsum.photos/100/100"
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!isBreakActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            if (timerRef.current) clearInterval(timerRef.current);
            triggerBreak();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBreakActive, triggerBreak]);

  const handleToggleExercise = (id: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const handleCompleteBreak = () => {
    const allDone = exercises.every(ex => ex.completed);
    if (!allDone) {
      alert("Please complete all exercises first!");
      return;
    }

    const newStats = {
      ...stats,
      dailyCompletions: stats.dailyCompletions + 1,
      lastWorkoutTime: Date.now()
    };
    setStats(newStats);
    localStorage.setItem('activebreak_stats', JSON.stringify(newStats));
    
    // Reset state
    setExercises(INITIAL_EXERCISES.map(e => ({ ...e, completed: false })));
    setIsBreakActive(false);
    setTimeLeft(DEFAULT_INTERVAL_MS);
  };

  const skipBreak = () => {
    setIsBreakActive(false);
    setTimeLeft(DEFAULT_INTERVAL_MS);
    setExercises(INITIAL_EXERCISES.map(e => ({ ...e, completed: false })));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <i className="fa-solid fa-heart-pulse text-white"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ActiveBreak</h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-full flex items-center gap-2">
            <i className="fa-solid fa-fire text-orange-500"></i>
            <span className="font-semibold">{stats.dailyCompletions} Today</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl flex-grow flex flex-col items-center">
        {!isBreakActive ? (
          <div className="flex flex-col items-center space-y-12 animate-in fade-in duration-700">
            <CircularTimer timeLeft={timeLeft} totalTime={DEFAULT_INTERVAL_MS} />
            
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl text-center max-w-lg shadow-xl backdrop-blur-sm">
              <i className="fa-solid fa-quote-left text-indigo-500 text-3xl mb-4 block"></i>
              <p className="text-xl text-slate-300 font-medium leading-relaxed italic">
                "{motivation}"
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-indigo-400 text-sm font-semibold uppercase tracking-widest">
                <span className="h-px w-8 bg-indigo-900"></span>
                AI Coaching Service
                <span className="h-px w-8 bg-indigo-900"></span>
              </div>
            </div>

            <button 
              onClick={triggerBreak}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <i className="fa-solid fa-play"></i>
              Start Break Now
            </button>
          </div>
        ) : (
          <div className="w-full animate-in slide-in-from-bottom duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
              <div>
                <h2 className="text-4xl font-extrabold text-white mb-2">Break Time!</h2>
                <p className="text-slate-400">Complete these 3 exercises to boost your health.</p>
              </div>
              <button 
                onClick={skipBreak}
                className="text-slate-500 hover:text-red-400 transition-colors text-sm font-medium"
              >
                Skip this break
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {exercises.map(ex => (
                <ExerciseCard 
                  key={ex.id} 
                  exercise={ex} 
                  onToggle={handleToggleExercise} 
                />
              ))}
            </div>

            <div className="flex justify-center">
              <button 
                onClick={handleCompleteBreak}
                className={`px-12 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-3 ${
                  exercises.every(e => e.completed) 
                  ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <i className="fa-solid fa-circle-check"></i>
                I'm Done!
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Stats */}
      <footer className="w-full max-w-4xl mt-12 pt-8 border-t border-slate-900 text-slate-500 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© 2024 ActiveBreak Wellness. Motion is medicine.</p>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span>Sitting less improves heart health</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Daily Reps: {stats.dailyCompletions * 30}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
