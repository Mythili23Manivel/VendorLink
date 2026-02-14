import { useState } from 'react';
import { aiAssistantAPI } from '../services/api';

export const useAiAssistantViewModel = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your VendorLink AI assistant. I can help you with: vendor delays, mismatch analysis, high-risk vendors, payment risk prediction, and dashboard summaries. Try asking: "Why is Vendor X delayed?" or "Show vendors with mismatch above 10%" or "Which vendor is high risk?"',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendQuery = async (query) => {
    if (!query?.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: query.trim(), timestamp: new Date() },
    ]);
    setLoading(true);
    setError(null);

    try {
      const res = await aiAssistantAPI.query(query.trim());
      const data = res.data.data;

      let content = data.response;
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        content += '\n\n' + formatData(data.data);
      } else if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        content += '\n\n' + formatObject(data.data);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content,
          rawData: data,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get response');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          error: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared. How can I help you?',
        timestamp: new Date(),
      },
    ]);
  };

  return { messages, loading, error, sendQuery, clearChat };
};

const formatData = (arr) => {
  if (arr.length === 0) return '';
  const first = arr[0];
  if (typeof first === 'object') {
    return arr.map((item, i) => `${i + 1}. ${JSON.stringify(item)}`).join('\n');
  }
  return arr.join(', ');
};

const formatObject = (obj) => {
  return Object.entries(obj)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : v}`)
    .join('\n');
}
