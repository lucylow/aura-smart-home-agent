import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const problems = [
  { title: "Fragmented Control", desc: "Dozens of apps for different devices" },
  { title: "Command Overload", desc: "Manual control of each device individually" },
  { title: "No True Automation", desc: "Devices don't understand goals, only commands" },
  { title: "Lack of Context", desc: "No awareness of time, weather, or preferences" },
  { title: "Reactive System", desc: "Waiting for commands instead of anticipating needs" },
];

const solutions = [
  { title: "Goal-Oriented", desc: '"Goodnight" instead of manual device control' },
  { title: "Multi-Agent System", desc: "Specialized AI agents collaborate intelligently" },
  { title: "Context-Aware", desc: "Understands time, weather, and your preferences" },
  { title: "Proactive AI", desc: "Learns routines and suggests smart automations" },
  { title: "Unified Interface", desc: "One system that orchestrates your entire home" },
];

const ProblemSolution = () => {
  return (
    <section id="problem" className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            The Challenge
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            The Smart Home Dilemma
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Current smart homes are fragmented collections of devices that don't understand your true intent.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problem Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group"
          >
            <div className="h-full bg-card rounded-3xl p-8 shadow-lg border border-border/50 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-accent to-accent/50" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">The Problem</h3>
              </div>
              
              <ul className="space-y-5">
                {problems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 group/item"
                  >
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover/item:bg-accent/20 transition-colors">
                      <XCircle className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{item.title}</span>
                      <span className="text-muted-foreground"> — {item.desc}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Solution Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group"
          >
            <div className="h-full bg-card rounded-3xl p-8 shadow-lg border border-border/50 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-secondary to-secondary/50" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">The A.U.R.A. Solution</h3>
              </div>
              
              <ul className="space-y-5">
                {solutions.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 group/item"
                  >
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover/item:bg-secondary/20 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{item.title}</span>
                      <span className="text-muted-foreground"> — {item.desc}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <a 
            href="#architecture" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            See how it works
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolution;