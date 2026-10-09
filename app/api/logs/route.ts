import { NextRequest, NextResponse } from 'next/server';
import { getAllLogs, getActivityFeed } from '@/lib/data-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const search = searchParams.get('search')?.toLowerCase();

    let logs = getAllLogs();

    if (severity && severity !== 'all') {
      logs = logs.filter((l) => l.severity.toLowerCase() === severity.toLowerCase());
    }

    if (search) {
      logs = logs.filter(
        (l) =>
          l.event.toLowerCase().includes(search) ||
          l.service.toLowerCase().includes(search) ||
          l.user.toLowerCase().includes(search) ||
          l.ipAddress.includes(search) ||
          (l.ticketRef && l.ticketRef.toLowerCase().includes(search))
      );
    }

    const activity = getActivityFeed();

    return NextResponse.json({
      success: true,
      count: logs.length,
      data: logs,
      activityFeed: activity,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logs', details: String(error) },
      { status: 500 }
    );
  }
}
