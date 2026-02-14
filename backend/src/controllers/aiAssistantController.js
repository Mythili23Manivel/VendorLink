import { processQuery } from '../services/aiAssistant.js';

export const queryAssistant = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const result = await processQuery(query.trim());
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
