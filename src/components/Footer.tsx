import { Brain, Github, Twitter, Linkedin, Youtube, ArrowUp, Heart, Trophy, GitBranch, Users, Calendar, Code, Bot, Server, Network, Home, Layers, Terminal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hackathonLinks = [
    { icon: Trophy, label: "Tuya AI Innovators 2025", href: "#" },
    { icon: GitBranch, label: "Track 2: Cloud-Based AI Agent", href: "#" },
    { icon: Users, label: "Team: VisionThread", href: "#" },
    { icon: Calendar, label: "Deadline: Dec 20, 2025", href: "#" },
  ];

  const techStack = [
    { icon: Code, label: "TuyaOpen Platform", href: "#" },
    { icon: Bot, label: "AI Agent Development", href: "#" },
    { icon: Server, label: "AWS Kinesis (Kiro)", href: "#" },
    { icon: Network, label: "Multi-Agent Architecture", href: "#" },
  ];

  const quickLinks = [
    { icon: Home, label: "Home", href: "#home" },
    { icon: Layers, label: "Problem & Solution", href: "#problem" },
    { icon: Network, label: "Architecture", href: "#architecture" },
    { icon: Terminal, label: "Interactive Demo", href: "#demo" },
    { icon: Star, label: "Features", href: "#features" },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer id="hackathon" className="relative bg-foreground text-background overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Main Footer Content */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">A.U.R.A.</span>
            </div>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Autonomous & Unified Residential Administrator. A cloud-based multi-agent AI system
              for intelligent home automation powered by Tuya.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-11 h-11 rounded-full bg-background/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-primary hover:to-secondary hover:scale-110 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Hackathon Project */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              Hackathon Project
            </h3>
            <ul className="space-y-4">
              {hackathonLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a 
                    href={href} 
                    className="flex items-center gap-3 text-sm opacity-70 hover:opacity-100 hover:text-secondary transition-all group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Stack */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Code className="w-5 h-5 text-secondary" />
              Technical Stack
            </h3>
            <ul className="space-y-4">
              {techStack.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a 
                    href={href} 
                    className="flex items-center gap-3 text-sm opacity-70 hover:opacity-100 hover:text-secondary transition-all group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-secondary" />
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-3 text-sm opacity-70 hover:opacity-100 hover:text-secondary hover:translate-x-1 transition-all group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left text-sm opacity-60">
            <p className="flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
              © 2025 A.U.R.A. — Built with <Heart className="w-4 h-4 text-accent fill-accent animate-pulse" /> for Tuya AI Innovators Hackathon
            </p>
            <p className="mt-2 text-xs">
              Powered by TuyaOpen Platform AI Open-Source Package | Track 2: Cloud-Based AI Agent
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full bg-background/10 hover:bg-gradient-to-br hover:from-primary hover:to-secondary text-background hover:text-white transition-all hover:scale-110 w-11 h-11"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;