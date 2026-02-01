import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, destination, startDate, endDate } = await request.json();

    if (!title || !destination) {
      return NextResponse.json(
        { error: 'Title and destination are required' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const prompt = `Generate a brief, engaging holiday description for a trip with these details:
- Title: ${title}
- Destination: ${destination}
${startDate ? `- Start Date: ${startDate}` : ''}
${endDate ? `- End Date: ${endDate}` : ''}

Write a short, enthusiastic description (2-3 sentences) that captures the essence of this holiday. Make it personal and inviting.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate description' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const description = data.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
