'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  targetCalories: number;
  setTargetCalories: (calories: number) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  customModelName: string;
  setCustomModelName: (name: string) => void;
  debugMode: boolean;
  setDebugMode: (debug: boolean) => void;
  targetWeight: number;
  setTargetWeight: (weight: number) => void;
  currentWeight: number;
  setCurrentWeight: (weight: number) => void;
  height: number;
  setHeight: (height: number) => void;
  age: number;
  setAge: (age: number) => void;
  gender: string;
  setGender: (gender: string) => void;
  activityLevel: string;
  setActivityLevel: (level: string) => void;
  fitnessGoal: string;
  setFitnessGoal: (goal: string) => void;
  futureGoalDescription: string;
  setFutureGoalDescription: (desc: string) => void;
  textAnalysisPrompt: string;
  setTextAnalysisPrompt: (prompt: string) => void;
  imageAnalysisPrompt: string;
  setImageAnalysisPrompt: (prompt: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState('');
  const [targetCalories, setTargetCalories] = useState(0);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [customModelName, setCustomModelName] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [targetWeight, setTargetWeight] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('Not Specified');
  const [activityLevel, setActivityLevel] = useState('Sedentary');
  const [fitnessGoal, setFitnessGoal] = useState('Weight Loss');
  const [futureGoalDescription, setFutureGoalDescription] = useState('');
  const [textAnalysisPrompt, setTextAnalysisPrompt] = useState(
    `You are a high-energy, world-class motivational fitness coach. Analyze the following meal description and provide nutritional information for each item. Respond with extreme positivity and encouragement! Combine items if they are the same. Format the response as a JSON array where each object has "item" and "nutrition" (calories, protein, carbs, fat, grams, fiber in grams). Add a "motivationalFeedback" field to the root of the JSON (not per item) with a powerful, motivating message about their choice. Be precise and realistic with values.`
  );
  const [imageAnalysisPrompt, setImageAnalysisPrompt] = useState(
    `You are a high-energy, world-class motivational fitness coach. Analyze this food image and provide nutritional information for each visible item. Respond with fire and passion! Format the response as a JSON object with an "items" array and a "motivationalFeedback" string at the top level. Each item has "item" and "nutrition" (calories, protein, carbs, fat, grams, fiber). Be precise and realistic with values. Make the user feel like a champion for tracking their food!`
  );

  // Initialize values from localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('groq_api_key') || '';
    const storedCalories = localStorage.getItem('target_calories');
    const storedModel = localStorage.getItem('selected_model') || 'llama-3.3-70b-versatile';
    const storedCustomModel = localStorage.getItem('custom_model') || '';
    const storedDebugMode = localStorage.getItem('debug_mode') === 'true';
    const storedTargetWeight = localStorage.getItem('target_weight');
    const storedCurrentWeight = localStorage.getItem('current_weight');
    const storedHeight = localStorage.getItem('stored_height');
    const storedAge = localStorage.getItem('stored_age');
    const storedGender = localStorage.getItem('stored_gender');
    const storedActivity = localStorage.getItem('stored_activity');
    const storedGoalDesc = localStorage.getItem('stored_goal_desc');
    const storedFitnessGoal = localStorage.getItem('fitness_goal') || 'Weight Loss';
    const storedTextPrompt = localStorage.getItem('text_analysis_prompt');
    const storedImagePrompt = localStorage.getItem('image_analysis_prompt');

    setApiKey(storedApiKey);
    setTargetCalories(storedCalories ? parseInt(storedCalories) : 0);
    setSelectedModel(storedModel === 'custom' || ['llama-3.3-70b-versatile', 'meta-llama/llama-4-scout-17b-16e-instruct', 'meta-llama/llama-4-maverick-17b-128e-instruct', 'qwen/qwen3-32b', 'llama-3.1-8b-instant'].includes(storedModel) ? storedModel : 'llama-3.3-70b-versatile');
    setCustomModelName(storedCustomModel);
    setDebugMode(storedDebugMode);
    setTargetWeight(storedTargetWeight ? parseFloat(storedTargetWeight) : 0);
    setCurrentWeight(storedCurrentWeight ? parseFloat(storedCurrentWeight) : 0);
    setHeight(storedHeight ? parseFloat(storedHeight) : 0);
    setAge(storedAge ? parseInt(storedAge) : 0);
    setGender(storedGender || 'Not Specified');
    setActivityLevel(storedActivity || 'Sedentary');
    setFutureGoalDescription(storedGoalDesc || '');
    setFitnessGoal(storedFitnessGoal);
    if (storedTextPrompt) setTextAnalysisPrompt(storedTextPrompt);
    if (storedImagePrompt) setImageAnalysisPrompt(storedImagePrompt);
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('groq_api_key', apiKey);
    localStorage.setItem('target_calories', targetCalories.toString());
    localStorage.setItem('selected_model', selectedModel);
    localStorage.setItem('custom_model', customModelName);
    localStorage.setItem('debug_mode', debugMode.toString());
    localStorage.setItem('target_weight', targetWeight.toString());
    localStorage.setItem('current_weight', currentWeight.toString());
    localStorage.setItem('stored_height', height.toString());
    localStorage.setItem('stored_age', age.toString());
    localStorage.setItem('stored_gender', gender);
    localStorage.setItem('stored_activity', activityLevel);
    localStorage.setItem('stored_goal_desc', futureGoalDescription);
    localStorage.setItem('fitness_goal', fitnessGoal);
    localStorage.setItem('text_analysis_prompt', textAnalysisPrompt);
    localStorage.setItem('image_analysis_prompt', imageAnalysisPrompt);
  }, [
    apiKey,
    targetCalories,
    selectedModel,
    customModelName,
    debugMode,
    targetWeight,
    currentWeight,
    height,
    age,
    gender,
    activityLevel,
    futureGoalDescription,
    fitnessGoal,
    textAnalysisPrompt,
    imageAnalysisPrompt,
  ]);

  return (
    <SettingsContext.Provider
      value={{
        apiKey,
        setApiKey,
        targetCalories,
        setTargetCalories,
        selectedModel,
        setSelectedModel,
        customModelName,
        setCustomModelName,
        debugMode,
        setDebugMode,
        targetWeight,
        setTargetWeight,
        currentWeight,
        setCurrentWeight,
        height,
        setHeight,
        age,
        setAge,
        gender,
        setGender,
        activityLevel,
        setActivityLevel,
        fitnessGoal,
        setFitnessGoal,
        futureGoalDescription,
        setFutureGoalDescription,
        textAnalysisPrompt,
        setTextAnalysisPrompt,
        imageAnalysisPrompt,
        setImageAnalysisPrompt,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
