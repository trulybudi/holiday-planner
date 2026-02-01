import { NextRequest, NextResponse } from 'next/server';
import { itineraryService } from '@/lib/supabase/itinerary.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; itineraryId: string } }
) {
  try {
    const itinerary = await itineraryService.getById(params.itineraryId);
    if (!itinerary) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itineraryId: string } }
) {
  try {
    const body = await request.json();
    const updatedItinerary = await itineraryService.update(
      params.itineraryId,
      body
    );
    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to update itinerary' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itineraryId: string } }
) {
  try {
    const deleted = await itineraryService.delete(params.itineraryId);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to delete itinerary' },
      { status: 500 }
    );
  }
}
