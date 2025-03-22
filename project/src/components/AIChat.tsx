import React, { useState, useRef, useEffect } from 'react';
import { Brain, User, Send, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

interface AIChatProps {
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const { messages, loading, error, sendMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input;
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-2xl w-full border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Learning Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="h-[60vh] bg-white/5 rounded-xl p-4 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isAI ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    message.isAI ? 'bg-purple-500/20' : 'bg-blue-500/20'
                  }`}
                >
                  {message.isAI ? (
                    <Brain className="w-5 h-5 text-purple-400" />
                  ) : (
                    <User className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div
                  className={`flex-1 p-3 rounded-xl ${
                    message.isAI
                      ? 'bg-white/5 text-white'
                      : 'bg-blue-500/20 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 p-3 rounded-xl bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your learning journey..."
            className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;