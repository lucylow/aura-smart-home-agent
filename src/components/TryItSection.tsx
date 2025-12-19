import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Moon, Car, CheckCircle2, Loader2, Lightbulb, Thermometer, Lock, Speaker, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScenarioStep {
  action: string;
  device: string;
  icon: React.ElementType;
}

interface Scenario {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  steps: ScenarioStep[];
}

const scenarios: Scenario[] = [
  {
    id: "movie",
    name: "Movie Time",
    icon: Film,
    description: "Dim lights, close blinds, set comfort temperature, lock doors.",
    color: "bg-accent hover:bg-accent/90",
    steps: [
      { action: "Dim lights to 20%", device: "Living Room", icon: Lightbulb },
      { action: "Close motorized blinds", device: "Windows", icon: Lightbulb },
      { action: "Set temperature to 72°F", device: "Thermostat", icon: Thermometer },
      { action: "Set audio to Cinema mode", device: "Soundbar", icon: Speaker },
    ],
  },
  {
    id: "goodnight",
    name: "Goodnight",
    icon: Moon,
    description: "Turn off lights, enable night mode, arm security, close windows if rain.",
    color: "bg-primary hover:bg-primary-dark",
    steps: [
      { action: "Turn off all lights", device: "Whole Home", icon: Lightbulb },
      { action: "Lock all doors", device: "Entry Points", icon: Lock },
      { action: "Arm security system", device: "Security", icon: Lock },
      { action: "Set thermostat to 68°F", device: "HVAC", icon: Thermometer },
    ],
  },
  {
    id: "leaving",
    name: "Leaving Home",
    icon: Car,
    description: "All non-essential off, eco thermostat, lock all doors, arm security.",
    color: "bg-accent hover:bg-accent/90",
    steps: [
      { action: "Turn off all devices", device: "Whole Home", icon: Lightbulb },
      { action: "Set eco temperature", device: "Thermostat", icon: Thermometer },
      { action: "Lock all entry points", device: "Locks", icon: Lock },
      { action: "Arm full security", device: "Security", icon: Lock },
    ],
  },
];

const TryItSection = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleScenarioClick = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setCompletedSteps([]);
    setIsExecuting(true);

    // Simulate step-by-step execution
    scenario.steps.forEach((_, index) => {
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
        if (index === scenario.steps.length - 1) {
          setIsExecuting(false);
        }
      }, 800 * (index + 1));
    });
  };

  const resetDemo = () => {
    setActiveScenario(null);
    setCompletedSteps([]);
    setIsExecuting(false);
  };

  return (
    <section className="py-24 px-6 bg-secondary text-secondary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10" />
      
      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Try It Yourself
          </h2>
          <p className="text-secondary-foreground/80 max-w-xl mx-auto text-lg">
            Experience A.U.R.A. in demo mode. Choose a scenario, watch the plan, then see execution.
          </p>
        </motion.div>

        {/* Scenario Buttons */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {scenarios.map((scenario, index) => (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleScenarioClick(scenario)}
              disabled={isExecuting}
              className={`${scenario.color} rounded-2xl p-6 text-left transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-3 mb-3">
                <scenario.icon className="w-8 h-8" />
                <span className="text-lg font-bold">{scenario.name}</span>
              </div>
              <p className="text-sm opacity-90">{scenario.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Execution Panel */}
        <AnimatePresence>
          {activeScenario && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card rounded-2xl p-8 shadow-xl border border-border/50"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <activeScenario.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">{activeScenario.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {isExecuting ? "Executing..." : "Completed"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={resetDemo} className="rounded-full">
                  Reset
                </Button>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {activeScenario.steps.map((step, index) => {
                  const isCompleted = completedSteps.includes(index);
                  const isActive = !isCompleted && completedSteps.length === index;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        isCompleted
                          ? "bg-success/10 border-success/30"
                          : isActive
                          ? "bg-warning/10 border-warning/30"
                          : "bg-muted/50 border-border/50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isCompleted ? "bg-success" : isActive ? "bg-warning" : "bg-muted"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-success-foreground" />
                        ) : isActive ? (
                          <Loader2 className="w-5 h-5 text-warning-foreground animate-spin" />
                        ) : (
                          <step.icon className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? "text-success" : "text-foreground"}`}>
                          {step.action}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.device}</p>
                      </div>
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-success font-medium text-sm"
                        >
                          Done
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Success message */}
              {!isExecuting && completedSteps.length === activeScenario.steps.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-success/10 border border-success/30 rounded-xl text-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="font-medium text-success">All steps executed successfully!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeScenario.steps.length} devices coordinated in {activeScenario.steps.length * 0.8}s
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tuya Integration Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {["TuyaOpen API Ready", "Multi-Device Orchestration", "LLM-Powered Intent", "Demo & Live Modes", "Privacy-First Cloud"].map((badge) => (
            <span
              key={badge}
              className="px-4 py-2 bg-secondary-foreground/10 text-secondary-foreground rounded-full text-sm font-medium border border-secondary-foreground/20"
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TryItSection;
