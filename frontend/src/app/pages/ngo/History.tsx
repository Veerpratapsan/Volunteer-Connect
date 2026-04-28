import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { LayoutDashboard, ClipboardList, History as HistoryIcon, AlertCircle, Calendar, MapPin, Users, CheckCircle2, Loader2 } from 'lucide-react';
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
  completedDate?: string;
  volunteersParticipated?: number;
}

const navItems = [
  { path: '/ngo/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/ngo/requests', label: 'Requests', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/ngo/history', label: 'History', icon: <HistoryIcon className="w-5 h-5" /> },
  { path: '/ngo/issues', label: 'Reported Issues', icon: <AlertCircle className="w-5 h-5" /> },
];

export default function NGOHistory() {
  const [historyTasks, setHistoryTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/tasks');
        const completed = response.data.filter((t: Task) => t.status === 'completed');
        setHistoryTasks(completed);
      } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <DashboardLayout navItems={navItems} userName="Community Care Foundation" userRole="ngo">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="border-b border-border/40 pb-6 flex flex-col justify-between items-start">
          <h2 className="text-4xl font-serif text-foreground tracking-tight">History</h2>
          <p className="text-muted-foreground mt-2 text-lg font-light">Completed needs and initiatives tracked over time.</p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center p-24">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {historyTasks.map((task) => (
                <Card key={task.id} className="p-6 border border-border/40 shadow-sm transition-shadow hover:shadow-md bg-card">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-40 h-48 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-secondary border border-border/30">
                      <img
                        src={task.photo}
                        alt={task.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-5">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-border/20 pb-4">
                        <div>
                          <h3 className="text-2xl font-serif text-foreground leading-tight mb-2">{task.title}</h3>
                          <p className="text-muted-foreground text-base max-w-2xl">{task.description}</p>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 border-transparent shadow-sm whitespace-nowrap px-3 py-1 font-semibold text-xs tracking-wider uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          Completed
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-medium text-muted-foreground bg-secondary/30 p-4 rounded-xl border border-border/30">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <span className="truncate">{task.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary shrink-0" />
                          <span>{task.volunteersParticipated || task.volunteerCount} volunteers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary shrink-0" />
                          <span>Completed: {task.completedDate || task.deadline}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-primary shrink-0" />
                          <span className="truncate">{task.category}</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 pt-2">
                        <div>
                          <h4 className="text-xs font-semibold mb-3 tracking-wider uppercase text-muted-foreground">Skills Utilized</h4>
                          <div className="flex flex-wrap gap-2">
                            {task.requiredSkills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs bg-background border-border text-muted-foreground px-3 py-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold mb-3 tracking-wider uppercase text-muted-foreground">Completed Tasks</h4>
                          <div className="grid gap-2">
                            {task.checklist.map((item) => (
                              <div key={item.id} className="flex items-center gap-2.5 text-sm text-foreground bg-background border border-border/50 px-3 py-2 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                <span className="truncate">{item.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {historyTasks.length === 0 && (
                <Card className="p-16 text-center border-border/40 border-dashed bg-card/50">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <HistoryIcon className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-2xl font-serif text-foreground mb-3">No Completed Needs Yet</h3>
                  <p className="text-muted-foreground text-lg font-light max-w-sm mx-auto">
                    Your successfully completed initiatives will appear here.
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
