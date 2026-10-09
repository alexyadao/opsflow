import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/lib/data-store';

export async function GET() {
  try {
    const metrics = getDashboardMetrics();
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics', details: String(error) },
      { status: 500 }
    );
  }
}
