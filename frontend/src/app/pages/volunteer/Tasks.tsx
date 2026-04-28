import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { LayoutDashboard, ClipboardList, History, MessageSquare, AlertCircle, MapPin, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, getResponseList } from '../../api';
import { useAuth } from '../../context/AuthContext';

// Define Task type locally to avoid importing from mockData
export interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  volunteerCount: number;
  deadline: string;
  requiredSkills: string[];
  ngoId: string;
  ngoName: string;
  photo: string;
  checklist: { id: string; text: string; completed: boolean }[];
  status: 'open' | 'in-progress' | 'completed';
}

const navItems = [
  { path: '/volunteer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/volunteer/tasks', label: 'Tasks', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/volunteer/history', label: 'History', icon: <History className="w-5 h-5" /> },
  { path: '/volunteer/chat', label: 'Group Chat', icon: <MessageSquare className="w-5 h-5" /> },
  { path: '/volunteer/report', label: 'Report Need', icon: <AlertCircle className="w-5 h-5" /> },
];

export default function VolunteerTasks() {
  const { profile, user } = useAuth();
  const displayName =
    (profile?.name && String(profile.name)) ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Volunteer';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(getResponseList<Task>(response));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-destructive/10 text-destructive border-transparent';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-transparent';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-transparent';
      case 'low':
        return 'bg-primary/10 text-primary border-transparent';
      default:
        return 'bg-muted text-muted-foreground border-transparent';
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleInterested = async () => {
    if (!selectedTask) return;
    try {
      await api.post('/requests', {
        taskId: selectedTask.id,
        taskTitle: selectedTask.title,
      });
      toast.success('Interest registered! The NGO will review your profile.');
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to register interest:', error);
      toast.error('Failed to register interest. Please try again later.');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4;
    const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4;
    return priorityA - priorityB;
  });

  return (
    <DashboardLayout navItems={navItems} userName={displayName} userRole="volunteer">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="border-b border-border/40 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-4xl font-serif text-foreground tracking-tight">Available Tasks</h2>
            <p className="text-muted-foreground mt-2 text-lg font-light">Find opportunities sorted by impact and proximity.</p>
          </div>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            {loading ? 'Loading...' : `${sortedTasks.length} Assignments Found`}
          </Badge>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTasks.map((task) => (
              <Card
                key={task.id}
                className="group overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/40 bg-card flex flex-col"
                onClick={() => handleTaskClick(task)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  {task.photo && (
                    <img
                      src={task.photo}
                      alt={task.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getPriorityColor(task.priority)} shadow-sm uppercase tracking-wider font-semibold text-xs px-3 py-1 flex items-center`}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-xl tracking-tight text-foreground line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                    {task.title}
                  </h3>
                  
                  <div className="space-y-3 text-sm text-muted-foreground font-medium flex-1">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="line-clamp-1">{task.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-primary shrink-0" />
                      <span>{task.volunteerCount} volunteers needed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span>Before {task.deadline}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border/40 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {task.requiredSkills?.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs bg-background text-muted-foreground border-border">
                          {skill}
                        </Badge>
                      ))}
                      {task.requiredSkills && task.requiredSkills.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-background text-muted-foreground border-border">
                          +{task.requiredSkills.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 h-12 text-base transition-colors" onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task);
                    }}>
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Task Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-border/40 gap-0 group rounded-2xl">
            {selectedTask && (
              <div className="flex flex-col">
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-secondary">
                  {selectedTask.photo && (
                    <img
                      src={selectedTask.photo}
                      alt={selectedTask.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <DialogTitle className="text-3xl sm:text-4xl font-serif text-white tracking-tight leading-tight">
                      {selectedTask.title}
                    </DialogTitle>
                    <p className="text-white/80 mt-2 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {selectedTask.location}
                    </p>
                  </div>
                </div>

                <div className="p-8 space-y-8 bg-card">
                  <div className="flex flex-wrap gap-3">
                     <Badge className={`${getPriorityColor(selectedTask.priority)} px-3 py-1 uppercase tracking-wider text-xs font-bold`}>
                        {selectedTask.priority} Priority
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1 font-medium bg-secondary text-primary">
                        NGO: {selectedTask.ngoName}
                      </Badge>
                  </div>

                  <div>
                    <h4 className="font-serif text-2xl mb-3 text-foreground">Overview</h4>
                    <p className="text-muted-foreground leading-relaxed text-lg font-light">
                       {selectedTask.description}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 p-6 bg-secondary/30 rounded-2xl border border-border/30">
                    <div className="flex gap-4 items-start">
                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                       </div>
                       <div>
                         <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Volunteers Required</p>
                         <p className="text-xl font-semibold text-foreground mt-0.5">{selectedTask.volunteerCount}</p>
                       </div>
                    </div>
                    <div className="flex gap-4 items-start">
                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                       </div>
                       <div>
                         <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Must complete by</p>
                         <p className="text-xl font-semibold text-foreground mt-0.5">{selectedTask.deadline}</p>
                       </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-2xl mb-4 text-foreground">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.requiredSkills?.map((skill) => (
                        <Badge key={skill} variant="outline" className="px-4 py-2 border-primary/20 bg-primary/5 text-foreground text-sm font-medium">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-2xl mb-4 text-foreground">Action Plan</h4>
                    <div className="space-y-3">
                      {selectedTask.checklist?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                          <span className="text-foreground font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/40">
                    <Button className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 transition-colors" onClick={handleInterested}>
                      Offer Your Help
                    </Button>
                    <p className="text-center text-sm text-muted-foreground mt-4 font-light">
                       The organization will be notified immediately of your interest.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
