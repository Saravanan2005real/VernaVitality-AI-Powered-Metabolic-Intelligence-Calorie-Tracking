import { AIService } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-Groq-Key');
    const model = request.headers.get('X-Groq-Model') || 'meta-llama/llama-4-scout-17b-16e-instruct';
    const debug = request.headers.get('X-Debug-Mode') === 'true';
    const imageAnalysisPrompt = request.headers.get('X-Image-Analysis-Prompt');

    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key is required' }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const description = formData.get('description') as string | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    const aiService = new AIService({
      apiKey,
      model,
      debug,
      imageAnalysisPrompt: imageAnalysisPrompt || undefined,
    });

    const result = await aiService.analyzeImageData(base64Image, description || undefined);
    console.log(result, 'result');
    return NextResponse.json({
      message: 'Image analyzed successfully',
      nutritionData: result.data,
      debugInfo: result.debugInfo,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
