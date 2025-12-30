
import { Exercise } from './types';

export const DEFAULT_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 Hours
// For testing purposes, you might want to use a shorter interval.
// export const DEFAULT_INTERVAL_MS = 10 * 1000; 

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'squats',
    name: 'Bodyweight Squats',
    reps: 10,
    completed: false,
    icon: 'fa-person-half-dress',
    description: 'Keep your chest up and core tight. Sit back as if in a chair.'
  },
  {
    id: 'pushups',
    name: 'Push Ups',
    reps: 10,
    completed: false,
    icon: 'fa-hand-back-fist',
    description: 'Maintain a straight line from head to heels. Chest to floor.'
  },
  {
    id: 'situps',
    name: 'Sit Ups',
    reps: 10,
    completed: false,
    icon: 'fa-person-walking-arrow-right',
    description: 'Feet flat on floor, use your core to lift your torso to your knees.'
  }
];

export const MOTIVATION_PROMPT = `
You are an enthusiastic AI Fitness Coach. 
The user just completed a work block and it's time for their 3-hourly active break.
The routine is: 10 Squats, 10 Push-ups, and 10 Sit-ups.
Give them a short, punchy (max 2 sentences) motivational quote or a quick health tip about why movement after sitting is important.
Be energetic and encouraging!
`;
