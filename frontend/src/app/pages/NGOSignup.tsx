import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Users, MapPin, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { api } from '../api';
import { getCurrentAddress } from '../utils/location';

export default function NGOSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uniqueId: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetLocation = async () => {
    const address = await getCurrentAddress();
    if (address) {
      setFormData({ ...formData, address });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Get the token directly from the newly created user to avoid race conditions
      const token = await userCredential.user.getIdToken();
      
      // 2. Create Profile in Backend explicitly passing the token
      await api.post('/users/profile', {
        role: 'ngo',
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        uniqueId: formData.uniqueId // Extra data saved
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      navigate('/ngo/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <Link to="/" className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-8 hover:-translate-y-1 transition-transform shadow-sm border border-border/50 mt-8">
          <Users className="w-5 h-5 text-primary" />
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-3 tracking-tight text-foreground">NGO Sign Up</h1>
          <p className="text-muted-foreground font-light text-lg">Register your organization</p>
        </div>

        <Card className="w-full p-8 sm:p-10 border border-border/40 shadow-sm bg-card mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="uniqueId" className="text-foreground tracking-wide font-medium">Government Unique ID</Label>
                <Input
                  id="uniqueId"
                  type="text"
                  placeholder="Enter unique ID"
                  value={formData.uniqueId}
                  onChange={(e) => setFormData({ ...formData, uniqueId: e.target.value })}
                  required
                  className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="name" className="text-foreground tracking-wide font-medium">Organization Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter organization name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-foreground tracking-wide font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-foreground tracking-wide font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="password" className="text-foreground tracking-wide font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="address" className="text-foreground tracking-wide font-medium">Address</Label>
              <div className="flex gap-3">
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter organization address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                />
                <Button type="button" variant="outline" onClick={handleGetLocation} className="h-12 w-12 rounded-xl shrink-0 p-0 border-border/50 hover:bg-secondary/50">
                  <MapPin className="w-5 h-5 text-primary" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-foreground tracking-wide font-medium">Organization Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your organization's mission and activities"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 px-4 py-3 rounded-xl min-h-[120px] resize-y"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 text-base rounded-xl bg-primary hover:bg-primary/90 mt-4 transition-colors">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Complete Registration'}
            </Button>

            <div className="pt-6 mt-6 border-t border-border/50 text-center">
              <p className="text-muted-foreground text-sm font-light">
                Already have an account?{' '}
                <Link to="/ngo/login" className="text-primary font-medium hover:underline underline-offset-4">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <div className="mb-8 text-center">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
