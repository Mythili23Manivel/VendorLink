/**
 * Grok (xAI) API service - uses OpenAI-compatible API with baseURL https://api.x.ai/v1
 * Set GROK_API_KEY in .env to enable.
 */

import OpenAI from 'openai';

const grokClient = process.env.GROK_API_KEY
  ? new OpenAI({
      apiKey: process.env.GROK_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    })
  : null;

const DEFAULT_MODEL = process.env.GROK_MODEL || 'grok-4-1-fast-reasoning';

/**
 * Generate a chat response using xAI Grok API
 * @param {string} userQuery - The user's query
 * @param {object} contextData - Optional vendor data context to include in the prompt
 * @returns {Promise<string>} - The AI-generated response
 */
export const generateGrokResponse = async (userQuery, contextData = null) => {
  if (!grokClient) {
    throw new Error('GROK_API_KEY is not set. Add it to your .env to use Grok.');
  }

  try {
    const systemPrompt = `You are an AI assistant for VendorLink, a supplier management platform.
You help users analyze vendor data, understand delays, mismatches, and payment risks.
Be concise, professional, and helpful. If you don't know something, say so.

Available vendor data includes:
- Vendor names, ratings, delay rates, mismatch rates
- Payment status (Pending, Paid, Overdue)
- Invoice matching status
- Risk scores calculated from vendor performance

When answering:
1. Be direct and factual
2. Reference specific data when available
3. Provide actionable insights when possible
4. Keep responses clear and under 3-4 sentences for simple queries`;

    let userPrompt = userQuery;
    if (contextData) {
      userPrompt = `Context data: ${JSON.stringify(contextData, null, 2)}\n\nUser query: ${userQuery}`;
    }

    const completion = await grokClient.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
  } catch (error) {
    console.error('Grok API Error:', error);
    throw new Error('Failed to generate AI response: ' + (error.message || 'Unknown error'));
  }
};

/**
 * Check if Grok is available (key is set)
 */
export const isGrokAvailable = () => !!process.env.GROK_API_KEY;
