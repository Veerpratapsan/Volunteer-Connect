import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { LayoutDashboard, ClipboardList, History, MessageSquare, AlertCircle, MapPin, Loader2, Calendar } from 'lucide-react';
import { api, getResponseList } from '../../api';
import { useAuth } from '../../context/AuthContext';
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
  { path: '/volunteer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/volunteer/tasks', label: 'Tasks', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/volunteer/history', label: 'History', icon: <History className="w-5 h-5" /> },
  { path: '/volunteer/chat', label: 'Group Chat', icon: <MessageSquare className="w-5 h-5" /> },
  { path: '/volunteer/report', label: 'Report Need', icon: <AlertCircle className="w-5 h-5" /> },
];

export default function VolunteerReportNeed() {
  const { user, profile } = useAuth();
  const displayName =
    (profile?.name && String(profile.name)) ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Volunteer';
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    photos: [] as File[],
  });
  const [reports, setReports] = useState<ReportedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReports = async () => {
    if (!user) return;
    try {
      const response = await api.get('/issues');
      const allIssues = getResponseList<ReportedIssue>(response);
      // Filter issues by the current user's ID
      setReports(allIssues.filter((issue: ReportedIssue) => issue.volunteerId === user.uid));
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const handleGetLocation = async () => {
    const address = await getCurrentAddress();
    if (address) {
      setFormData({ ...formData, location: address });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // In a real scenario, we would upload images and get URLs back.
      // For this refactor, we'll use placeholder image URLs to simulate the backend.
      const issueData = {
        volunteerId: user.uid,
        volunteerName: displayName,
        description: formData.description,
        location: formData.location,
        photos: [getPlaceholderPhoto(formData.description)],
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      
      await api.post('/issues', issueData);
      toast.success('Issue reported successfully! NGOs will review your report.');
      setFormData({ description: '', location: '', photos: [] });
      fetchReports();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'chosen':
        return 'bg-primary/10 text-primary border-transparent';
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-transparent';
      default:
        return 'bg-amber-50 text-amber-700 border-transparent';
    }
  };

  return (
    <DashboardLayout navItems={navItems} userName={displayName} userRole="volunteer">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="border-b border-border/40 pb-6 flex flex-col items-start gap-2">
          <h2 className="text-4xl font-serif text-foreground tracking-tight">Report a Need</h2>
          <p className="text-muted-foreground text-lg font-light">Help identify community needs.</p>
        </div>

        {/* Report Form */}
        <Card className="p-8 sm:p-10 border border-border/40 shadow-sm bg-card">
          <h3 className="text-2xl font-serif text-foreground mb-6">Submit New Report</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="description" className="text-foreground tracking-wide font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue you found..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 px-4 py-3 rounded-xl resize-y"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-foreground tracking-wide font-medium">Location</Label>
              <div className="flex gap-3">
                <Input
                  id="location"
                  type="text"
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

            <div className="space-y-3">
              <Label htmlFor="photos" className="text-foreground tracking-wide font-medium">Photos (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFormData({ ...formData, photos: Array.from(e.target.files || []) })}
                  className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary file:bg-secondary file:text-primary file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:font-medium hover:file:bg-secondary/80 h-12 px-4 rounded-xl cursor-pointer pt-2"
                />
              </div>
              {formData.photos.length > 0 && (
                <p className="text-sm text-primary font-medium mt-2">{formData.photos.length} photo(s) selected</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-base rounded-xl bg-primary hover:bg-primary/90 mt-4 transition-colors">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </Card>

        {/* Report History */}
        <div className="pt-6">
          <h3 className="text-2xl font-serif text-foreground mb-6">My Previous Reports</h3>
          {loading ? (
             <div className="flex items-center justify-center p-12">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="p-6 border border-border/40 shadow-sm bg-card hover:border-primary/20 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {report.photos && report.photos.length > 0 && (
                      <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 bg-secondary relative border border-border/30">
                        <img
                          src={report.photos[0]}
                          alt="Report"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-4 flex flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-foreground text-lg leading-relaxed">{report.description}</p>
                        </div>
                        <Badge className={`${getStatusColor(report.status)} uppercase tracking-wider text-xs font-semibold px-3 py-1 shadow-sm`}>
                          {report.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{report.date}</span>
                        </div>
                      </div>

                      {report.status === 'chosen' && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3 mt-2">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <p className="text-sm text-foreground/80 font-medium">
                             This issue has been picked up by an NGO and is being addressed.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {reports.length === 0 && (
                <Card className="p-16 text-center border border-border/40 bg-card/50 border-dashed">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-2xl font-serif text-foreground mb-3">No Reports Yet</h3>
                  <p className="text-muted-foreground text-lg font-light max-w-sm mx-auto">
                    Submit your first report to help identify community needs.
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
