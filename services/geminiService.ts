
import { DailyLog, LanguageCode } from "../types";
import { calculateDailySummary } from "./logic";
import { TRANSLATIONS } from "../translations";
import { GoogleGenAI } from "@google/genai";

/**
 * Bio-Logic Engine (Offline / Rule-based fallback)
 */
function getLocalTip(log: DailyLog, language: LanguageCode): string {
  const t = TRANSLATIONS[language];
  const summary = calculateDailySummary(log);
  
  if (log.sleepQuality < 3) return t.coachTips.lowSleep;
  if (log.workHours > 8) return t.coachTips.highWork;
  if (summary.status === 'Surplus') return t.coachTips.surplus;
  if (summary.status === 'Deficit') return t.coachTips.deficit;
  return t.coachTips.balanced;
}

/**
 * Intelligent Optimization Engine
 */
export async function getAIOptimizationTip(
  log: DailyLog, 
  language: LanguageCode = 'en',
  isOnline: boolean = false
): Promise<{ tip: string; fallback: boolean }> {
  const t = TRANSLATIONS[language];

  if (!isOnline) {
    return { tip: getLocalTip(log, language), fallback: false };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const summary = calculateDailySummary(log);
    
    const foodContext = log.loggedFoods.length > 0 
      ? `Inventory: ${log.loggedFoods.map(f => `${f.quantity}x ${f.name}`).join(', ')}`
      : "No food logged.";
    const activityContext = log.loggedActivities.length > 0
      ? `Output: ${log.loggedActivities.map(a => `${a.name} (${a.quantity}${a.unit})`).join(', ')}`
      : "Baseline movement.";

    const prompt = `
      As a precision metabolic coach, analyze this user's real-time bio-state:
      - Profile: ${log.age}y, ${log.gender}, ${log.weight}kg, ${log.height}cm
      - Bio-Flux: ${summary.status} (${Math.round(summary.netResult)} kcal net)
      - ${foodContext}
      - ${activityContext}
      - Performance: ${log.workHours}h focus, ${log.sleepHours}h sleep (Quality: ${log.sleepQuality}/5)
      
      Language: ${language}
      
      TASK: Provide an ultra-precise prescription for the NEXT meal or hydration window.
      MUST SPECIFY:
      1. WHAT to consume (e.g., "Magnesium-rich mineral water", "Grilled Turkey").
      2. HOW MUCH (e.g., "450ml", "180g").
      
      Constraint: Exactly 2 technical, professional sentences. No fluff.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    return { tip: text?.trim() || getLocalTip(log, language), fallback: false };

  } catch (error) {
    return { 
      tip: `${t.fallbackMsg} ${getLocalTip(log, language)}`, 
      fallback: true 
    };
  }
}

/**
 * Generates a cinematic visual representing the user's humanoid metabolic state
 */
export async function generateMetabolicArt(status: string): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let moodPrompt = "";
    const stylePrefix = "Cinematic 3D render of a cool stylish humanoid digital twin, athletic build, minimalist cybernetic armor, high-fidelity, octane render, unreal engine 5 style, volumetric lighting, dark slate background. ";

    if (status === 'Surplus') {
      moodPrompt = stylePrefix + "Glowing vibrant orange and golden amber metabolic energy pathways flowing through the body like veins of light, powerful aura, energetic stance.";
    } else if (status === 'Deficit') {
      moodPrompt = stylePrefix + "Sharp crystalline structures integrated into the suit, glowing neon teal and deep blue circuitry, focused and lean aesthetic, cold energy atmosphere.";
    } else {
      moodPrompt = stylePrefix + "Perfectly balanced glowing white and emerald green organic light patterns on the skin, harmonious composition, serene floating pose, aura of pure health.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: moodPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed", error);
    return null;
  }
}
