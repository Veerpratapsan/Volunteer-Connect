import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import MetricCard from '../../components/MetricCard';
import Leaderboard from '../../components/Leaderboard';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { LayoutDashboard, ClipboardList, History, AlertCircle, FolderOpen, Users, AlertTriangle, CheckCircle2, Plus, MapPin, Calendar, Loader2, Sparkles } from 'lucide-react';
import { api } from '../../api';
import { toast } from 'sonner';
import { getCurrentAddress } from '../../utils/location';
import { extractNeedDataFromText } from '../../utils/ai';

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

interface NGOActivity {
  id: string;
  volunteer: string;
  task: string;
  action: string;
  time: string;
}

const navItems = [
  { path: '/ngo/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/ngo/needs', label: 'Active Needs', icon: <FolderOpen className="w-5 h-5" /> },
  { path: '/ngo/requests', label: 'Requests', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/ngo/history', label: 'History', icon: <History className="w-5 h-5" /> },
  { path: '/ngo/issues', label: 'Reported Issues', icon: <AlertCircle className="w-5 h-5" /> },
];

const ngoLeaderboard = [
  { rank: 1, name: 'Community Care Foundation', issuesResolved: 128, volunteers: 45 },
  { rank: 2, name: 'Hope for All', issuesResolved: 95, volunteers: 38 },
  { rank: 3, name: 'City Helpers United', issuesResolved: 87, volunteers: 32 },
  { rank: 4, name: 'Green Earth Initiative', issuesResolved: 72, volunteers: 28 },
  { rank: 5, name: 'Youth Empowerment Org', issuesResolved: 64, volunteers: 25 },
];

export default function NGODashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<NGOActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiRawText, setAiRawText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    location: '',
    description: '',
    volunteerCount: '',
    deadline: '',
    requiredSkills: '',
  });

  const fetchData = async () => {
    try {
      const [tasksRes, activitiesRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/activities'),
      ]);
      setTasks(tasksRes.data);
      
      // Map generic activities to NGOActivity format if needed, 
      // or just use activitiesRes.data if it matches.
      // For now assuming we might need to map or the API returns it correctly.
      setActivities(activitiesRes.data.map((a: any) => ({
        id: a.id,
        volunteer: a.volunteerName || 'Volunteer',
        task: a.taskTitle || 'Task',
        action: a.action || 'Activity',
        time: a.date || 'Recent'
      })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGetLocation = async () => {
    const address = await getCurrentAddress();
    if (address) {
      setFormData({ ...formData, location: address });
    }
  };

  const handleAIExtract = async () => {
    if (!aiRawText.trim()) return toast.error('Please enter some text');
    setIsExtracting(true);
    const toastId = toast.loading('AI is analyzing your text...');
    try {
      const data = await extractNeedDataFromText(aiRawText);
      if (data) {
        setFormData({
            ...formData,
            ...data
        });
        toast.success('Successfully extracted data!', { id: toastId });
        setAiDialogOpen(false);
        setDialogOpen(true); // Open the normal form with filled data
        setAiRawText('');
      } else {
        toast.error('Could not extract data. Please manually fill the form.', { id: toastId });
      }
    } catch (err) {
      toast.error('AI extraction failed.', { id: toastId });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        location: formData.location,
        description: formData.description,
        volunteerCount: parseInt(formData.volunteerCount, 10) || 1,
        deadline: formData.deadline,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        checklist: [], // Provide an empty array by default
      };
      
      await api.post('/tasks', payload);
      
      toast.success('Need posted successfully! Volunteers will be notified.');
      setDialogOpen(false);
      setFormData({
        title: '',
        category: '',
        priority: 'medium',
        location: '',
        description: '',
        volunteerCount: '',
        deadline: '',
        requiredSkills: '',
      });
      fetchData(); // Reload the task list
    } catch (error) {
      console.error('Failed to post need:', error);
      toast.error('Failed to post need. Please verify the fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeNeedsCount = tasks.filter(t => t.status !== 'completed').length;
  const urgentRequestsCount = tasks.filter(t => t.priority === 'urgent').length;

  return (
    <DashboardLayout navItems={navItems} userName="Community Care Foundation" userRole="ngo">
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border/40 pb-6 gap-4">
          <div>
            <h2 className="text-4xl font-serif text-foreground tracking-tight">Overview</h2>
            <p className="text-muted-foreground mt-2 text-lg font-light">Manage your community initiatives and volunteer network.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/5 h-12 text-base shadow-sm">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Quick AI Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl border-border/40 sm:rounded-[2rem] p-8">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-3xl font-serif text-foreground tracking-tight flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    AI Auto-Fill
                  </DialogTitle>
                  <p className="text-muted-foreground font-light text-lg">Paste an email, message, or scattered notes below, and our AI will organize it into a formatted Need.</p>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Textarea
                    placeholder="e.g. 'We need 5 people at Central Park immediately for flood cleanup. Bring boots.'"
                    value={aiRawText}
                    onChange={(e) => setAiRawText(e.target.value)}
                    rows={6}
                    className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary text-base p-4 rounded-xl resize-y"
                  />
                  <Button 
                    onClick={handleAIExtract} 
                    disabled={isExtracting}
                    className="w-full h-14 rounded-xl text-base bg-primary hover:bg-primary/90 mt-2 transition-all shadow-sm"
                  >
                    {isExtracting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    {isExtracting ? 'Extracting Data...' : 'Generate Form Fields'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-xl bg-primary hover:bg-primary/90 h-12 text-base shadow-sm">
                  <Plus className="w-5 h-5 mr-2" />
                  Post New Need
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] border-border/40 p-0 overflow-hidden sm:rounded-[2rem] flex flex-col shadow-2xl">
              <div className="flex-1 overflow-y-auto custom-scrollbar w-full">
                <DialogHeader className="p-8 pb-0">
                  <DialogTitle className="text-3xl font-serif text-foreground tracking-tight">Post a New Need</DialogTitle>
                  <p className="text-muted-foreground font-light text-lg">Create a new opportunity for volunteers.</p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-8 p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-foreground font-medium tracking-wide">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter task title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="category" className="text-foreground font-medium tracking-wide">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Food Security, Education"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="urgency" className="text-foreground font-medium tracking-wide">Urgency Level</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger id="urgency" className="bg-input-background border-transparent focus:ring-primary h-12 px-4 rounded-xl shadow-none">
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/40">
                          <SelectItem value="low" className="rounded-lg">Low Urgency</SelectItem>
                          <SelectItem value="medium" className="rounded-lg">Medium</SelectItem>
                          <SelectItem value="high" className="rounded-lg">High</SelectItem>
                          <SelectItem value="urgent" className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive">Critical / Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="volunteerCount" className="text-foreground font-medium tracking-wide">Volunteers Needed</Label>
                      <Input
                        id="volunteerCount"
                        type="number"
                        placeholder="Number of volunteers"
                        value={formData.volunteerCount}
                        onChange={(e) => setFormData({ ...formData, volunteerCount: e.target.value })}
                        required
                        className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                      />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="location" className="text-foreground font-medium tracking-wide">Location</Label>
                      <div className="flex gap-3">
                        <Input
                          id="location"
                          placeholder="Enter location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                          className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                        />
                        <Button type="button" variant="outline" onClick={handleGetLocation} className="h-12 w-12 rounded-xl shrink-0 p-0 border-border/50 hover:bg-secondary/50">
                          <MapPin className="w-5 h-5 text-primary" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="deadline" className="text-foreground font-medium tracking-wide">Application Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                        className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary text-foreground h-12 px-4 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-foreground font-medium tracking-wide">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the task and requirements"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                      className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 px-4 py-3 rounded-xl resize-y"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="skills" className="text-foreground font-medium tracking-wide">Required Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., Teaching, Communication, First Aid"
                      value={formData.requiredSkills}
                      onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                      className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                    />
                  </div>

                  <div className="pt-4 border-t border-border/40">
                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-base rounded-xl bg-primary hover:bg-primary/90 transition-colors shadow-sm">
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      {isSubmitting ? 'Posting...' : 'Post Need'}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-24">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Active"
                value={activeNeedsCount}
                icon={FolderOpen}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
              />
              <MetricCard
                title="Assigned"
                value={45}
                icon={Users}
                iconColor="text-emerald-600"
                iconBgColor="bg-emerald-50"
              />
              <MetricCard
                title="Urgent Needs"
                value={urgentRequestsCount}
                icon={AlertTriangle}
                iconColor="text-destructive"
                iconBgColor="bg-destructive/10"
              />
              <MetricCard
                title="Resolved"
                value={128}
                icon={CheckCircle2}
                iconColor="text-blue-600"
                iconBgColor="bg-blue-50"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Leaderboard */}
              <Leaderboard
                title="Top NGOs"
                entries={ngoLeaderboard}
                type="ngo"
              />

              {/* Recent Activity */}
              <Card className="p-8 border-border/40 shadow-sm bg-card hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-serif text-foreground mb-6">Recent Coordination</h3>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4 bg-secondary/50 border border-border/30 rounded-xl hover:bg-secondary transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-base font-medium text-foreground">{activity.volunteer}</p>
                          <p className="text-sm text-muted-foreground truncate">{activity.task}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{activity.action}</span>
                            <span className="text-xs text-muted-foreground/60">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No recent activities</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Active Needs Overview */}
            <Card className="p-8 border-border/40 shadow-sm bg-card">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-3">
                <h3 className="text-2xl font-serif text-foreground">Active Needs</h3>
                 <Link to="/ngo/needs">
                   <Button variant="link" className="text-primary p-0 h-auto font-medium">View All</Button>
                 </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.filter(t => t.status !== 'completed').slice(0, 6).map((task) => (
                  <Dialog key={task.id}>
                    <DialogTrigger asChild>
                      <div className="p-5 border border-border/50 rounded-xl hover:border-primary/30 transition-colors bg-background flex flex-col h-full group cursor-pointer text-left">
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
                          <img src={task.photo} alt={task.title} className="w-full h-full object-cover" />
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
                            <div className="flex flex-row items-center justify-between mb-4">
                              <h4 className="text-xl font-serif text-foreground">Task Progress</h4>
                              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                                {task.checklist?.filter(c => c.completed)?.length || 0} of {task.checklist?.length || 0} Steps
                              </Badge>
                            </div>
                            <div className="w-full bg-secondary h-3 rounded-full overflow-hidden mb-6 border border-border/40 shadow-inner">
                              <div 
                                className="bg-primary h-full transition-all duration-1000 ease-in-out shadow-sm" 
                                style={{ width: `${(task.checklist && task.checklist.length > 0) ? Math.round((task.checklist.filter(c => c.completed).length / task.checklist.length) * 100) : 0}%` }}
                              />
                            </div>
                            <div className="space-y-3">
                              {(task.checklist || []).map((item) => (
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
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
                {tasks.filter(t => t.status !== 'completed').length === 0 && (
                  <p className="text-center text-muted-foreground col-span-full py-12">No active needs found.</p>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
