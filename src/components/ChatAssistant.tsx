import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Sparkles } from 'lucide-react';
import { sendMessage } from '@/services/gemini';
import { Product } from '@/types';

interface ChatAssistantProps {
    products?: Product[];
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ products = [] }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hi! I'm your OBRA sales assistant. Looking for something specific? Ask me about our desks, chairs, or cabinets!" }
    ]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages((prev: Message[]) => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        const response = await sendMessage(userMsg, products);
        
        setMessages((prev: Message[]) => [...prev, { role: 'model', text: response }]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 print:hidden flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col pointer-events-auto transition-all animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-teal-400" />
                            <span className="font-bold">OBRA Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-teal-400 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4">
                        {messages.map((msg: Message, idx: number) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-teal-600 text-white rounded-br-none' 
                                        : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none prose prose-sm'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100">
                                    <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask about prices, stock..."
                            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none"
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 pointer-events-auto group"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 group-hover:text-teal-400" />}
            </button>
        </div>
    );
};