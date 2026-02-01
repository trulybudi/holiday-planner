import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { destination, date, field, currentValue } = await request.json();

    if (!destination || !date || !field) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, date, field' },
        { status: 400 }
      );
    }

    const fieldPrompts: Record<string, string> = {
      activity: `You are a travel assistant. Suggest a great activity or thing to do in ${destination} on ${date}. 
${currentValue ? `The user is already thinking about: "${currentValue}". Suggest a similar or complementary activity.` : 'Suggest a popular tourist activity or local experience.'}
Respond with ONLY the activity name, nothing else. Max 50 characters.`,

      location: `You are a travel assistant. Suggest a specific location or venue in ${destination} to visit on ${date}.
${currentValue ? `Related to: "${currentValue}". Suggest where to do this activity.` : 'Suggest a popular landmark, restaurant, museum, or attraction.'}
Respond with ONLY the location name, nothing else. Max 50 characters.`,

      notes: `You are a travel assistant. Suggest helpful tips or notes for visiting ${destination} on ${date}.
${currentValue ? `For activity: "${currentValue}". Suggest tips like best time to visit, what to bring, etc.` : 'Suggest general travel tips.'}
Respond with ONLY practical tips, nothing else. Max 100 characters.`,
    };

    const prompt = fieldPrompts[field];
    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid field. Must be: activity, location, or notes' },
        { status: 400 }
      );
    }

    const message = await groq.messages.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const suggestion =
      message.content[0].type === 'text'
        ? message.content[0].text.trim()
        : 'Unable to generate suggestion';

    return NextResponse.json({
      success: true,
      suggestion,
    });
  } catch (error) {
    console.error('Error generating itinerary suggestion:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate suggestion',
      },
      { status: 500 }
    );
  }
}
