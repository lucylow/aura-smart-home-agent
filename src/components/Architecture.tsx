import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Shield, Palette, Zap, HeartPulse, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const agentData = {
  orchestrator: {
    name: "Orchestrator Agent",
    description:
      "The central executive that coordinates all specialist agents. It interprets high-level user goals, creates execution plans, and delegates tasks to the appropriate specialists.",
    capabilities: [
      "Natural language understanding of user goals",
      "Multi-step planning and task decomposition",
      "Context-aware decision making",
      "Conflict resolution between specialist agents",
      "Human-in-the-loop confirmation for critical actions",
    ],
    gradient: "from-primary to-primary-dark",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
  },
  security: {
    name: "Security & Safety Agent",
    description:
      "Manages all security-related devices and ensures home safety. Monitors for anomalies and responds to potential threats.",
    capabilities: [
      "Door/window lock control and status monitoring",
      "Smart camera management and motion detection",
      "Smoke/CO alarm integration and emergency response",
      "Anomaly detection and alerting",
      "Away mode automation and simulated occupancy",
    ],
    gradient: "from-accent to-accent/70",
    bgColor: "bg-accent/10",
    textColor: "text-accent",
  },
  ambiance: {
    name: "Ambiance & Comfort Agent",
    description:
      "Creates the perfect environment by controlling lighting, climate, audio, and visual elements throughout the home.",
    capabilities: [
      "Multi-zone lighting control with scene management",
      "Smart thermostat and HVAC optimization",
      "Whole-home audio synchronization",
      "Motorized blind/window shade control",
      "Mood-based atmosphere creation",
    ],
    gradient: "from-secondary to-secondary-dark",
    bgColor: "bg-secondary/10",
    textColor: "text-secondary",
  },
  energy: {
    name: "Energy & Efficiency Agent",
    description:
      "Optimizes energy consumption, reduces costs, and promotes sustainable home management through intelligent automation.",
    capabilities: [
      "Real-time energy monitoring and reporting",
      "Peak demand management and load shifting",
      "Smart plug control for vampire load elimination",
      "Renewable energy integration optimization",
      "Utility rate analysis and cost-saving automation",
    ],
    gradient: "from-warning to-warning/70",
    bgColor: "bg-warning/10",
    textColor: "text-warning",
  },
  health: {
    name: "Health & Wellness Agent",
    description:
      "Monitors indoor environmental quality and promotes occupant wellness through proactive adjustments to the home environment.",
    capabilities: [
      "Air quality monitoring (PM2.5, VOCs, CO2)",
      "Humidity and temperature optimization for health",
      "Sleep environment creation and monitoring",
      "Water quality monitoring and filter status",
      "Wellness routine integration and reminders",
    ],
    gradient: "from-info to-info/70",
    bgColor: "bg-info/10",
    textColor: "text-info",
  },
};

type AgentKey = keyof typeof agentData;

const agents = [
  { id: "security" as AgentKey, Icon: Shield, position: "top-[12%] left-[8%] md:left-[12%]" },
  { id: "ambiance" as AgentKey, Icon: Palette, position: "top-[12%] right-[8%] md:right-[12%]" },
  { id: "energy" as AgentKey, Icon: Zap, position: "bottom-[12%] left-[8%] md:left-[12%]" },
  { id: "health" as AgentKey, Icon: HeartPulse, position: "bottom-[12%] right-[8%] md:right-[12%]" },
];

const Architecture = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentKey>("orchestrator");
  const [showPanel, setShowPanel] = useState(false);

  const handleAgentClick = (agentId: AgentKey) => {
    setSelectedAgent(agentId);
    setShowPanel(true);
  };

  return (
    <section id="architecture" className="py-24 px-6 bg-muted/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Multi-Agent Architecture
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            The Executive Team Behind A.U.R.A.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Click on any agent to explore their specialized capabilities and how they collaborate.
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-[450px] md:h-[500px] bg-card rounded-3xl p-8 shadow-xl border border-border/50 mb-8 overflow-hidden"
        >
          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
            {agents.map((agent) => (
              <motion.line
                key={agent.id}
                x1="50%"
                y1="50%"
                x2={agent.position.includes("left") ? "22%" : "78%"}
                y2={agent.position.includes("top") ? "22%" : "78%"}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: selectedAgent === agent.id ? 1 : 0.2 
                }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </svg>

          {/* Orchestrator (Center) */}
          <motion.button
            onClick={() => handleAgentClick("orchestrator")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${agentData.orchestrator.gradient} text-primary-foreground flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-10 shadow-xl ${
              selectedAgent === "orchestrator" ? "ring-4 ring-secondary/50 animate-pulse-glow" : "hover:shadow-2xl"
            }`}
          >
            <Crown className="w-10 h-10 md:w-12 md:h-12 mb-2" />
            <h3 className="font-bold text-base md:text-lg">Orchestrator</h3>
            <p className="text-xs md:text-sm opacity-80">Executive Decision Maker</p>
          </motion.button>

          {/* Specialist Agents */}
          {agents.map((agent) => {
            const data = agentData[agent.id];
            return (
              <motion.button
                key={agent.id}
                onClick={() => handleAgentClick(agent.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`absolute ${agent.position} w-28 md:w-36 p-4 md:p-5 rounded-2xl bg-gradient-to-br ${data.gradient} text-primary-foreground text-center cursor-pointer transition-all duration-300 shadow-lg ${
                  selectedAgent === agent.id ? "ring-4 ring-secondary/50 shadow-xl scale-105" : "hover:shadow-xl"
                }`}
              >
                <agent.Icon className="w-6 h-6 md:w-7 md:h-7 mx-auto mb-2" />
                <h3 className="font-bold text-xs md:text-sm">{data.name.split(" ")[0]}</h3>
                <p className="text-[10px] md:text-xs opacity-80 mt-1 line-clamp-2">
                  {data.name.includes("Security")
                    ? "Locks, cameras, alarms"
                    : data.name.includes("Ambiance")
                    ? "Lights, climate, audio"
                    : data.name.includes("Energy")
                    ? "Optimization & savings"
                    : "Air quality, wellness"}
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Agent Info Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAgent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl p-8 shadow-lg border border-border/50"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${agentData[selectedAgent].bgColor} flex items-center justify-center`}>
                  {selectedAgent === "orchestrator" ? (
                    <Crown className={`w-7 h-7 ${agentData[selectedAgent].textColor}`} />
                  ) : selectedAgent === "security" ? (
                    <Shield className={`w-7 h-7 ${agentData[selectedAgent].textColor}`} />
                  ) : selectedAgent === "ambiance" ? (
                    <Palette className={`w-7 h-7 ${agentData[selectedAgent].textColor}`} />
                  ) : selectedAgent === "energy" ? (
                    <Zap className={`w-7 h-7 ${agentData[selectedAgent].textColor}`} />
                  ) : (
                    <HeartPulse className={`w-7 h-7 ${agentData[selectedAgent].textColor}`} />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {agentData[selectedAgent].name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Specialist Agent</p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {agentData[selectedAgent].description}
            </p>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Core Capabilities</h4>
              <ul className="grid sm:grid-cols-2 gap-3">
                {agentData[selectedAgent].capabilities.map((cap, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{cap}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Tuya Integration Badge */}
            <div className="mt-8 p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Tuya Integration:</span> Connected via TuyaOpen SDK, Cloud APIs, and Device Management
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Architecture;