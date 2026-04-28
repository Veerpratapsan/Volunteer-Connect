import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { LayoutDashboard, ClipboardList, History, AlertCircle, MapPin, Calendar, User, Flag, Plus, Loader2 } from 'lucide-react';
import { api } from '../../api';
import { toast } from 'sonner';
import { getCurrentAddress } from '../../utils/location';

interface ReportedIssue {
  id: string;
  volunteerId: string;
  volunteerName: string;
  description: string;
  location: string;
  photos: string[];
  date: string;
  status: 'pending' | 'chosen' | 'resolved';
}

const navItems = [
  { path: '/ngo/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/ngo/requests', label: 'Requests', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/ngo/history', label: 'History', icon: <History className="w-5 h-5" /> },
  { path: '/ngo/issues', label: 'Reported Issues', icon: <AlertCircle className="w-5 h-5" /> },
];

export default function NGOReportedIssues() {
  const [issues, setIssues] = useState<ReportedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<ReportedIssue | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [needDialogOpen, setNeedDialogOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await api.get('/issues');
        setIssues(response.data);
      } catch (error) {
        console.error('Error fetching issues:', error);
        toast.error('Failed to load reported issues');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth >= 1024);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    location: '',
    volunteerCount: '',
    deadline: '',
    description: '',
    requiredSkills: '',
  });

  const handleOpenRaiseNeed = (issue: ReportedIssue) => {
    setFormData({
      title: `Support Needed: Active Issue Response`,
      category: 'Community Support',
      priority: 'high',
      location: issue.location,
      volunteerCount: '',
      deadline: '',
      description: `Original Report context by ${issue.volunteerName}:\n"${issue.description}"\n\nWe are actively looking for volunteers to assist with resolving this confirmed issue locally.`,
      requiredSkills: '',
    });
    setNeedDialogOpen(true);
  };

  const handleNeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Successfully drafted a new Need based on this issue!');
    setNeedDialogOpen(false);
    // Automatically close the issue details dialog if open to streamline workflow
    setDialogOpen(false);
  };

  const handleGetLocation = async () => {
    const address = await getCurrentAddress();
    if (address) {
      setFormData(prev => ({ ...prev, location: address }));
    }
  };

  const handleIssueClick = (issue: ReportedIssue) => {
    setSelectedIssue(issue);
    setDialogOpen(true);
  };

  const handleChooseIssue = (issueId: string) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, status: 'chosen' as const } : issue
    ));
    setSelectedIssue(prev => prev && prev.id === issueId ? { ...prev, status: 'chosen' as const } : prev);
    toast.success('Issue marked as chosen! You can now work on addressing it.');
  };

  const handleResolveIssue = (issueId: string) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, status: 'resolved' as const } : issue
    ));
    setSelectedIssue(prev => prev && prev.id === issueId ? { ...prev, status: 'resolved' as const } : prev);
    toast.success('Issue marked as resolved!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'chosen':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-transparent';
      default:
        return 'bg-amber-50 text-amber-700 border-transparent';
    }
  };

  const getPlaceholderPhoto = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('garbage') || desc.includes('trash') || desc.includes('waste') || desc.includes('clean') || desc.includes('plastic')) {
      return 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=80'; // Garbage / Trash
    }
    if (desc.includes('tree') || desc.includes('plant') || desc.includes('garden') || desc.includes('park')) {
      return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80'; // Trees / Environment
    }
    if (desc.includes('food') || desc.includes('hunger') || desc.includes('meal') || desc.includes('eat')) {
      return 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&auto=format&fit=crop&q=80'; // Food / Charity
    }
    if (desc.includes('teach') || desc.includes('school') || desc.includes('education') || desc.includes('book')) {
      return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80'; // Books / Education
    }
    if (desc.includes('animal') || desc.includes('dog') || desc.includes('cat') || desc.includes('pet') || desc.includes('stray')) {
      return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop&q=80'; // Animals
    }
    // Default general volunteering photo
    return 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&auto=format&fit=crop&q=80';
  };

  const displayPhoto = (photoUrl: string, description: string) => {
    // If it's the old hardcoded mechanic/car engine photo, upgrade it dynamically
    if (photoUrl.includes('1625047509248-ec889cbff17f')) {
      return getPlaceholderPhoto(description);
    }
    return photoUrl;
  };

  return (
    <DashboardLayout navItems={navItems} userName="Community Care Foundation" userRole="ngo">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="border-b border-border/40 pb-6 flex flex-col justify-between items-start">
          <h2 className="text-4xl font-serif text-foreground tracking-tight">Reported Issues</h2>
          <p className="text-muted-foreground mt-2 text-lg font-light">Community needs and challenges flagged by volunteers.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Issue List */}
          <div className="lg:col-span-1">
            <Card className="p-0 border-border/40 overflow-hidden bg-card/80 backdrop-blur-md shadow-sm h-[calc(100vh-220px)] flex flex-col">
              <div className="p-6 border-b border-border/40 bg-secondary/30">
                <h3 className="font-serif text-xl tracking-tight">Active Reports <span className="text-muted-foreground ml-2 text-base">({issues.length})</span></h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center p-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      {issues.map((issue) => (
                        <div
                          key={issue.id}
                          onClick={() => handleIssueClick(issue)}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                            selectedIssue?.id === issue.id
                              ? 'bg-primary/5 border-primary/30 shadow-sm'
                              : 'bg-background hover:bg-secondary/50 border-border/40 hover:border-border/60 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              selectedIssue?.id === issue.id ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                            <p className={`text-sm tracking-wide leading-relaxed line-clamp-2 ${
                                selectedIssue?.id === issue.id ? 'text-foreground font-medium' : 'text-muted-foreground/90'
                            }`}>{issue.description}</p>
                          </div>
                          <div className="flex items-center justify-between pl-8">
                            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/70">{issue.date}</span>
                            <Badge className={`${getStatusColor(issue.status)} text-[10px] uppercase tracking-wider px-2 py-0.5 shadow-none`}>
                              {issue.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {issues.length === 0 && (
                         <div className="text-center p-8">
                           <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                           <p className="text-sm text-muted-foreground">No reports available.</p>
                         </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Issue Detail */}
          <div className="lg:col-span-2">
            {selectedIssue ? (
              <Card className="p-8 border border-border/40 shadow-sm bg-card animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-6">
                    <h3 className="text-3xl font-serif text-foreground leading-tight">Details</h3>
                    <Badge className={`${getStatusColor(selectedIssue.status)} uppercase tracking-wider font-semibold px-4 py-1.5 shadow-sm text-xs`}>
                      {selectedIssue.status}
                    </Badge>
                  </div>

                  {selectedIssue.photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-6">
                      {selectedIssue.photos.map((photo, index) => (
                        <div key={index} className="aspect-video rounded-xl overflow-hidden bg-secondary border border-border/40 shadow-sm">
                          <img
                            src={displayPhoto(photo, selectedIssue.description)}
                            alt={`Reported visual ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-secondary/20 p-6 rounded-2xl border border-border/30">
                    <h4 className="font-semibold mb-3 tracking-wider uppercase text-xs text-muted-foreground">Comprehensive Description</h4>
                    <p className="text-foreground text-lg font-light leading-relaxed">{selectedIssue.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex gap-4 p-5 bg-background border border-border/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                         <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-sm text-foreground">Location</h4>
                        <span className="text-muted-foreground">{selectedIssue.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 p-5 bg-background border border-border/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                         <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-sm text-foreground">Reported On</h4>
                        <span className="text-muted-foreground">{selectedIssue.date}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 tracking-wider uppercase text-xs text-muted-foreground">Original Reporter</h4>
                    <div className="flex items-center gap-4 p-5 bg-secondary/30 rounded-xl border border-border/40 border-l-4 border-l-primary/50">
                      <div className="w-12 h-12 bg-background border border-border/60 rounded-full flex items-center justify-center shadow-sm">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                         <span className="font-serif text-xl tracking-tight text-foreground block">{selectedIssue.volunteerName}</span>
                         <span className="text-sm text-muted-foreground">Verified Volunteer</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    {selectedIssue.status === 'pending' && (
                      <Button
                        className="flex-1 h-14 rounded-xl text-lg font-medium shadow-sm"
                        onClick={() => handleChooseIssue(selectedIssue.id)}
                      >
                        <Flag className="w-5 h-5 mr-3" />
                        Take Ownership of Issue
                      </Button>
                    )}
                    {selectedIssue.status === 'chosen' && (
                      <div className="flex gap-4 w-full">
                        <Button
                          className="flex-1 h-14 rounded-xl text-base font-medium shadow-sm border-primary/20 hover:bg-primary/5 text-primary"
                          variant="outline"
                          onClick={() => handleOpenRaiseNeed(selectedIssue)}
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Raise Need from Issue
                        </Button>
                        <Button
                          className="flex-1 h-14 rounded-xl text-base font-medium shadow-sm"
                          variant="default"
                          onClick={() => handleResolveIssue(selectedIssue.id)}
                        >
                          Mark as Successfully Resolved
                        </Button>
                      </div>
                    )}
                    {selectedIssue.status === 'resolved' && (
                      <div className="flex-1 p-4 bg-emerald-50/50 border border-emerald-200/50 rounded-xl text-center shadow-sm backdrop-blur-sm">
                        <p className="text-emerald-800 font-medium text-lg flex items-center justify-center">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2">✓</span>
                            This issue has been formally resolved
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-16 text-center border-border/40 border-dashed bg-card/50 h-full flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <AlertCircle className="w-12 h-12 text-muted-foreground/40" />
                </div>
                <h3 className="text-3xl font-serif text-foreground mb-4">Select an Issue</h3>
                <p className="text-muted-foreground text-lg font-light max-w-md mx-auto">
                  Click on any open report from the list to view its comprehensive details and take action.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Issue Detail Dialog for mobile */}
        <Dialog open={dialogOpen && !isDesktop} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto lg:hidden border-border/40 sm:rounded-[2rem]">
            <DialogHeader className="pb-4 border-b border-border/30">
              <DialogTitle className="text-2xl font-serif">Report Details</DialogTitle>
            </DialogHeader>
            {selectedIssue && (
              <div className="space-y-8 pt-4">
                <Badge className={`${getStatusColor(selectedIssue.status)} uppercase tracking-wider font-semibold`}>
                  {selectedIssue.status}
                </Badge>

                {selectedIssue.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedIssue.photos.map((photo, index) => (
                      <div key={index} className="aspect-video rounded-xl overflow-hidden bg-secondary border border-border/30">
                        <img
                          src={displayPhoto(photo, selectedIssue.description)}
                          alt={`Reported visual ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2 tracking-wider uppercase text-xs text-muted-foreground">Description</h4>
                  <p className="text-foreground">{selectedIssue.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-secondary/30 rounded-xl border border-border/30">
                     <MapPin className="w-5 h-5 text-primary shrink-0" />
                     <div>
                       <h4 className="font-semibold text-sm mb-1 text-foreground">Location</h4>
                       <span className="text-muted-foreground">{selectedIssue.location}</span>
                     </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-secondary/30 rounded-xl border border-border/30">
                     <Calendar className="w-5 h-5 text-primary shrink-0" />
                     <div>
                       <h4 className="font-semibold text-sm mb-1 text-foreground">Reported Date</h4>
                       <span className="text-muted-foreground">{selectedIssue.date}</span>
                     </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 tracking-wider uppercase text-xs text-muted-foreground">Reported By</h4>
                  <div className="flex items-center gap-4 p-4 bg-background border border-border/50 rounded-xl">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-lg">{selectedIssue.volunteerName}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border/30">
                  {selectedIssue.status === 'pending' && (
                    <Button
                      className="flex-1 h-12 rounded-xl"
                      onClick={() => handleChooseIssue(selectedIssue.id)}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Take Ownership
                    </Button>
                  )}
                  {selectedIssue.status === 'chosen' && (
                    <div className="flex flex-col gap-3 w-full">
                      <Button
                        className="w-full h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5 shadow-sm"
                        variant="outline"
                        onClick={() => handleOpenRaiseNeed(selectedIssue)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Raise Need from Issue
                      </Button>
                      <Button
                        className="w-full h-12 rounded-xl shadow-sm"
                        variant="default"
                        onClick={() => handleResolveIssue(selectedIssue.id)}
                      >
                        Mark as Resolved
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Raise Need Modal (Adapted from Dashboard) */}
        <Dialog open={needDialogOpen} onOpenChange={setNeedDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] border-border/40 p-0 overflow-hidden sm:rounded-[2rem] flex flex-col shadow-2xl z-[100]">
            <div className="flex-1 overflow-y-auto custom-scrollbar w-full">
              <DialogHeader className="p-8 pb-0">
                <DialogTitle className="text-3xl font-serif text-foreground tracking-tight">Post a New Need</DialogTitle>
                <p className="text-muted-foreground font-light text-lg">Create a volunteer opportunity directly sourced from an active issue.</p>
              </DialogHeader>
              <form onSubmit={handleNeedSubmit} className="space-y-8 p-8">
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
                    rows={5}
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
                  <Button type="submit" className="w-full h-14 text-base rounded-xl bg-primary hover:bg-primary/90 transition-colors shadow-sm">
                    Draft Connected Need
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
