import Groq from 'groq-sdk';
import { DEFAULT_IMAGE_PROMPT, DEFAULT_TEXT_PROMPT, EXAMPLE_RESPONSE } from './constants/prompts';

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  grams: number;
}

export interface FoodItemNutrition {
  item: string;
  nutrition: NutritionData;
}

export interface AIServiceConfig {
  apiKey: string;
  model: string;
  debug?: boolean;
  textAnalysisPrompt?: string;
  imageAnalysisPrompt?: string;
}

export interface AnalysisResponse {
  data: FoodItemNutrition[];
  debugInfo?: {
    rawResponse: unknown;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    request: {
      model: string;
      messages: any[];
      temperature: number;
    };
  };
}

export class AIService {
  private client: Groq;
  private model: string;
  private debug: boolean;
  private textAnalysisPrompt: string;
  private imageAnalysisPrompt: string;

  constructor(config: AIServiceConfig) {
    this.client = new Groq({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true // Since this is a client-side app
    });
    this.model = config.model;
    this.debug = config.debug || false;
    this.textAnalysisPrompt = config.textAnalysisPrompt || DEFAULT_TEXT_PROMPT;
    this.imageAnalysisPrompt = config.imageAnalysisPrompt || DEFAULT_IMAGE_PROMPT;
  }

  async analyzeFoodData(description: string): Promise<AnalysisResponse> {
    const prompt = `${this.textAnalysisPrompt}
    ${EXAMPLE_RESPONSE}
    
    Meal description: "${description}"`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content in response');

    const parsedResponse = JSON.parse(content);
    // Groq sometimes returns the array directly or wrapped
    const data = parsedResponse.meal || parsedResponse.items || (Array.isArray(parsedResponse) ? parsedResponse : []);

    const result: AnalysisResponse = {
      data: data,
    };

    if (this.debug) {
      result.debugInfo = {
        rawResponse: parsedResponse,
        totalTokens: response.usage?.total_tokens || 0,
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        request: {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
        },
      };
    }

    return result;
  }

  async analyzeImageData(base64Image: string, description?: string): Promise<AnalysisResponse> {
    const prompt = description
      ? `${this.imageAnalysisPrompt} Use this provided description as helper: "${description}".`
      : this.imageAnalysisPrompt;

    // Use a vision model if available, otherwise fallback
    const visionModel = this.model.includes('vision') || this.model.includes('scout') || this.model.includes('maverick')
      ? this.model
      : 'meta-llama/llama-4-scout-17b-16e-instruct';

    const response = await this.client.chat.completions.create({
      model: visionModel,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt + EXAMPLE_RESPONSE },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content in response');

    const parsedResponse = JSON.parse(content);
    const data = parsedResponse.items || parsedResponse.meal || (Array.isArray(parsedResponse) ? parsedResponse : []);

    const result: AnalysisResponse = {
      data: data,
    };

    if (this.debug) {
      result.debugInfo = {
        rawResponse: parsedResponse,
        totalTokens: response.usage?.total_tokens || 0,
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        request: {
          model: visionModel,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64`,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
        },
      };
    }

    return result;
  }

  async recommendNextMeal(lastMeal: FoodItemNutrition[], goal: string, goalDescription: string = ''): Promise<{ analysis: string; recommendation: string }> {
    const mealSummary = lastMeal.map(i => `${i.item} (${i.nutrition.calories} kcal, ${i.nutrition.protein}g protein, ${i.nutrition.carbs}g carbs, ${i.nutrition.fat}g fat)`).join(', ');

    const prompt = `The user's fitness goal is: "${goal}".
    The user's personal vision for themselves: "${goalDescription}".
    They just ate: ${mealSummary}.
    
    Analyze this meal based on their goal and vision. If the meal was not ideal (e.g., too high in carbs for Keto, too low in protein for Muscle Gain), recommend exactly what they should eat for their NEXT meal to balance things out and stay aligned with their vision.
    
    The goal is that over these 2 meals, they should be back on track for their daily targets.
    
    Provide your response in JSON format:
    {
      "analysis": "Brief analysis of the last meal (max 20 words)",
      "recommendation": "Specific set of foods with quantities for the next meal to fix the balance (max 30 words)"
    }`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'system', content: 'You are a professional nutritionist AI.' }, { role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content in response');

    return JSON.parse(content);
  }
}
