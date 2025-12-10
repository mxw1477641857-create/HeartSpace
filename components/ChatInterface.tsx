
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Bot, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  onAddMessage: (msg: Message) => void;
  userAvatar: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onAddMessage, userAvatar }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };
    
    onAddMessage(userMsg);
    setIsLoading(true);

    // Call API
    const responseText = await sendMessageToGemini(userText);

    // Add model message
    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    onAddMessage(modelMsg);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header Area */}
      <div className="bg-white p-4 shadow-sm z-10 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-600 shadow-inner border border-teal-50">
          <Sparkles size={20} className="text-teal-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1">
            心语 (HeartSpace)
          </h2>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 
            随时准备倾听你的心声
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm border overflow-hidden ${
                msg.role === 'user' 
                  ? 'bg-indigo-50 border-indigo-100 text-lg' 
                  : 'bg-teal-50 border-teal-100 text-teal-600'
              }`}>
                {msg.role === 'user' ? userAvatar : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div className={`p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="flex max-w-[85%] gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex-shrink-0 flex items-center justify-center mt-1">
                <Bot size={16} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="text-xs text-slate-400 mr-1">心语正在思考</span>
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-100 sticky bottom-0 z-20">
        <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-50 transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="今天发生了什么？和我聊聊吧..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 max-h-32 min-h-[44px] py-2.5 px-2 resize-none text-sm placeholder:text-slate-400"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-xl flex-shrink-0 transition-all ${
              !inputValue.trim() || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 text-white shadow-md hover:bg-teal-700 active:scale-95'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
