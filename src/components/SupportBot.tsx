import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Bot, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  options?: string[];
}

export const SupportBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I am Lumina Assistant. How can I help you today?',
      sender: 'bot',
      options: ['Order Status', 'Shipping Info', 'Returns', 'Other']
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOptionClick = (option: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text: option,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMsg]);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let botResponse: Message;
      
      switch (option) {
        case 'Order Status':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'You can check your order status in the "You" page under the "Orders" tab. Would you like to know about a specific order?',
            sender: 'bot',
            options: ['Yes, help me', 'No, thanks']
          };
          break;
        case 'Shipping Info':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'We offer free shipping on orders over $150. Standard delivery takes 3-5 business days.',
            sender: 'bot',
            options: ['Track my package', 'International shipping']
          };
          break;
        case 'Returns':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'We have a 30-day hassle-free return policy. Items must be in original condition.',
            sender: 'bot',
            options: ['Start a return', 'Return policy details']
          };
          break;
        case 'Yes, help me':
        case 'Track my package':
        case 'Start a return':
        case 'Other':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'I have notified our support team about your request. A human agent will catch you ASAP via email!',
            sender: 'bot'
          };
          break;
        default:
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'Is there anything else I can help you with?',
            sender: 'bot',
            options: ['Order Status', 'Shipping Info', 'Returns', 'Other']
          };
      }
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-stone-900 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Lumina Support</h3>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest">Always Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex flex-col",
                  msg.sender === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                    msg.sender === 'user' 
                      ? "bg-stone-100 text-stone-900 rounded-tr-none" 
                      : "bg-stone-900 text-white rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          className="text-xs font-bold border border-stone-200 px-3 py-2 rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="bg-stone-900 text-white p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-white rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-white rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100">
              <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 text-sm focus:outline-none"
                  disabled
                />
                <button className="text-stone-300 cursor-not-allowed">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-stone-800 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
