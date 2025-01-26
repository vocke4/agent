import OpenAI from 'openai';

const openaiKey = process.env.OPENAI_API_KEY;

if (!openaiKey) {
  throw new Error('OPENAI_API_KEY is missing - add it to Vercel environment variables');
}

// Initialize OpenAI with API key
export const openai = new OpenAI({
  apiKey: openaiKey,
});

export async function generateChatResponse(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',  // Updated to GPT-4o Mini
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7, // You can adjust for creativity
      max_tokens: 3000,  // Adjust the response length if needed
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching OpenAI response:', error);
    throw new Error('Failed to fetch response from OpenAI');
  }
}
