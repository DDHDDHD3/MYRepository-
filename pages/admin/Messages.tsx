import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { Message } from '../../types';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { FadeIn } from '../../components/ui/FadeIn';

export const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const data = await db.getMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id: string) => {
    await db.markMessageRead(id);
    fetchMessages();
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold text-slate-800">Inbox</h1>
      </FadeIn>
      
      <FadeIn delay={200}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No messages yet</h3>
              <p className="text-slate-500">New contact form submissions will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-6 transition-colors ${msg.read ? 'bg-white' : 'bg-blue-50/50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className={`font-semibold text-slate-900 ${!msg.read && 'text-blue-700'}`}>
                        {msg.name}
                      </h3>
                      <span className="text-sm text-slate-500">&lt;{msg.email}&gt;</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-400">
                      <Clock size={12} className="mr-1" />
                      {new Date(msg.date).toLocaleString()}
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-slate-800 mb-2">{msg.subject}</h4>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap">{msg.body}</p>
                  
                  {!msg.read && (
                    <button 
                      onClick={() => handleMarkRead(msg.id)}
                      className="mt-4 flex items-center text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      <CheckCircle size={14} className="mr-1" /> Mark as read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};