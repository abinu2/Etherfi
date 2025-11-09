import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { generateAIResponse } from '@/lib/anthropic';
import { architectChatbot } from '@/lib/ai/architect-chatbot';
import type { APIResponse, ChatMessage, ChatContext, UserProfile } from '@/types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Rate Limiter for chat messages
 */
const chatRateLimiter = new RateLimiterMemory({
  points: 20, // 20 messages
  duration: 60, // per minute
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    try {
      const clientId =
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'anonymous';

      await chatRateLimiter.consume(clientId, 1);
    } catch (rateLimitError: any) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: 'Too many messages. Please slow down.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, history, sessionId, userProfile, portfolio } = body as {
      message: string;
      history?: ChatMessage[];
      sessionId?: string;
      userProfile?: UserProfile;
      portfolio?: any;
    };

    if (!message) {
      return NextResponse.json<APIResponse<null>>(
        {
          success: false,
          error: 'Message is required',
        },
        { status: 400 }
      );
    }

    // Build chat context
    const context: ChatContext = {
      sessionId: sessionId || `session_${Date.now()}`,
      userProfile,
      portfolio,
      conversationHistory: history || [],
    };

    // Use enhanced chatbot for contextual response
    let aiResponse: string;

    if (sessionId && userProfile) {
      // Store context for session continuity
      architectChatbot.storeContext(context);

      // Get conversation path guidance if needed
      if (history && history.length === 0) {
        // First message - guide the conversation
        const path = await architectChatbot.guideStrategyConversation(message, context);
        if (path) {
          context.currentTopic = path.path;
        }
      }

      // Generate contextual response
      aiResponse = await architectChatbot.generateContextualResponse(message, context);
    } else {
      // Fallback to basic response
      let contextPrompt = message;
      if (history && history.length > 0) {
        const recentHistory = history.slice(-5); // Last 5 messages for context
        const historyContext = recentHistory
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join('\n');
        contextPrompt = `Previous conversation:\n${historyContext}\n\nUser: ${message}`;
      }

      aiResponse = await generateAIResponse(contextPrompt);
    }

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
    return NextResponse.json<APIResponse<null>>(
      {
        success: false,
        error: 'Failed to generate AI response',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat
 * Get chatbot memory statistics
 */
export async function GET() {
  try {
    const memoryStats = architectChatbot.getMemoryStats();

    return NextResponse.json({
      success: true,
      stats: memoryStats,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get memory statistics',
      },
      { status: 500 }
    );
  }
}
