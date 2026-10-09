import { NextRequest, NextResponse } from 'next/server';
import { getAllTickets, createTicket } from '@/lib/data-store';
import { TicketCategory, TicketPriority, TicketStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let tickets = getAllTickets();

    if (search) {
      tickets = tickets.filter(
        (t) =>
          t.id.toLowerCase().includes(search) ||
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search) ||
          t.requester.name.toLowerCase().includes(search) ||
          (t.assetName && t.assetName.toLowerCase().includes(search))
      );
    }

    if (priority && priority !== 'All') {
      tickets = tickets.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
    }

    if (status && status !== 'All') {
      tickets = tickets.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'All') {
      tickets = tickets.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required fields validation
    if (!body.title || !body.category || !body.priority || !body.description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required ticket fields: title, category, priority, and description are mandatory.',
        },
        { status: 400 }
      );
    }

    const newTicket = createTicket({
      title: body.title.trim(),
      description: body.description.trim(),
      category: body.category as TicketCategory,
      priority: body.priority as TicketPriority,
      status: (body.status as TicketStatus) || 'Open',
      requester: {
        name: body.requesterName || 'Alex Yadao',
        email: body.requesterEmail || 'a.yadao@opsflow.internal',
        department: body.requesterDepartment || 'IT Engineering',
      },
      assignee: body.assignee
        ? {
            name: body.assignee.name,
            email: body.assignee.email,
            role: body.assignee.role || 'Support Engineer',
          }
        : null,
      assetId: body.assetId || undefined,
      assetName: body.assetName || undefined,
      tags: Array.isArray(body.tags) ? body.tags : ['Helpdesk'],
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Ticket created successfully',
        data: newTicket,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket', details: String(error) },
      { status: 500 }
    );
  }
}
