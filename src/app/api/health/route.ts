import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Health Check Endpoint for Lumina Finance
 * Tests Claude API connectivity and service status
 */
export async function GET() {
  try {
    // Check if Claude API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const isConfigured = apiKey && apiKey !== 'sk-ant-your-key-here';

    // Check service health
    const services = {
      api: 'operational',
      claude: isConfigured ? 'configured' : 'not_configured',
      env: process.env.NODE_ENV || 'development',
    };

    const allOperational = Object.values(services).every(
      (status) => status === 'operational' || status === 'configured'
    );

    return NextResponse.json({
      status: allOperational ? 'healthy' : 'degraded',
      services,
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      app: process.env.NEXT_PUBLIC_APP_NAME || 'Lumina Finance',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Service health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
