import { AIService } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const apiKey = request.headers.get('X-Groq-Key');
        const model = request.headers.get('X-Groq-Model') || 'llama-3.3-70b-versatile';

        if (!apiKey) {
            return NextResponse.json({ error: 'Groq API key is required' }, { status: 401 });
        }

        const { lastMeal, goal, goalDescription } = await request.json();
        if (!lastMeal || !goal) {
            return NextResponse.json({ error: 'Last meal and goal are required' }, { status: 400 });
        }

        const aiService = new AIService({
            apiKey,
            model,
        });

        const result = await aiService.recommendNextMeal(lastMeal, goal, goalDescription);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error recommending next meal:', error);
        return NextResponse.json({ error: 'Failed to recommend next meal' }, { status: 500 });
    }
}
