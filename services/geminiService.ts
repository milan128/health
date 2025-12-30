
import { GoogleGenAI } from "@google/genai";
import { MOTIVATION_PROMPT } from "../constants";

// Fix: Direct initialization with process.env.API_KEY and removal of maxOutputTokens as per SDK rules
export const getMotivation = async (): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: MOTIVATION_PROMPT,
      config: {
        temperature: 0.9,
      }
    });
    return response.text?.trim() || "Time to move! Your body will thank you.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Let's get those reps in! Stay active, stay healthy.";
  }
};

// Fix: Initializing GoogleGenAI directly and adhering to config recommendations (avoiding maxOutputTokens without thinkingBudget)
export const getFormTip = async (exerciseName: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Give a very brief, single-sentence expert tip on how to perform a ${exerciseName} with perfect form.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text?.trim() || "Focus on your breathing and steady movement.";
  } catch (error) {
    return "Keep your form clean and movements controlled.";
  }
};
