import { NextResponse } from 'next/server';
import { getAllAssets } from '@/lib/data-store';

export async function GET() {
  try {
    const assets = getAllAssets();
    return NextResponse.json({
      success: true,
      count: assets.length,
      data: assets,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assets', details: String(error) },
      { status: 500 }
    );
  }
}
