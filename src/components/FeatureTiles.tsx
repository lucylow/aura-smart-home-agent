import { motion } from "framer-motion";
import { Crown, Cloud, Brain, Sparkles, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Crown,
    title: "Multi-Agent Orchestration",
    description: "A.U.R.A. employs specialized AI agents—SecuritySpecialist, AmbianceSpecialist, EnergySpecialist—each an expert, coordinating seamlessly via a central orchestrator.",
  },
  {
    icon: Brain,
    title: "Context-Aware Intelligence",
    description: "Real-time weather, calendar, and occupancy data inform adaptive routines. Raining? Windows auto-close. Late meeting? Lights auto-adjust.",
  },
  {
    icon: Cloud,
    title: "Cloud-First Privacy",
    description: "All orchestration happens in secure Tuya cloud services. No local hardware required—accessible from anywhere with enterprise-grade security.",
  },
];

const FeatureTiles = () => {
  return (
    <section className="py-24 px-6 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4 bg-primary/10 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            Key Features
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Makes A.U.R.A. Different
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Cutting-edge AI combined with practical smart home automation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl p-8 shadow-lg border border-border/50 transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                {/* Accent line */}
                <div className="w-10 h-0.5 bg-primary mb-4" />
                
                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureTiles;
