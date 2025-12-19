import { motion } from "framer-motion";
import { MessageCircle, Cloud, ArrowRight, Cpu, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: MessageCircle,
    title: "Communicate Your Goal",
    description: "Tell A.U.R.A. in plain English. 'Goodnight', 'Leaving Home', 'Movie Time'—or any custom scenario.",
  },
  {
    number: "2",
    icon: Cloud,
    title: "A.I. Plans Your Scene",
    description: "Cloud AI breaks your goal into specialist actions: lighting, security, ambiance, energy.",
  },
  {
    number: "3",
    icon: Cpu,
    title: "Devices Execute in Harmony",
    description: "Connected Tuya devices receive precise commands in perfect sequence.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4 bg-primary/10 px-4 py-2 rounded-full">
            How It Works
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Three Steps to Smart Living
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            From voice command to device execution in seconds.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50">
            <ArrowRight className="absolute -right-3 -top-2 w-5 h-5 text-primary" />
          </div>
          
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="text-center">
                {/* Icon */}
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                    <step.icon className="w-9 h-9 text-primary" strokeWidth={1.5} />
                  </div>
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                
                {/* Accent line */}
                <div className="w-10 h-0.5 bg-primary mx-auto mb-4" />
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
