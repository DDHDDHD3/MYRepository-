import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { db } from '../services/db';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am FikradAI. Ask me anything about this portfolio.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profile = db.getProfile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Use the provided API key from environment
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

      const context = `
        You are an AI assistant for the portfolio of ${profile.name}.
        Role: ${profile.title}.
        Summary: ${profile.summary}.
        Skills: ${profile.skills.map(s => s.items.join(', ')).join('; ')}.
        Experience: ${profile.experience.map(e => `${e.role} at ${e.company}`).join('; ')}.
        Education: ${profile.education.map(e => `${e.degree} at ${e.school}`).join('; ')}.
        Contact: ${profile.email}.
        
        Answer questions about ${profile.name} based on this info. Be concise, professional, and friendly.
        If asked about something not in the profile, politely say you only know about ${profile.name}'s professional background.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: context + "\n\nUser Question: " + userMessage }] }
        ]
      });

      const text = response.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
        {/* Button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-6 right-24 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce-slow group"
            aria-label="AI Assistant"
            title="Ask FikradAI"
        >
            <span className="absolute right-full mr-3 bg-white text-slate-800 px-2 py-1 rounded shadow-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
                Ask AI Assistant
            </span>
            <MessageCircle size={24} />
        </button>

        {/* Chat Window */}
        {isOpen && (
            <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-200 animate-fade-in-up origin-bottom-right font-sans">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Bot size={20} />
                        <h3 className="font-bold">FikradAI Assistant</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-white p-3 rounded-lg border border-slate-200 rounded-bl-none shadow-sm flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-blue-600" />
                                <span className="text-xs text-slate-500">Thinking...</span>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about Abdullahi..."
                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        )}
    </>
  );
};