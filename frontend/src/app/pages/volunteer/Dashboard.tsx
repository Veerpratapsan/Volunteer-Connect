import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import MetricCard from '../../components/MetricCard';
import Leaderboard from '../../components/Leaderboard';
import MapView from '../../components/MapView';
import { Card } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Clock, CheckCircle2, Briefcase, LayoutDashboard, ClipboardList, History, MessageSquare, AlertCircle, Heart, Loader2 } from 'lucide-react';
import { api, getResponseList } from '../../api';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

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
  { path: '/volunteer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/volunteer/tasks', label: 'Tasks', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/volunteer/history', label: 'History', icon: <History className="w-5 h-5" /> },
  { path: '/volunteer/chat', label: 'Group Chat', icon: <MessageSquare className="w-5 h-5" /> },
  { path: '/volunteer/report', label: 'Report Need', icon: <AlertCircle className="w-5 h-5" /> },
];

const volunteerLeaderboard = [
  { rank: 1, name: 'Michael Chen', tasksCompleted: 58, hours: 320 },
  { rank: 2, name: 'Sarah Johnson', tasksCompleted: 42, hours: 245 },
  { rank: 3, name: 'Emily Rodriguez', tasksCompleted: 35, hours: 189 },
  { rank: 4, name: 'David Kim', tasksCompleted: 31, hours: 165 },
  { rank: 5, name: 'Jessica Lee', tasksCompleted: 28, hours: 142 },
];

export default function VolunteerDashboard() {
  const { profile, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName =
    (profile?.name && String(profile.name)) ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Volunteer';
  const totalHours = Number(profile?.totalHours ?? 0);
  const tasksCompleted = Number(profile?.tasksCompleted ?? 0);
  const activeAssignments = Number(profile?.activeAssignments ?? 0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(getResponseList<Task>(response));
      } catch (error) {
        console.error("Failed to fetch tasks", error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Fallback to the first available task if no task is explicitly "in-progress"
  const activeTask = tasks.find(t => t.status === 'in-progress') || tasks[0];
  
  const urgentNeeds = tasks.filter(t => t.priority === 'urgent');
  // Fallback to "high" priority tasks if there are no "urgent" ones
  const displayUrgentNeeds = urgentNeeds.length > 0 
    ? urgentNeeds.slice(0, 3) 
    : tasks.filter(t => t.priority === 'high').slice(0, 3);
  const mapLocations = tasks.map(t => ({
    id: t.id,
    title: t.title,
    coordinates: t.coordinates || { lat: 40.7128, lng: -74.0060 },
    priority: t.priority,
  }));

  const completedTasksCount = activeTask?.checklist?.filter((c: ChecklistItem) => c.completed).length || 0;
  const totalTasksCount = activeTask?.checklist?.length || 1;
  const progress = (completedTasksCount / totalTasksCount) * 100;

  return (
    <DashboardLayout navItems={navItems} userName={displayName} userRole="volunteer">
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="border-b border-border/40 pb-6">
          <h2 className="text-4xl font-serif text-foreground tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-2 text-lg font-light">Track your contributions and upcoming activities.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-24">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Hours"
                value={totalHours}
                icon={Clock}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
              />
              <MetricCard
                title="Tasks Completed"
                value={tasksCompleted}
                icon={Heart}
                iconColor="text-orange-600"
                iconBgColor="bg-orange-50"
              />
              <MetricCard
                title="Active Assignments"
                value={activeAssignments}
                icon={Briefcase}
                iconColor="text-emerald-600"
                iconBgColor="bg-emerald-50"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Leaderboard */}
              <Leaderboard
                title="Top Volunteers"
                entries={volunteerLeaderboard}
                type="volunteer"
              />

              {/* Urgent Needs */}
              <Card className="p-8 border-border/40 shadow-sm bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-serif text-foreground">Urgent Needs</h3>
                  <Badge variant="destructive" className="bg-destructive/10 text-destructive border-0">High Priority</Badge>
                </div>
                <div className="space-y-4">
                  {displayUrgentNeeds.map((need) => (
                    <div key={need.id} className="p-5 bg-destructive/5 border border-destructive/10 rounded-xl hover:bg-destructive/10 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-2.5 h-2.5 bg-destructive rounded-full mt-2 shrink-0 animate-pulse" />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-lg">{need.title}</h4>
                          <p className="text-sm text-foreground/70 mt-1 font-light">{need.location}</p>
                          <p className="text-xs text-destructive mt-3 font-medium uppercase tracking-wider">Deadline: {need.deadline}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {displayUrgentNeeds.length === 0 && (
                    <p className="text-center text-muted-foreground py-8 font-light">No urgent needs at the moment.</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Active Task */}
            {activeTask ? (
              <Card className="p-8 border-border/40 shadow-sm bg-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-serif text-foreground">Current Assignment</h3>
                  {activeTask.status !== 'in-progress' && (
                    <Badge variant="outline" className="bg-secondary text-muted-foreground">Suggested Task</Badge>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6 flex flex-col justify-center">
                    <div>
                      <h4 className="font-serif text-2xl text-foreground mb-1">{activeTask.title}</h4>
                      <p className="text-muted-foreground font-light text-lg">{activeTask.location}</p>
                    </div>

                    <div className="p-5 bg-secondary rounded-xl border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Progress</span>
                        <span className="text-sm font-bold text-primary">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-3 rounded-full bg-border" />
                      <p className="text-xs text-muted-foreground mt-3 text-right">
                        {completedTasksCount} of {totalTasksCount} steps completed
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-foreground uppercase tracking-wide text-sm mb-4">Checklist</h5>
                    <div className="space-y-3">
                      {(activeTask.checklist || []).map((item) => (
                        <div key={item.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                          item.completed ? 'bg-secondary/50 border-transparent' : 'bg-background border-border/50 hover:border-primary/30'
                        }`}>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              item.completed
                                ? 'bg-primary border-primary'
                                : 'border-border'
                            }`}
                          >
                            {item.completed && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className={`text-base flex-1 ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                      {(!activeTask.checklist || activeTask.checklist.length === 0) && (
                        <p className="text-sm text-muted-foreground italic">No checklist items defined for this task.</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 border-border/40 shadow-sm bg-card text-center border-dashed">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-2">No Active Assignments</h3>
                <p className="text-muted-foreground font-light">You are currently not assigned to any open tasks.</p>
              </Card>
            )}

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border/40 shadow-sm">
               <MapView locations={mapLocations} />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
