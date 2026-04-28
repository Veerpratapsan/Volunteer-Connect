import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { LayoutDashboard, ClipboardList, History, AlertCircle, User, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { api, getResponseList } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

interface VolunteerRequest {
  id: string;
  volunteerId: string;
  volunteerName: string;
  volunteerSkills: string[];
  taskId: string;
  taskTitle: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
}

interface Task {
  id: string;
  title: string;
  requiredSkills: string[];
  ngoId: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  skills: string[];
  profilePicture: string;
  totalHours: number;
  tasksCompleted: number;
  activeAssignments: number;
}

const navItems = [
  { path: '/ngo/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/ngo/requests', label: 'Requests', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/ngo/history', label: 'History', icon: <History className="w-5 h-5" /> },
  { path: '/ngo/issues', label: 'Reported Issues', icon: <AlertCircle className="w-5 h-5" /> },
];

export default function NGORequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reopenedRequests, setReopenedRequests] = useState<string[]>([]);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      const [requestsRes, tasksRes] = await Promise.all([
        api.get('/requests'),
        api.get('/tasks')
      ]);
      const allRequests = getResponseList<VolunteerRequest>(requestsRes);
      const allTasks = getResponseList<Task>(tasksRes);
      
      // Filter requests for tasks owned by this NGO
      // For demo purposes, if this NGO hasn't created any tasks, show all requests
      const myTasks = allTasks.filter((t: Task) => t.ngoId === user.uid);
      const taskIdsToMatch = myTasks.length > 0 
        ? new Set(myTasks.map((t: Task) => t.id)) 
        : new Set(allTasks.map((t: Task) => t.id));
      
      setRequests(allRequests.filter((r: VolunteerRequest) => taskIdsToMatch.has(r.taskId)));
      setTasks(myTasks.length > 0 ? myTasks : allTasks);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleViewProfile = async (volunteerId: string) => {
    try {
      // For now, since we don't have a direct get volunteer profile by ID endpoint
      // and we need to show some data, we'll simulate it using the data from the request.
      const request = requests.find(r => r.volunteerId === volunteerId);
      if (request) {
        setSelectedVolunteer({
          id: request.volunteerId,
          name: request.volunteerName,
          email: `${request.volunteerName.toLowerCase().replace(' ', '.')}@example.com`,
          phone: '+1-555-0000',
          address: 'New York, NY',
          skills: request.volunteerSkills,
          profilePicture: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150`,
          totalHours: 120,
          tasksCompleted: 15,
          activeAssignments: 2,
        });
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching volunteer profile:', error);
    }
  };

  const handleAccept = async (requestId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/requests/${requestId}`, { status: 'accepted' });
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' as const } : req
      ));
      setReopenedRequests(reopenedRequests.filter(id => id !== requestId));
      toast.success('Volunteer request accepted!');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/requests/${requestId}`, { status: 'rejected' });
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      ));
      setReopenedRequests(reopenedRequests.filter(id => id !== requestId));
      toast.error('Volunteer request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const toggleReopen = (requestId: string) => {
    if (reopenedRequests.includes(requestId)) {
      setReopenedRequests(reopenedRequests.filter(id => id !== requestId));
    } else {
      setReopenedRequests([...reopenedRequests, requestId]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-transparent';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-transparent';
      default:
        return 'bg-amber-50 text-amber-700 border-transparent';
    }
  };

  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'rejected' && b.status !== 'rejected') return 1;
    if (b.status === 'rejected' && a.status !== 'rejected') return -1;
    return 0;
  });

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} userName={user?.displayName || "NGO"} userRole="ngo">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} userName={user?.displayName || "NGO"} userRole="ngo">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="border-b border-border/40 pb-6 flex flex-col justify-between items-start">
          <h2 className="text-4xl font-serif text-foreground tracking-tight">Volunteer Requests</h2>
          <p className="text-muted-foreground mt-2 text-lg font-light">Review and manage volunteer applications.</p>
        </div>

        <div className="space-y-6">
          {sortedRequests.map((request) => {
            const task = tasks.find(t => t.id === request.taskId);
            const isRejected = request.status === 'rejected';
            const isReopened = reopenedRequests.includes(request.id);
            const showActions = request.status === 'pending' || isReopened;

            return (
              <Card 
                key={request.id} 
                onClick={() => isRejected && toggleReopen(request.id)}
                className={`p-5 border border-border/40 shadow-sm transition-all duration-300 hover:shadow-md ${isRejected ? 'opacity-60 bg-muted/20 grayscale-[30%] cursor-pointer hover:opacity-100 hover:grayscale-0' : 'bg-card'}`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className={`w-12 h-12 border rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isRejected ? 'bg-background border-border/10' : 'bg-secondary border-border/30'}`}>
                    <User className="w-6 h-6 text-muted-foreground/60" />
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 border-b border-border/20 pb-3">
                      <div>
                        <h3 className="text-xl font-serif text-foreground leading-tight mb-1">{request.volunteerName}</h3>
                        <p className="text-sm text-muted-foreground font-medium">Applied for: <span className="text-foreground">{request.taskTitle}</span></p>
                        <p className="text-xs text-muted-foreground/70 mt-1 uppercase tracking-wide">Submitted {request.date}</p>
                      </div>
                      <Badge className={`${getStatusColor(request.status)} uppercase tracking-wider text-[10px] font-semibold px-2.5 py-1 shadow-sm`}>
                        {request.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 items-stretch gap-4">
                      <div className={`border p-3 rounded-xl flex flex-col justify-center transition-colors ${isRejected ? 'bg-background/20 border-border/10' : 'bg-card border-border/30 shadow-sm'}`}>
                        <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Skills Match</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {request.volunteerSkills.map((skill) => (
                            <Badge key={skill} variant="outline" className={`text-[11px] px-2.5 py-0.5 ${isRejected ? 'border-border/30 text-muted-foreground/50' : 'bg-background border-border text-muted-foreground shadow-sm'}`}>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {task ? (
                        <div className={`border p-3 rounded-xl flex flex-col justify-center transition-colors ${isRejected ? 'bg-background/30 border-border/10' : 'bg-secondary/30 border-border/30 shadow-sm'}`}>
                          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Task Dependencies</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {task.requiredSkills.map((skill) => {
                              const hasSkill = request.volunteerSkills.includes(skill);
                              return (
                                <Badge
                                  key={skill}
                                  variant={hasSkill ? 'default' : 'secondary'}
                                  className={`text-[10px] px-2 py-0.5 shadow-sm ${hasSkill ? (isRejected ? 'bg-primary/5 text-primary/50 border-primary/10' : 'bg-primary/10 text-primary border-primary/20') : 'bg-background text-muted-foreground/50 border-border/40'}`}
                                >
                                  {skill}
                                  {hasSkill && <CheckCircle2 className={`w-3 h-3 ml-1 inline ${isRejected ? 'text-primary/50' : 'text-primary'}`} />}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      ) : <div />}
                    </div>

                    {(showActions || isRejected) && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button
                          variant="outline"
                          className="rounded-lg h-9 px-4 text-sm border-border/50 hover:bg-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(request.volunteerId);
                          }}
                        >
                          View Full Profile
                        </Button>
                        {showActions && (
                          <>
                            <Button
                              className="rounded-lg h-9 px-4 text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                              onClick={(e) => handleAccept(request.id, e)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              Accept Request
                            </Button>
                            {!isRejected && (
                              <Button
                                variant="outline"
                                className="rounded-lg h-9 px-4 text-sm border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive"
                                onClick={(e) => handleReject(request.id, e)}
                              >
                                <XCircle className="w-4 h-4 mr-1.5" />
                                Decline
                              </Button>
                            )}
                          </>
                        )}
                        {isRejected && !isReopened && (
                          <div className="flex items-center text-xs font-medium text-muted-foreground ml-2 animate-in fade-in">
                            Click card to reconsider
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {requests.length === 0 && (
            <Card className="p-16 text-center border border-border/40 bg-card/50 border-dashed">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardList className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-serif text-foreground mb-3">No Requests Yet</h3>
              <p className="text-muted-foreground text-lg font-light max-w-sm mx-auto">
                Volunteer requests will appear here once they apply for your tasks.
              </p>
            </Card>
          )}
        </div>

        {/* Volunteer Profile Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl border-border/40 p-0 overflow-hidden sm:rounded-[2rem]">
            <DialogHeader className="p-8 pb-4 bg-secondary/20 border-b border-border/40">
              <DialogTitle className="text-2xl font-serif text-foreground">Volunteer Profile</DialogTitle>
            </DialogHeader>
            {selectedVolunteer && (
              <div className="space-y-8 p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary border-2 border-border/50 shrink-0 shadow-sm">
                    <img
                      src={selectedVolunteer.profilePicture}
                      alt={selectedVolunteer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-3xl font-serif text-foreground mb-1">{selectedVolunteer.name}</h3>
                    <p className="text-muted-foreground font-medium text-lg">{selectedVolunteer.email}</p>
                    <p className="text-muted-foreground/80 mt-0.5">{selectedVolunteer.phone}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t border-border/40 pt-8">
                  <div>
                    <h4 className="font-semibold mb-3 uppercase tracking-wider text-sm text-muted-foreground">Location</h4>
                    <p className="text-foreground text-lg">{selectedVolunteer.address}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 uppercase tracking-wider text-sm text-muted-foreground">Demonstrated Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1 font-medium bg-secondary text-foreground border border-border/40">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
                  <div className="text-center p-5 bg-secondary/30 rounded-xl border border-border/30">
                    <p className="text-3xl font-serif text-primary mb-1">{selectedVolunteer.totalHours}</p>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Total Hours</p>
                  </div>
                  <div className="text-center p-5 bg-secondary/30 rounded-xl border border-border/30">
                    <p className="text-3xl font-serif text-emerald-600 mb-1">{selectedVolunteer.tasksCompleted}</p>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Accomplished</p>
                  </div>
                  <div className="text-center p-5 bg-secondary/30 rounded-xl border border-border/30">
                    <p className="text-3xl font-serif text-amber-600 mb-1">{selectedVolunteer.activeAssignments}</p>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Active Tasks</p>
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
