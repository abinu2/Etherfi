import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/anthropic';
import { APIResponse, ChatMessage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body as {
      message: string;
      history?: ChatMessage[];
    };

    if (!message) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Message is required',
      }, { status: 400 });
    }

    // Build context from chat history
    let contextPrompt = message;
    if (history && history.length > 0) {
      const recentHistory = history.slice(-5); // Last 5 messages for context
      const historyContext = recentHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
      contextPrompt = `Previous conversation:\n${historyContext}\n\nUser: ${message}`;
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(contextPrompt);

    const response: ChatMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      metadata: {
        recommendations: [],
      },
    };

    return NextResponse.json<APIResponse<ChatMessage>>({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'Failed to generate AI response',
    }, { status: 500 });
  }
}
