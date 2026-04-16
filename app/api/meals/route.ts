import { AIService } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-Groq-Key');
    const model = request.headers.get('X-Groq-Model') || 'llama-3.3-70b-versatile';
    const debug = request.headers.get('X-Debug-Mode') === 'true';
    const textAnalysisPrompt = request.headers.get('X-Text-Analysis-Prompt');

    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key is required' }, { status: 401 });
    }

    const { description } = await request.json();
    if (!description) {
      return NextResponse.json({ error: 'Meal description is required' }, { status: 400 });
    }

    const aiService = new AIService({
      apiKey,
      model,
      debug,
      textAnalysisPrompt: textAnalysisPrompt || undefined,
    });
    const result = await aiService.analyzeFoodData(description);

    return NextResponse.json({
      message: 'Meal analyzed successfully',
      nutritionData: result.data,
      debugInfo: result.debugInfo,
    });
  } catch (error) {
    console.error('Error processing meal:', error);
    return NextResponse.json({ error: 'Failed to process meal' }, { status: 500 });
  }
}
