import { useState, useRef, useEffect } from 'react';
import { useAiAssistantViewModel } from '../hooks/useAiAssistantViewModel';

const SUGGESTIONS = [
  'Why is Vendor A delayed?',
  'Show vendors with mismatch above 10%',
  'Which vendor is high risk?',
  'Predict next payment risk',
  'Dashboard overview',
];

export default function AiAssistant() {
  const vm = useAiAssistantViewModel();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [vm.messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    vm.sendQuery(input);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-white mb-2">AI Assistant</h1>
      <p className="text-slate-400 mb-6">Ask questions about vendors, payments, risks, and get insights.</p>

      <div className="card flex flex-col h-[ calc(100vh-220px)] min-h-[400px]">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {vm.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary-500/30 text-white'
                    : msg.error
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-slate-700/50 text-slate-200'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {vm.loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/50 rounded-lg px-4 py-3">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask a question..."
            className="input-field flex-1"
          />
          <button onClick={handleSend} disabled={vm.loading} className="btn-primary">
            Send
          </button>
          <button onClick={vm.clearChat} className="btn-secondary">
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-slate-500 text-sm mb-2">Suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => vm.sendQuery(s)}
              disabled={vm.loading}
              className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 text-sm hover:border-primary-500/50 hover:text-primary-400 transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
