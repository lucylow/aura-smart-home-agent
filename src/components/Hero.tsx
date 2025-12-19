import { motion } from "framer-motion";
import { PlayCircle, GitBranch, Lightbulb, Bot, Cloud, Shield, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingCards = [
  { icon: Lightbulb, label: "Goal-Oriented Planning", gradient: "from-accent to-accent/70" },
  { icon: Bot, label: "Multi-Agent System", gradient: "from-secondary to-secondary-dark" },
  { icon: Cloud, label: "Tuya Cloud Integration", gradient: "from-primary to-primary-dark" },
  { icon: Shield, label: "Proactive Security", gradient: "from-warning to-warning/70" },
];

const stats = [
  { value: "5", label: "Specialized AI Agents" },
  { value: "50+", label: "Device Types Supported" },
  { value: "<100ms", label: "Average Response Time" },
];

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Tuya AI Innovators Hackathon 2025</span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance mb-6"
          >
            <span className="text-gradient">Autonomous & Unified</span>
            <br />
            <span className="text-foreground">Residential Administrator</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance"
          >
            A cloud-based multi-agent AI system that transforms your smart home from a
            collection of devices into an intelligent, goal-oriented executive assistant
            powered by Tuya Open Platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button asChild size="lg" className="rounded-full gap-2 px-8 shadow-lg hover:shadow-glow transition-shadow">
              <a href="/dashboard">
                <PlayCircle className="w-5 h-5" />
                Try Interactive Demo
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full gap-2 px-8 hover:bg-muted transition-colors">
              <a href="#architecture">
                <GitBranch className="w-5 h-5" />
                Explore Architecture
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Cards */}
        <div className="relative h-64 md:h-80 mt-16">
          {floatingCards.map((card, index) => {
            const positions = [
              "top-0 left-0 md:left-[5%]",
              "top-4 right-0 md:right-[5%]",
              "bottom-8 left-4 md:left-[10%]",
              "bottom-0 right-4 md:right-[10%]",
            ];

            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
                className={`absolute ${positions[index]} animate-float`}
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <div className="group bg-card rounded-2xl p-4 shadow-lg border border-border/50 flex items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md`}>
                    <card.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground pr-2">{card.label}</span>
                </div>
              </motion.div>
            );
          })}
          
          {/* Center decorative element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-primary opacity-20 animate-pulse-ring" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;