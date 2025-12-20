import { motion } from "framer-motion";
import { PlayCircle, GitBranch, Lightbulb, Bot, Cloud, Shield, Zap, CheckCircle2, User, Sparkles, Thermometer, Lock, Speaker } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { text: "Say 'Movie Time'—A.U.R.A. orchestrates lights, blinds, temperature, and audio in one command." },
  { text: "AI-powered planning translates your goals into reliable device choreography." },
  { text: "Privacy-first cloud orchestration with live Tuya device integration." },
];

const stats = [
  { value: "5", label: "Specialized AI Agents" },
  { value: "50+", label: "Device Types Supported" },
  { value: "<100ms", label: "Average Response Time" },
];

const agentBadges = [
  { icon: Lightbulb, label: "Ambiance", color: "bg-primary" },
  { icon: Shield, label: "Security", color: "bg-accent" },
  { icon: Zap, label: "Energy", color: "bg-warning" },
];

const deviceIcons = [
  { icon: Lightbulb, label: "Light", delay: 0 },
  { icon: Thermometer, label: "Thermostat", delay: 0.2 },
  { icon: Lock, label: "Lock", delay: 0.4 },
  { icon: Speaker, label: "Speaker", delay: 0.6 },
];

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen pt-24 pb-20 overflow-hidden">
      {/* Background: Slate to Cloud White gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary/80 to-background" />
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Hackathon Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Tuya AI Innovators Hackathon 2025</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="text-primary-foreground dark:text-foreground">Your Home.</span>
              <br />
              <span className="text-gradient">Intelligently Orchestrated.</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 dark:text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              A.U.R.A. is your cloud-based AI executive that transforms natural language commands 
              into seamless multi-device automations—no coding required.
            </p>

            {/* Benefit Lines */}
            <ul className="space-y-3 mb-10">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 text-left"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/90 dark:text-foreground/90 text-sm md:text-base">{benefit.text}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button asChild size="lg" className="rounded-full gap-2 px-8 bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg hover:shadow-glow transition-all">
                <a href="/dashboard">
                  <PlayCircle className="w-5 h-5" />
                  Try A.U.R.A. Now
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full gap-2 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 dark:border-border dark:text-foreground">
                <a href="#demo">
                  <GitBranch className="w-5 h-5 text-black" />
                  View Demo Video
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Orchestration Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-card/10 backdrop-blur-sm rounded-3xl p-8 border border-primary-foreground/10 dark:border-border/50">
              {/* User Input at Top */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <div className="w-12 h-12 rounded-full bg-primary-foreground/20 dark:bg-muted flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground dark:text-foreground" />
                </div>
                <div className="px-4 py-2 bg-primary-foreground/10 dark:bg-muted rounded-2xl rounded-tl-sm">
                  <p className="text-sm text-primary-foreground dark:text-foreground font-medium">"Goodnight, A.U.R.A."</p>
                </div>
              </motion.div>

              {/* Central Brain with Pulse */}
              <div className="relative flex justify-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  {/* Pulse rings */}
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary/20 animate-pulse-ring" />
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary/10 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
                  
                  {/* Central brain */}
                  <div className="relative w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                    <div className="text-center">
                      <Bot className="w-10 h-10 text-primary-foreground mx-auto mb-1" />
                      <span className="text-xs font-bold text-primary-foreground">A.U.R.A.</span>
                    </div>
                  </div>
                </motion.div>

                {/* Agent Badges around brain */}
                {agentBadges.map((agent, i) => {
                  const angle = (i - 1) * 60 - 90;
                  const radius = 100;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <motion.div
                      key={agent.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="absolute top-1/2 left-1/2"
                      style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                    >
                      <div className={`${agent.color} rounded-xl p-2 shadow-lg`}>
                        <agent.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Flow Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '55%' }}>
                {deviceIcons.map((_, i) => (
                  <motion.line
                    key={i}
                    x1="50%"
                    y1="0"
                    x2={`${20 + i * 20}%`}
                    y2="60"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
                  />
                ))}
              </svg>

              {/* Device Icons at Bottom */}
              <div className="flex justify-center gap-4 mt-4">
                {deviceIcons.map((device, i) => (
                  <motion.div
                    key={device.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + device.delay }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 hsl(var(--success) / 0)",
                          "0 0 20px 4px hsl(var(--success) / 0.4)",
                          "0 0 0 0 hsl(var(--success) / 0)"
                        ]
                      }}
                      transition={{ delay: 1.5 + device.delay, duration: 0.6 }}
                      className="w-14 h-14 rounded-xl bg-card dark:bg-muted flex flex-col items-center justify-center border border-border/50"
                    >
                      <device.icon className="w-6 h-6 text-primary mb-1" />
                      <span className="text-[10px] text-muted-foreground">{device.label}</span>
                    </motion.div>
                    
                    {/* Checkmark */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.8 + device.delay }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-3 h-3 text-success-foreground" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Plan Cards (fade in sequence) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-6 space-y-2"
              >
                {["Lock all doors", "Dim lights to 10%", "Set thermostat to 68°F"].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.2 + i * 0.2 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg border border-success/20"
                  >
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-xs text-foreground">{step}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
