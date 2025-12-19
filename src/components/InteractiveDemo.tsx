import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Bot, User, Sparkles, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CommandItem {
  type: "user" | "aura";
  text: string;
}

const commandResponses: Record<string, { response: string; agents: string[]; devices: number }> = {
  goodnight: {
    response:
      "🌙 Executing 'Goodnight' routine: Locking all doors, turning off lights, setting thermostat to sleep mode (68°F), and arming security system. Sweet dreams!",
    agents: ["Orchestrator", "Security", "Ambiance", "Energy"],
    devices: 8,
  },
  "movie time": {
    response:
      "🎬 Creating 'Movie Time' atmosphere: Dimming living room lights to 20%, lowering motorized blinds, setting soundbar to 'Cinema' mode, and muting notifications. Enjoy!",
    agents: ["Orchestrator", "Ambiance"],
    devices: 5,
  },
  vacation: {
    response:
      "✈️ Activating 'Vacation Mode': Securing all entry points, setting thermostat to eco mode, enabling smart lights for simulated occupancy, and pausing non-essential devices.",
    agents: ["Orchestrator", "Security", "Energy"],
    devices: 12,
  },
  cold: {
    response:
      "🔥 Increasing comfort: Setting thermostat to 72°F, activating the fireplace, and closing drafty window blinds. The room will be cozy in about 10 minutes!",
    agents: ["Orchestrator", "Ambiance", "Health"],
    devices: 3,
  },
  energy: {
    response:
      "📊 Energy Report: This week you used 15% less energy than last week! Your solar panels produced 85 kWh, covering 70% of consumption. Top user: HVAC system.",
    agents: ["Orchestrator", "Energy"],
    devices: 0,
  },
};

const COLORS = ["#6366f1", "#f87171", "#10b981", "#fbbf24", "#0ea5e9"];

const quickCommands = [
  { label: "Goodnight", emoji: "🌙" },
  { label: "Movie time", emoji: "🎬" },
  { label: "I'm cold", emoji: "🔥" },
  { label: "Energy report", emoji: "📊" },
];

const InteractiveDemo = () => {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<CommandItem[]>([
    {
      type: "aura",
      text: '👋 Hello! I\'m A.U.R.A., your Home Executive. Try giving me a goal like "Goodnight" or "Movie time" and watch the magic happen!',
    },
  ]);
  const [stats, setStats] = useState({ agents: 1, devices: 0, commands: 0 });
  const [chartData, setChartData] = useState([
    { name: "Orchestrator", value: 3 },
    { name: "Security", value: 0.5 },
    { name: "Ambiance", value: 0.5 },
    { name: "Energy", value: 0.5 },
    { name: "Health", value: 0.5 },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = () => {
    if (!command.trim()) return;

    const userCommand = command.toLowerCase();
    setHistory((prev) => [...prev, { type: "user", text: command }]);
    setCommand("");
    setIsTyping(true);

    let response = {
      response:
        '🤔 I understand you want help with something. Try phrasing it as a goal like "Goodnight", "Movie time", or "I\'m cold".',
      agents: ["Orchestrator"],
      devices: 1,
    };

    for (const [key, data] of Object.entries(commandResponses)) {
      if (userCommand.includes(key)) {
        response = data;
        break;
      }
    }

    setTimeout(() => {
      setIsTyping(false);
      setHistory((prev) => [...prev, { type: "aura", text: response.response }]);

      setStats((prev) => ({
        agents: Math.max(prev.agents, response.agents.length),
        devices: prev.devices + response.devices,
        commands: prev.commands + 1,
      }));

      const newChartData = [
        { name: "Orchestrator", value: response.agents.includes("Orchestrator") ? 5 : 0.5 },
        { name: "Security", value: response.agents.includes("Security") ? 5 : 0.5 },
        { name: "Ambiance", value: response.agents.includes("Ambiance") ? 5 : 0.5 },
        { name: "Energy", value: response.agents.includes("Energy") ? 5 : 0.5 },
        { name: "Health", value: response.agents.includes("Health") ? 5 : 0.5 },
      ];
      setChartData(newChartData);
    }, 1000);
  };

  return (
    <section id="demo" className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Live Interaction
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Experience Goal-Oriented Automation
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Try giving A.U.R.A. high-level goals and watch how it coordinates multiple agents.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden"
          >
            {/* Console Header */}
            <div className="bg-muted/50 px-6 py-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                </div>
                <span className="font-medium text-foreground">A.U.R.A. Command Interface</span>
              </div>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>

            <div className="p-6">
              {/* Message History */}
              <div 
                ref={historyRef}
                className="h-64 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin"
              >
                {history.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${item.type === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      item.type === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-gradient-secondary text-secondary-foreground"
                    }`}>
                      {item.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      item.type === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}>
                      <p className="text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="bg-muted p-4 rounded-2xl rounded-tl-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && processCommand()}
                  placeholder="Tell A.U.R.A. what you want..."
                  className="flex-1 rounded-full px-5 bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Button 
                  onClick={processCommand} 
                  size="icon" 
                  className="rounded-full w-11 h-11 shrink-0"
                  disabled={isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Commands */}
              <div className="flex flex-wrap gap-2 mt-4">
                {quickCommands.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => {
                      setCommand(cmd.label);
                    }}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cmd.emoji} {cmd.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats & Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Bot, label: "Agents Activated", value: stats.agents, color: "text-primary" },
                { icon: Cpu, label: "Devices Controlled", value: stats.devices, color: "text-secondary" },
                { icon: Zap, label: "Commands Processed", value: stats.commands, color: "text-warning" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-2xl p-5 text-center shadow-lg border border-border/50"
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50">
              <h4 className="font-semibold text-foreground mb-4">Live Agent Activity</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="transition-all duration-300"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tuya Integration */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Tuya Platform Integration
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                A.U.R.A. leverages Tuya's AI+IoT ecosystem for seamless device integration.
              </p>
              <div className="flex flex-wrap gap-2">
                {["TuyaOpen SDK", "AI Agent Platform", "Cross-Platform", "Security Compliance"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;