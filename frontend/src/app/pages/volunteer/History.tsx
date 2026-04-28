import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { LayoutDashboard, ClipboardList, History as HistoryIcon, MessageSquare, AlertCircle, Calendar, MapPin, Loader2 } from 'lucide-react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';

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
  checklist: { id: string; text: string; completed: boolean }[];
  status: 'open' | 'in-progress' | 'completed';
}

interface Activity {
  id: string;
  taskId: string;
  taskTitle: string;
  action: string;
  date: string;
  status: string;
}

const navItems = [
  { path: '/volunteer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/volunteer/tasks', label: 'Tasks', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/volunteer/history', label: 'History', icon: <HistoryIcon className="w-5 h-5" /> },
  { path: '/volunteer/chat', label: 'Group Chat', icon: <MessageSquare className="w-5 h-5" /> },
  { path: '/volunteer/report', label: 'Report Need', icon: <AlertCircle className="w-5 h-5" /> },
];

export default function VolunteerHistory() {
  const { user, profile } = useAuth();
  const displayName =
    (profile?.name && String(profile.name)) ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Volunteer';
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [activitiesRes, tasksRes] = await Promise.all([
          api.get(`/activities/volunteer/${user.uid}`),
          api.get('/tasks')
        ]);
        setActivities(activitiesRes.data.data || []);
        setTasks(tasksRes.data.data || []);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-transparent';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-transparent';
      default:
        return 'bg-muted text-muted-foreground border-transparent';
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} userName={displayName} userRole="volunteer">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} userName={displayName} userRole="volunteer">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="border-b border-border/40 pb-6 flex flex-col justify-between items-start">
          <h2 className="text-4xl font-serif text-foreground tracking-tight">Activity History</h2>
          <p className="text-muted-foreground mt-2 text-lg font-light">Your volunteering journey and impact over time.</p>
        </div>

        <div className="space-y-6">
          {activities.map((activity) => {
            const task = tasks.find(t => t.id === activity.taskId);
            return (
              <Card key={activity.id} className="p-6 border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-secondary border border-border/30 relative">
                    {task ? (
                      <img
                        src={task.photo}
                        alt={task.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <HistoryIcon className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        <h3 className="font-serif text-2xl text-foreground">{activity.taskTitle}</h3>
                        <Badge className={`${getStatusColor(activity.status)} uppercase tracking-wider text-xs font-semibold px-3 py-1 shadow-sm`}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-lg font-light">{activity.action}</p>
                    </div>

                    {task && (
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground pt-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{task.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{activity.date}</span>
                        </div>
                      </div>
                    )}

                    {task && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                        {task.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-background border-border text-muted-foreground">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {activities.length === 0 && (
          <Card className="p-16 text-center border-border/40 border-dashed bg-card/50">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
               <HistoryIcon className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-serif text-foreground mb-3">No History Yet</h3>
            <p className="text-muted-foreground font-light text-lg">
              Start volunteering to see your activity history here.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
