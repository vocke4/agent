import { NextApiRequest, NextApiResponse } from 'next';
import { generateChatResponse } from '@/app/utils/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const aiResponse = await generateChatResponse(message);
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
