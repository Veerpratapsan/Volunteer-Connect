import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Users, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function NGOLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/ngo/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-md flex flex-col items-center">
        <Link to="/" className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-8 hover:-translate-y-1 transition-transform shadow-sm border border-border/50">
          <Users className="w-5 h-5 text-primary" />
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-3 tracking-tight text-foreground">NGO Portal</h1>
          <p className="text-muted-foreground font-light text-lg">Log in to manage operations.</p>
        </div>

        <Card className="w-full p-8 sm:p-10 border border-border/40 shadow-sm bg-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-foreground tracking-wide font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-foreground tracking-wide font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 text-base rounded-xl bg-primary hover:bg-primary/90 mt-2 transition-colors">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
            </Button>

            <div className="pt-6 mt-6 border-t border-border/50 text-center">
              <p className="text-muted-foreground text-sm">
                Unregistered Organization?{' '}
                <Link to="/ngo/signup" className="text-primary font-medium hover:underline underline-offset-4">
                  Register Now
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
