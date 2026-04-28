import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Users, Heart, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="w-full absolute top-0 px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-medium tracking-tight">Volunteer Connect</span>
        </div>
      </nav>

      <main className="w-full max-w-6xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="w-full max-w-3xl text-center space-y-8 mb-24 md:mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm shadow-sm text-sm font-medium text-muted-foreground mb-4">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Making local impact possible
          </div>
          <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] tracking-tight text-foreground">
            Connecting purpose <br className="hidden md:block"/> with <span className="italic text-primary">meaningful action.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans font-light">
            A collaborative platform bridging the gap between local non-profits 
            and passionate individuals ready to make a difference in their community.
          </p>
        </div>

        {/* How It Works - Hybrid Functional section */}
        <div className="w-full max-w-5xl mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-4">The Pathway to Impact</h2>
            <div className="w-16 h-1 bg-primary/20 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-[1px] bg-border -translate-y-1/2 z-0"></div>
            
            {[
              {
                icon: MapPin,
                title: "Identify Needs",
                desc: "NGOs pinpoint community challenges and post specific requests for volunteer assistance."
              },
              {
                icon: Users,
                title: "Match Skills",
                desc: "Volunteers browse local opportunities and connect where their unique skills have the most impact."
              },
              {
                icon: CheckCircle2,
                title: "Create Change",
                desc: "Collaborate effectively, complete checklist objectives, and build a lasting community legacy."
              }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center bg-background px-4 py-6">
                <div className="w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center mb-6 shadow-sm border border-border/50 transition-transform hover:-translate-y-1 duration-300">
                  <step.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif mb-3 font-medium">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Entry Pathways */}
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Get Started</h2>
            <p className="text-muted-foreground">Select your role to join the platform.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Volunteer Card */}
            <Card className="group relative overflow-hidden border border-border bg-card p-10 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10 duration-500">
                <Heart className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-8 border border-border">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-3">I want to Help</h3>
                <p className="text-muted-foreground mb-10 leading-relaxed font-light">
                  Find meaningful tasks in your area, track your hours, and make a tangible difference in your community.
                </p>
                
                <div className="mt-auto flex flex-col gap-3">
                  <Link to="/volunteer/signup" className="w-full">
                    <Button className="w-full text-base py-6 bg-primary hover:bg-primary/90 rounded-xl" size="lg">
                      Become a Volunteer
                    </Button>
                  </Link>
                  <Link to="/volunteer/login" className="w-full">
                    <Button variant="ghost" className="w-full text-base py-6 hover:bg-secondary/50 rounded-xl" size="lg">
                      Log in to Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* NGO Card */}
            <Card className="group relative overflow-hidden border border-border bg-card p-10 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10 duration-500">
                <Users className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-8 border border-border">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-3">I represent an NGO</h3>
                <p className="text-muted-foreground mb-10 leading-relaxed font-light">
                  Publish pressing needs, connect with skilled volunteers, and streamline your operational impact.
                </p>
                
                <div className="mt-auto flex flex-col gap-3">
                  <Link to="/ngo/signup" className="w-full">
                    <Button className="w-full text-base py-6 bg-primary hover:bg-primary/90 rounded-xl" size="lg">
                      Register Organization
                    </Button>
                  </Link>
                  <Link to="/ngo/login" className="w-full">
                    <Button variant="ghost" className="w-full text-base py-6 hover:bg-secondary/50 rounded-xl" size="lg">
                      NGO Login
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>

      </main>
    </div>
  );
}
