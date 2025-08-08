/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { editEvent, getEventById, deleteEvent } from '@/lib/db';
import { withAuth } from '../../middleware';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await getEventById(eventId);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT /api/events/[id] - Edit an existing event
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req) => {
    try {
      const { id } = await context.params;

      const eventId = parseInt(id, 10);
   
      
      if (isNaN(eventId)) {
        return NextResponse.json(
          { error: 'Invalid event ID' },
          { status: 400 }
        );
      }
      
      // Parse request body
      const { title, description, date, imageUrl, hostName, videoLink } = await req.json();
      
      if (!title || !date || !imageUrl || !hostName) {
        return NextResponse.json(
          { error: 'Title, date, image URL, and host name are required' },
          { status: 400 }
        );
      }
      
      // Call the editEvent function with ID and event data
      const event = await editEvent(
        eventId,
        {
          title,
          description,
          date,
          imageUrl,
          hostName,
          videoLink,
        }
      );
      
      return NextResponse.json(event);
    } catch (error: any) {
      console.error('Error editing event:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to edit event' },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/events/[id] - Delete an event
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async () => {
    try {
      const { id } = await context.params;
      const eventId = parseInt(id, 10);
      
      if (isNaN(eventId)) {
        return NextResponse.json(
          { error: 'Invalid event ID' },
          { status: 400 }
        );
      }

      await deleteEvent(eventId);
      
      return NextResponse.json(
        { message: 'Event deleted successfully' },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error deleting event:', error);
      
      if (error.message === 'Event not found') {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      );
    }
  });
}
