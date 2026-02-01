import { NextRequest, NextResponse } from 'next/server';
import { destinationService } from '@/lib/supabase/destination.service';

export async function GET(request: NextRequest) {
  try {
    const result = await destinationService.getAll();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ destinations: result.data });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
