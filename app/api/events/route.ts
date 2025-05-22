import { NextRequest, NextResponse } from 'next/server';
import { createEvent, getAllEvents } from '@/lib/db';
import { withAuth } from '../middleware';

// GET /api/events - Get all events
export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
  try {
    // In a real app, add authentication check here
    const { title, description, date, imageUrl, hostName, videoLink } = await req.json();
    
    if (!title || !date || !imageUrl || !hostName) {
      return NextResponse.json(
        { error: 'Title, date, image URL, and host name are required' },
        { status: 400 }
      );
    }
    
    const event = await createEvent({
      title,
      description,
      date,
      imageUrl,
      hostName,
      videoLink,
    });
    
    return NextResponse.json(event[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
  })}
