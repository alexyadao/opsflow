import { NextRequest, NextResponse } from 'next/server';
import { getTicketById, updateTicket, deleteTicket } from '@/lib/data-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = getTicketById(id);

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: `Ticket ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve ticket', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const updated = updateTicket(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Ticket ${id} not found for update` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Ticket ${id} updated`,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteTicket(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Ticket ${id} not found to delete` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Ticket ${id} deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete ticket', details: String(error) },
      { status: 500 }
    );
  }
}
