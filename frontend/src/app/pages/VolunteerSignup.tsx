import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Heart, MapPin, X, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { api } from '../api';
import { getCurrentAddress } from '../utils/location';

export default function VolunteerSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    profilePicture: null as File | null,
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetLocation = async () => {
    const address = await getCurrentAddress();
    if (address) {
      setFormData({ ...formData, address });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
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
        role: 'volunteer',
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        skills: skills,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      navigate('/volunteer/dashboard');
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
          <Heart className="w-5 h-5 text-primary" />
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-3 tracking-tight text-foreground">Volunteer Sign Up</h1>
          <p className="text-muted-foreground font-light text-lg">Join us to make a difference</p>
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
                <Label htmlFor="name" className="text-foreground tracking-wide font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
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
                  placeholder="Enter your email"
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
                  placeholder="Enter your phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                />
              </div>

              <div className="space-y-3">
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
                  placeholder="Enter your address"
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
              <Label htmlFor="profilePicture" className="text-foreground tracking-wide font-medium">Profile Picture</Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, profilePicture: e.target.files?.[0] || null })}
                className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary file:bg-secondary file:text-primary file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:font-medium hover:file:bg-secondary/80 h-12 px-4 rounded-xl cursor-pointer pt-2"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="skills" className="text-foreground tracking-wide font-medium">Skills</Label>
              <div className="flex gap-3">
                <Input
                  id="skills"
                  type="text"
                  placeholder="Add a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="bg-input-background border-transparent focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/60 h-12 px-4 rounded-xl"
                />
                <Button type="button" variant="outline" onClick={addSkill} className="h-12 px-6 rounded-xl border-border/50 hover:bg-secondary/50 text-foreground font-medium">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1.5 bg-secondary text-primary border border-primary/20 rounded-lg text-sm font-medium">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:bg-primary/20 rounded-full p-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 text-base rounded-xl bg-primary hover:bg-primary/90 mt-4 transition-colors">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Complete Sign Up'}
            </Button>

            <div className="pt-6 mt-6 border-t border-border/50 text-center">
              <p className="text-muted-foreground text-sm font-light">
                Already have an account?{' '}
                <Link to="/volunteer/login" className="text-primary font-medium hover:underline underline-offset-4">
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
