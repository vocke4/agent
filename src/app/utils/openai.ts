import OpenAI from 'openai';

const openaiKey = process.env.OPENAI_API_KEY;

if (!openaiKey) {
  throw new Error('OPENAI_API_KEY is missing - add it to Vercel environment variables');
}

export const openai = new OpenAI({
  apiKey: openaiKey,
});

export async function generateChatResponse(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    if (!response.choices || !response.choices[0]?.message?.content) {
      throw new Error('Invalid response structure from OpenAI');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching OpenAI response:', error);
    throw new Error(`Failed to fetch response: ${(error as any).message || error}`);
  }
}
