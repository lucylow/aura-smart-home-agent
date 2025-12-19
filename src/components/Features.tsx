import { motion } from "framer-motion";
import { Crown, MessageCircle, Brain, UserCheck, Cloud, Smartphone, CheckCircle2, Sparkles } from "lucide-react";

const features = [
  {
    icon: Crown,
    title: "Executive Orchestration",
    description:
      "A central orchestrator that understands high-level goals and delegates to specialized agents, creating a cohesive team.",
    highlights: ["Goal decomposition & planning", "Multi-agent coordination", "Conflict resolution logic", "Context-aware decisions"],
    gradient: "from-primary to-primary/60",
  },
  {
    icon: MessageCircle,
    title: "Natural Language Interface",
    description:
      "Communicate with your home using natural language. A.U.R.A. understands intent, not just keywords.",
    highlights: ["Voice & text processing", "Contextual understanding", "Multi-modal input", "Conversational memory"],
    gradient: "from-secondary to-secondary/60",
  },
  {
    icon: Brain,
    title: "Proactive Learning",
    description:
      "Analyzes patterns in your routines using Tuya Data Astrolabe and suggests smart automations.",
    highlights: ["Pattern recognition", "Personalized suggestions", "Adaptive behavior", "Predictive assistance"],
    gradient: "from-accent to-accent/60",
  },
  {
    icon: UserCheck,
    title: "Human-in-the-Loop",
    description:
      "Requests confirmation for safety-critical actions and learns from your feedback over time.",
    highlights: ["Critical confirmations", "Transparent explanations", "Override controls", "Privacy-first handling"],
    gradient: "from-info to-info/60",
  },
  {
    icon: Cloud,
    title: "Tuya Ecosystem Integration",
    description:
      "Built on Tuya's mature IoT platform with cross-device compatibility and global scalability.",
    highlights: ["TuyaOpen SDK & APIs", "Cross-platform compatible", "Enterprise security", "Global scalability"],
    gradient: "from-primary to-secondary",
  },
  {
    icon: Smartphone,
    title: "Unified Access Points",
    description:
      "Access A.U.R.A. through web dashboard, mobile app, or voice interface—all synchronized.",
    highlights: ["Progressive Web App", "Native mobile apps", "Voice integration", "Smart display support"],
    gradient: "from-secondary to-primary",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden bg-muted/30">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-secondary font-semibold text-sm uppercase tracking-wider mb-4 bg-secondary/10 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            Innovative Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Makes A.U.R.A. Different
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Cutting-edge AI combined with practical smart home automation for a truly intelligent living experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="h-full bg-card rounded-3xl p-8 shadow-lg border border-border/50 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="relative text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-muted-foreground text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="relative space-y-3">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm group/item">
                      <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover/item:bg-secondary/20 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                      </div>
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;