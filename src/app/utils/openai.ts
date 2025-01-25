import OpenAI from 'openai';

const openaiKey = process.env.OPENAI_API_KEY;

if (!openaiKey) {
  throw new Error('OPENAI_API_KEY is missing - add it to Vercel environment variables');
}

const openai = new OpenAI({
  apiKey: openaiKey,
});

export async function generateChatResponse(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching OpenAI response:', error);
    throw new Error('Failed to fetch response from OpenAI');
  }
}
