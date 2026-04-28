import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Menu, X, User, Mail, Phone, MapPin } from 'lucide-react';
import Chatbot from './Chatbot';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userName: string;
  userRole: 'volunteer' | 'ngo';
}

export default function DashboardLayout({ children, navItems, userName, userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalProfile, setModalProfile] = useState<Record<string, unknown> | null>(null);
  const location = useLocation();
  const { user, logout, profile } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!profileOpen) {
      setModalProfile(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const response = await api.get('/users/profile/me');
        const raw = response.data as Record<string, unknown> & { data?: Record<string, unknown> };
        const data = (raw?.data ?? raw) as Record<string, unknown>;
        if (!cancelled) setModalProfile(data);
      } catch (error) {
        console.error('Failed to refresh profile', error);
        if (!cancelled) setModalProfile(null);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [profileOpen]);

  const live = modalProfile ?? profile;
  const displayUserName =
    (typeof live?.name === 'string' && live.name) ||
    userName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'User';
  const displayEmail = (typeof live?.email === 'string' && live.email) || user?.email || 'N/A';
  const displayPhone = (typeof live?.phone === 'string' && live.phone) || 'N/A';
  const displayAddress = (typeof live?.address === 'string' && live.address) || 'N/A';

  const volunteerHours = userRole === 'volunteer' ? Number(live?.totalHours ?? 0) : Number(live?.volunteersAssigned ?? 0);
  const volunteerTasksOrCases =
    userRole === 'volunteer' ? Number(live?.tasksCompleted ?? 0) : Number(live?.issuesResolved ?? 0);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary relative">
      {/* Header */}
      <header className="bg-card border-b border-border/60 sticky top-0 z-40 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
        <div className="px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6 text-foreground" />
            </Button>
          </div>
          <h1 className="text-2xl font-serif tracking-tight text-foreground hidden sm:block">
            {userRole === 'volunteer' ? 'Volunteer Portal' : 'NGO Portal'}
          </h1>
          <div 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center border border-border/40 shadow-sm cursor-pointer hover:bg-muted transition-colors relative z-50"
          >
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </header>

      {/* Profile Pop-up Modal */}
      <AnimatePresence>
        {profileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-[60] transition-opacity"
              onClick={() => setProfileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-20 right-4 md:right-6 w-80 lg:w-96 max-h-[85vh] flex flex-col bg-card border border-border/40 shadow-2xl z-[70] rounded-3xl overflow-hidden"
            >
              <div className="p-8 text-center bg-gradient-to-b from-secondary/50 to-background flex-1 overflow-y-auto border-b border-border/40">
                <div className="w-24 h-24 bg-background rounded-full mx-auto flex items-center justify-center border-4 border-card shadow-sm mb-5">
                   <User className="w-12 h-12 text-primary/60" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif text-foreground tracking-tight leading-none mb-3">{displayUserName}</h3>
                  <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary uppercase tracking-wider text-xs font-bold rounded-full shadow-sm">
                    {userRole === 'volunteer' ? 'Verified Volunteer' : 'Registered NGO'}
                  </span>
                </div>

                {/* Detailed Profile Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-background/80 backdrop-blur-sm p-4 rounded-2xl border border-border/40 shadow-sm transition-transform hover:scale-105">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                      {userRole === 'volunteer' ? 'Total Hours' : 'Volunteers'}
                    </p>
                    <p className="text-3xl font-serif text-primary">
                      {volunteerHours}
                    </p>
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm p-4 rounded-2xl border border-border/40 shadow-sm transition-transform hover:scale-105">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                      {userRole === 'volunteer' ? 'Tasks Done' : 'Cases Solved'}
                    </p>
                    <p className="text-3xl font-serif text-primary">
                      {volunteerTasksOrCases}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-6 text-left space-y-3 px-2">
                  <div className="flex items-center text-sm font-medium text-foreground">
                    <Mail className="w-4 h-4 mr-4 text-primary/70" />
                    {displayEmail}
                  </div>
                  <div className="flex items-center text-sm font-medium text-foreground">
                    <Phone className="w-4 h-4 mr-4 text-primary/70" />
                    {displayPhone}
                  </div>
                  <div className="flex items-center text-sm font-medium text-foreground">
                    <MapPin className="w-4 h-4 mr-4 text-primary/70" />
                    {displayAddress}
                  </div>
                </div>

                {/* Additional NGO details */}
                {userRole === 'ngo' && live && (
                  <div className="mt-6 pt-5 border-t border-border/40 text-left space-y-4 px-2">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Govt. Unique ID</p>
                      <p className="text-sm font-medium text-primary/90 bg-primary/5 px-3 py-1.5 rounded-lg inline-block border border-primary/10">{(live.uniqueId as string) || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">About</p>
                      <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/30 p-3.5 rounded-xl border border-border/40 line-clamp-4">{(live.description as string) || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-card flex gap-3">
                 <Button variant="outline" className="flex-1 h-12 rounded-xl text-foreground font-medium border-border/60 hover:bg-secondary transition-colors" onClick={() => setProfileOpen(false)}>
                   Settings
                 </Button>
                 <Link to="/" className="flex-1">
                   <Button variant="destructive" className="w-full h-12 rounded-xl font-medium shadow-sm transition-colors" onClick={() => { setProfileOpen(false); logout(); }}>
                     Sign Out
                   </Button>
                 </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar Container */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 h-full w-80 bg-sidebar border-r border-sidebar-border shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-serif text-sidebar-foreground">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="mb-10 pb-8 border-b border-sidebar-border">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center border border-border/50 shadow-sm cursor-pointer" onClick={() => {setSidebarOpen(false); setProfileOpen(true);}}>
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-serif text-lg text-sidebar-foreground font-medium">{displayUserName}</p>
                      <p className="text-sm font-light text-muted-foreground capitalize tracking-wide">{userRole}</p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <span className={`${isActive(item.path) ? 'opacity-100' : 'opacity-70'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium tracking-wide">{item.label}</span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-12 pt-8 border-t border-sidebar-border">
                  <Link to="/">
                    <Button variant="outline" className="w-full h-12 text-base font-medium rounded-xl border-sidebar-border hover:bg-sidebar-accent hover:text-destructive transition-colors" onClick={() => logout()}>
                      Log Out
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        {children}
      </main>

      <Chatbot userRole={userRole} />
    </div>
  );
}
