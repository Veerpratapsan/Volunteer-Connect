import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScrollArea } from './ui/scroll-area';

interface ChatbotProps {
  userRole: 'ngo' | 'volunteer';
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function Chatbot({ userRole }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I'm the AI Support Assistant. How can I help you with your ${userRole === 'ngo' ? 'NGO management' : 'volunteering'} tasks today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize Gemini API
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey || '');

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!apiKey) {
        throw new Error('Gemini API key is missing.');
      }

      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash'
      });

      // Simple history formatting for context (excluding the welcome message)
      const chatHistory = messages
        .filter(msg => msg.id !== 'welcome')
        .map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      // Fallback instruction strategy for gemini-pro which doesn't support systemInstruction
      let finalMessage = userMessage.content;
      if (chatHistory.length === 0) {
        finalMessage = `Context: You are an AI assistant for a Volunteer platform. The user is a ${userRole === 'ngo' ? 'NGO Administrator' : 'Volunteer'}. Provide brief, helpful answers.\n\nUser query: ${userMessage.content}`;
      }

      const chat = model.startChat({ history: chatHistory });
      const result = await chat.sendMessage(finalMessage);
      const responseText = result.response.text();

      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-bot',
        role: 'model',
        content: responseText
      }]);

    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        role: 'model',
        content: `Error: ${error instanceof Error ? error.message : String(error)}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col mb-4 shadow-2xl border-border/60 animate-in slide-in-from-bottom-5 fade-in duration-300 overflow-hidden">
          <div className="bg-primary p-4 flex items-center justify-between rounded-t-xl text-primary-foreground border-b border-border/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-sm">AI Assistant</h3>
                <p className="text-xs text-primary-foreground/70">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10 text-primary-foreground rounded-full h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 bg-secondary/10 overflow-x-hidden">
            <div className="space-y-4 w-full p-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-card border border-border shadow-sm">
                      {msg.role === 'user' ? <User className="w-4 h-4 text-muted-foreground" /> : <Bot className="w-4 h-4 text-primary" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm break-words whitespace-pre-wrap overflow-hidden ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-card border border-border/40 shadow-sm rounded-tl-sm text-foreground'
                    }`}>
                      {/* Very basic formatting support for newlines */}
                      {msg.content.split('\\n').map((line, i) => (
                        <span key={i}>{line}<br/></span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%] flex-row">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-card border border-border shadow-sm">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="p-3 rounded-2xl text-sm bg-card border border-border/40 shadow-sm rounded-tl-sm flex items-center h-[46px]">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-card border-t border-border/40 rounded-b-xl">
            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="pr-12 rounded-full border-border/50 bg-secondary/30 focus-visible:ring-primary/50"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1 top-1 bottom-1 h-auto rounded-full w-8 bg-primary hover:bg-primary/90 transition-transform hover:scale-105"
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-4 h-4 text-primary-foreground -ml-0.5" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6 text-primary-foreground" /> : <MessageCircle className="w-6 h-6 text-primary-foreground" />}
      </Button>
    </div>
  );
}
