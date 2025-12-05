import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { chatWithConcierge } from '../services/geminiService';
import { UserProfile, ChatMessage } from '../types';

interface AIConciergeProps {
  user: UserProfile;
}

const AIConcierge: React.FC<AIConciergeProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hi ${user.name.split(' ')[0]}! I'm Tumy! 🌟 Ready to get things done today?`,
      timestamp: Date.now()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await chatWithConcierge(history, userMsg.text, user);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "Oops! My brain froze for a second. Can you say that again?",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble reaching the cloud. Check your connection!",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 p-4 rounded-full shadow-2xl transition-all duration-300 z-40 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110'
        } bg-gradient-to-tr from-sky-400 to-sky-600 text-white border-2 border-white dark:border-gray-800`}
      >
        <Sparkles size={24} className="animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 w-[90vw] md:w-96 max-h-[65vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-sky-100 dark:border-gray-800 flex flex-col z-40 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-4 rounded-t-3xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="text-white font-extrabold text-lg">Tumy AI</h3>
              <span className="text-sky-100 text-xs flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse border border-white"></span>
                Always Ready
              </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="bg-white/20 p-1.5 rounded-full text-white hover:bg-white/30 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-gray-950 h-80">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-sky-500 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-sky-500" />
                 <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tumy is thinking...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-3xl">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1.5 border border-transparent focus-within:border-sky-300 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:ring-2 focus-within:ring-sky-100 dark:focus-within:ring-sky-900 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Tumy anything..."
              className="flex-1 bg-transparent border-0 px-3 py-2 text-sm focus:outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIConcierge;