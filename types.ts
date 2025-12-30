
export interface Exercise {
  id: string;
  name: string;
  reps: number;
  completed: boolean;
  icon: string;
  description: string;
}

export interface WorkoutSession {
  timestamp: number;
  completedAt: number;
  exercises: Exercise[];
}

export interface UserStats {
  dailyCompletions: number;
  lastWorkoutTime: number;
  streakDays: number;
}
