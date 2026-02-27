import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

/**
 * Generate a chat response using Groq API
 * @param {string} userQuery - The user's query
 * @param {Array} contextData - Optional vendor data context to include in the prompt
 * @returns {Promise<string>} - The AI-generated response
 */
export const generateGroqResponse = async (userQuery, contextData = null) => {
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
4. Keep responses under 3-4 sentences for simple queries`;

    let userPrompt = userQuery;
    
    if (contextData) {
      userPrompt = `Context data: ${JSON.stringify(contextData, null, 2)}\n\nUser query: ${userQuery}`;
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: false,
    });

    return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate AI response: ' + error.message);
  }
};

/**
 * Stream a chat response using Groq API (for real-time responses)
 * @param {string} userQuery - The user's query
 * @param {Array} contextData - Optional vendor data context
 * @returns {AsyncGenerator} - Stream of response chunks
 */
export const streamGroqResponse = async function* (userQuery, contextData = null) {
  try {
    const systemPrompt = `You are an AI assistant for VendorLink, a supplier management platform. 
You help users analyze vendor data, understand delays, mismatches, and payment risks.
Be concise, professional, and helpful.`;

    let userPrompt = userQuery;
    
    if (contextData) {
      userPrompt = `Context data: ${JSON.stringify(contextData, null, 2)}\n\nUser query: ${userQuery}`;
    }

    const stream = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Groq Stream Error:', error);
    throw new Error('Failed to stream AI response: ' + error.message);
  }
};
