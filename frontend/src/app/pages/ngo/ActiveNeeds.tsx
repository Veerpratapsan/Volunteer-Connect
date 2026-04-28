import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { LayoutDashboard, ClipboardList, History, AlertCircle, FolderOpen, Users, MapPin, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../../api';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  volunteerCount: number;
  deadline: string;
  requiredSkills: string[];
  ngoId: string;
  ngoName: string;
  photo: string;
  checklist: ChecklistItem[];
  status: 'open' | 'in-progress' | 'completed';
}

const navItems = [
  { path: '/ngo/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/ngo/needs', label: 'Active Needs', icon: <FolderOpen className="w-5 h-5" /> },
  { path: '/ngo/requests', label: 'Requests', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/ngo/history', label: 'History', icon: <History className="w-5 h-5" /> },
  { path: '/ngo/issues', label: 'Reported Issues', icon: <AlertCircle className="w-5 h-5" /> },
];

export default function NGOActiveNeeds() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const activeNeeds = tasks.filter(t => t.status !== 'completed');

  return (
    <DashboardLayout navItems={navItems} userName="Community Care Foundation" userRole="ngo">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="border-b border-border/40 pb-6 flex flex-col justify-between items-start">
          <h2 className="text-4xl font-serif text-foreground tracking-tight">Active Needs</h2>
          <p className="text-muted-foreground mt-2 text-lg font-light">View and manage all your ongoing community initiatives.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeNeeds.map((task) => (
              <Dialog key={task.id}>
                <DialogTrigger asChild>
                  <div className="p-5 border border-border/50 rounded-xl hover:border-primary/30 transition-colors bg-card hover:shadow-md flex flex-col h-full group cursor-pointer text-left">
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <h4 className="font-serif text-lg leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                      <Badge
                        variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}
                        className={`shadow-sm whitespace-nowrap uppercase tracking-wider text-[10px] ${task.priority !== 'urgent' ? 'bg-secondary text-foreground' : 'bg-destructive/10 text-destructive border-transparent'}`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="space-y-2.5 text-sm font-medium text-muted-foreground mt-auto">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{task.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary shrink-0" />
                        <span>{task.volunteerCount} volunteers needed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                        <span>Before {task.deadline}</span>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl max-h-[85vh] sm:rounded-[2rem] p-0 border-border/40 overflow-hidden shadow-2xl flex flex-col">
                  <div className="flex-1 overflow-y-auto custom-scrollbar w-full">
                    <div className="relative h-48 w-full bg-secondary shrink-0">
                      <img src={task.photo || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80'} alt={task.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </div>
                    <DialogHeader className="px-8 pt-2 pb-0 relative z-10 -mt-12 text-left">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <DialogTitle className="text-3xl font-serif text-foreground tracking-tight">{task.title}</DialogTitle>
                        <Badge
                          variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}
                          className={`shadow-sm whitespace-nowrap uppercase tracking-wider text-xs ${task.priority !== 'urgent' ? 'bg-secondary text-foreground' : 'bg-destructive text-destructive-foreground'}`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-[15px]">{task.description}</p>
                    </DialogHeader>
                    
                    <div className="px-8 pb-8 space-y-8 mt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-secondary/30 p-4 rounded-xl border border-border/40">
                          <MapPin className="w-5 h-5 text-primary mb-2" />
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Location</p>
                          <p className="text-sm font-medium text-foreground line-clamp-2">{task.location}</p>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-xl border border-border/40">
                          <Users className="w-5 h-5 text-primary mb-2" />
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Volunteers</p>
                          <p className="text-sm font-medium text-foreground">{task.volunteerCount} Needed</p>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-xl border border-border/40">
                          <Calendar className="w-5 h-5 text-primary mb-2" />
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Deadline</p>
                          <p className="text-sm font-medium text-foreground">{task.deadline}</p>
                        </div>
                      </div>
                      
                      <div>
                        {task.checklist && task.checklist.length > 0 && (
                          <>
                            <div className="flex flex-row items-center justify-between mb-4">
                              <h4 className="text-xl font-serif text-foreground">Task Progress</h4>
                              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                                {task.checklist.filter((c: ChecklistItem) => c.completed).length} of {task.checklist.length} Steps
                              </Badge>
                            </div>
                            <div className="w-full bg-secondary h-3 rounded-full overflow-hidden mb-6 border border-border/40 shadow-inner">
                              <div 
                                className="bg-primary h-full transition-all duration-1000 ease-in-out shadow-sm" 
                                style={{ width: `${Math.round((task.checklist.filter((c: ChecklistItem) => c.completed).length / task.checklist.length) * 100)}%` }}
                              />
                            </div>
                            <div className="space-y-3">
                              {task.checklist.map((item: ChecklistItem) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-background border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${item.completed ? 'bg-primary border-primary' : 'border-border/60 bg-secondary/50'}`}>
                                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                                  </div>
                                  <span className={`text-sm ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                                    {item.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
            
            {activeNeeds.length === 0 && (
              <Card className="col-span-full p-16 text-center border border-border/40 bg-card/50 border-dashed">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3">No Active Needs</h3>
                <p className="text-muted-foreground text-lg font-light max-w-sm mx-auto">
                  You currently have no active community initiatives.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
