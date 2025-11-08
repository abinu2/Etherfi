import { NextRequest, NextResponse } from 'next/server';
import { getCurrentGasPrice } from '@/lib/ethereum';
import { APIResponse, GasData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get current gas price
    const currentGas = await getCurrentGasPrice();

    // Simulate different speed tiers (in production, fetch from gas oracle)
    const gasData: GasData = {
      current: Math.round(currentGas),
      slow: Math.round(currentGas * 0.8),
      average: Math.round(currentGas),
      fast: Math.round(currentGas * 1.2),
      timestamp: new Date(),
    };

    return NextResponse.json<APIResponse<GasData>>({
      success: true,
      data: gasData,
    });
  } catch (error) {
    console.error('Gas API error:', error);

    // Return fallback data if API fails
    const fallbackData: GasData = {
      current: 25,
      slow: 20,
      average: 25,
      fast: 30,
      timestamp: new Date(),
    };

    return NextResponse.json<APIResponse<GasData>>({
      success: true,
      data: fallbackData,
    });
  }
}
