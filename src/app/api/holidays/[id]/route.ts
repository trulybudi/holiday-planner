import { NextRequest, NextResponse } from 'next/server';
import { holidayService } from '@/lib/supabase/holiday.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await holidayService.getById(params.id);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const result = await holidayService.update(params.id, {
      title: body.title,
      destination: body.destination,
      startDate: body.startDate,
      endDate: body.endDate,
      budget: body.budget,
      description: body.description,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await holidayService.delete(params.id);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
