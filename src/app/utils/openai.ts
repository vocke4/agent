import OpenAI from 'openai';

// Ensure the environment variable is available only server-side
if (typeof window !== 'undefined') {
  throw new Error('openai.ts should only be used server-side');
}

const openaiKey = process.env.OPENAI_API_KEY;

if (!openaiKey) {
  throw new Error('OPENAI_API_KEY is missing - add it to Vercel environment variables');
}

export const openai = new OpenAI({
  apiKey: openaiKey,
});
