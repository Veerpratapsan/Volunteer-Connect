import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { LayoutDashboard, ClipboardList, History, MessageSquare, AlertCircle, Send, User } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/volunteer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/volunteer/tasks', label: 'Tasks', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/volunteer/history', label: 'History', icon: <History className="w-5 h-5" /> },
  { path: '/volunteer/chat', label: 'Group Chat', icon: <MessageSquare className="w-5 h-5" /> },
  { path: '/volunteer/report', label: 'Report Need', icon: <AlertCircle className="w-5 h-5" /> },
];

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: any;
}

export default function VolunteerGroupChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user, profile } = useAuth();
  const displayName =
    (profile?.name && String(profile.name)) ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Volunteer';
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        userName: displayName,
        message: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date();
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout navItems={navItems} userName={displayName} userRole="volunteer">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="border-b border-border/40 pb-6 flex flex-col justify-between items-start">
          <h2 className="text-4xl font-serif text-foreground tracking-tight">Group Chat</h2>
          <p className="text-muted-foreground mt-2 text-lg font-light">Collaborate and coordinate with fellow volunteers.</p>
        </div>

        <Card className="flex flex-col h-[calc(100vh-[18rem])] min-h-[500px] border-border/40 shadow-sm bg-card overflow-hidden">
          <div className="p-6 border-b border-border/40 bg-secondary/30 flex items-center justify-between">
            <h3 className="font-serif text-xl text-foreground">Volunteer Discussion Forum</h3>
            <span className="text-sm font-medium text-muted-foreground bg-background px-3 py-1 border border-border/50 rounded-full shadow-sm">{messages.length} messages</span>
          </div>

          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-serif text-foreground mb-2">No Messages Yet</h3>
                <p className="font-light max-w-sm">
                  Welcome to the group chat! Be the first to start the conversation and connect with other volunteers.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => {
                  const isCurrentUser = msg.userId === user?.uid;
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-4 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-secondary border border-border/50 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className={`flex-1 flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          <span className={`text-sm font-medium text-foreground ${isCurrentUser ? 'order-2' : ''}`}>
                            {msg.userName}
                          </span>
                          <span className={`text-xs text-muted-foreground font-light ${isCurrentUser ? 'order-1' : ''}`}>
                            {formatTimestamp(msg.timestamp)}
                          </span>
                        </div>
                        <div
                          className={`inline-block px-5 py-3 text-[15px] leading-relaxed shadow-sm ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                              : 'bg-secondary text-foreground rounded-2xl rounded-tl-sm border border-border/40'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-4 bg-secondary/20 border-t border-border/40">
            <div className="flex gap-3">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 h-12 rounded-xl bg-background border-border/50 focus-visible:ring-primary focus-visible:border-primary shadow-sm px-4"
              />
              <Button type="submit" size="icon" className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 transition-colors shadow-sm">
                <Send className="w-5 h-5 text-primary-foreground" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
