import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain, Mic, MicOff, Send, Settings, ChevronLeft,
  Lightbulb, Thermometer, Lock, Camera, Zap, Shield,
  Palette, HeartPulse, Crown, CheckCircle2,
  Loader2, Power, Home, Moon, Film, Car, Sun, Bot, User, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface Device {
  id: string;
  name: string;
  type: "light" | "thermostat" | "lock" | "camera";
  room: string;
  online: boolean;
  state: boolean;
}

interface AgentStatus {
  id: string;
  name: string;
  type: "orchestrator" | "security" | "ambiance" | "energy" | "health";
  status: "idle" | "processing" | "success";
}

const mockDevices: Device[] = [
  { id: "1", name: "Living Room Light", type: "light", room: "Living Room", online: true, state: true },
  { id: "2", name: "Bedroom Light", type: "light", room: "Bedroom", online: true, state: false },
  { id: "3", name: "Main Thermostat", type: "thermostat", room: "Hallway", online: true, state: true },
  { id: "4", name: "Front Door Lock", type: "lock", room: "Entry", online: true, state: true },
  { id: "5", name: "Backyard Camera", type: "camera", room: "Backyard", online: true, state: true },
  { id: "6", name: "Kitchen Light", type: "light", room: "Kitchen", online: false, state: false },
];

const initialAgents: AgentStatus[] = [
  { id: "1", name: "Orchestrator", type: "orchestrator", status: "idle" },
  { id: "2", name: "Security", type: "security", status: "idle" },
  { id: "3", name: "Ambiance", type: "ambiance", status: "idle" },
  { id: "4", name: "Energy", type: "energy", status: "idle" },
  { id: "5", name: "Health", type: "health", status: "idle" },
];

const commandResponses: Record<string, { response: string; agents: string[] }> = {
  goodnight: {
    response: "🌙 Executing 'Goodnight': Locking doors, turning off lights, setting thermostat to 68°F, arming security. Sweet dreams!",
    agents: ["orchestrator", "security", "ambiance", "energy"],
  },
  "movie time": {
    response: "🎬 Creating 'Movie Time': Dimming lights to 20%, lowering blinds, setting soundbar to Cinema mode. Enjoy!",
    agents: ["orchestrator", "ambiance"],
  },
  vacation: {
    response: "✈️ Activating 'Vacation Mode': Securing entries, eco thermostat, simulated occupancy enabled. Safe travels!",
    agents: ["orchestrator", "security", "energy"],
  },
  "good morning": {
    response: "☀️ Good morning! Opening blinds, energize lighting, thermostat to 72°F, starting coffee maker.",
    agents: ["orchestrator", "ambiance", "energy"],
  },
  cold: {
    response: "🔥 Warming up: Thermostat to 74°F, activating fireplace. Cozy in ~10 minutes!",
    agents: ["orchestrator", "ambiance", "health"],
  },
};

const quickActions = [
  { id: "goodnight", name: "Goodnight", icon: Moon, gradient: "from-indigo-500 to-purple-600" },
  { id: "movie-time", name: "Movie Time", icon: Film, gradient: "from-pink-500 to-rose-600" },
  { id: "vacation", name: "Away Mode", icon: Car, gradient: "from-orange-500 to-amber-600" },
  { id: "good-morning", name: "Wake Up", icon: Sun, gradient: "from-yellow-400 to-orange-500" },
];

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "👋 Hello! I'm A.U.R.A., your Home Executive. How can I assist you today?", sender: "agent", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [devices, setDevices] = useState(mockDevices);
  const [agents, setAgents] = useState(initialAgents);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const processCommand = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    const lowerInput = input.toLowerCase();
    let response = {
      response: "🤔 Try commands like 'Goodnight', 'Movie time', 'Good morning', or 'I'm cold'.",
      agents: ["orchestrator"],
    };

    for (const [key, data] of Object.entries(commandResponses)) {
      if (lowerInput.includes(key)) {
        response = data;
        break;
      }
    }

    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: response.agents.includes(a.type) ? "processing" : "idle",
      }))
    );

    await new Promise((r) => setTimeout(r, 1500));

    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: response.agents.includes(a.type) ? "success" : "idle",
      }))
    );

    setMessages((prev) => [...prev, {
      id: (Date.now() + 1).toString(),
      text: response.response,
      sender: "agent",
      timestamp: new Date(),
    }]);
    setIsProcessing(false);

    setTimeout(() => setAgents(initialAgents), 2000);
  };

  const toggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, state: !d.state } : d))
    );
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "light": return Lightbulb;
      case "thermostat": return Thermometer;
      case "lock": return Lock;
      case "camera": return Camera;
      default: return Power;
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case "orchestrator": return Crown;
      case "security": return Shield;
      case "ambiance": return Palette;
      case "energy": return Zap;
      case "health": return HeartPulse;
      default: return Brain;
    }
  };

  const getAgentColor = (type: string) => {
    switch (type) {
      case "orchestrator": return "from-primary to-primary-dark";
      case "security": return "from-accent to-accent/70";
      case "ambiance": return "from-secondary to-secondary-dark";
      case "energy": return "from-warning to-warning/70";
      case "health": return "from-info to-info/70";
      default: return "from-muted to-muted";
    }
  };

  const onlineDevices = devices.filter((d) => d.online).length;
  const activeDevices = devices.filter((d) => d.state).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Back</span>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">A.U.R.A.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">{onlineDevices}/{devices.length} Online</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Interface */}
            <Card className="shadow-lg border-border/50 overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Chat with A.U.R.A.
                  </CardTitle>
                  {isProcessing && (
                    <Badge className="gap-1 bg-warning/10 text-warning border-warning/20">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Thinking...
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px] px-4 py-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex gap-3", msg.sender === "user" ? "flex-row-reverse" : "")}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                          msg.sender === "user" ? "bg-primary" : "bg-gradient-secondary"
                        )}>
                          {msg.sender === "user" ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-secondary-foreground" />}
                        </div>
                        <div className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-3",
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        )}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p className={cn("text-[10px] mt-1.5", msg.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground")}>
                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {isProcessing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center shadow-sm">
                          <Bot className="w-4 h-4 text-secondary-foreground" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <span key={i} className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border/50 bg-muted/30">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && processCommand()}
                      placeholder="Tell A.U.R.A. what you want..."
                      disabled={isProcessing}
                      className="flex-1 rounded-full px-4 bg-background border-border/50"
                    />
                    <Button variant={voiceActive ? "destructive" : "outline"} size="icon" onClick={() => setVoiceActive(!voiceActive)} className="rounded-full shrink-0">
                      {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Button onClick={processCommand} disabled={!input.trim() || isProcessing} className="rounded-full shrink-0" size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInput(action.name);
                    setTimeout(processCommand, 100);
                  }}
                  className={cn(
                    "relative p-4 rounded-2xl text-white text-center overflow-hidden shadow-lg transition-shadow hover:shadow-xl",
                    `bg-gradient-to-br ${action.gradient}`
                  )}
                >
                  <action.icon className="w-7 h-7 mx-auto mb-2 drop-shadow-sm" />
                  <span className="text-sm font-medium">{action.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Agent Status */}
            <Card className="shadow-lg border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Agent Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {agents.map((agent) => {
                    const Icon = getAgentIcon(agent.type);
                    return (
                      <motion.div
                        key={agent.id}
                        animate={{ scale: agent.status === "processing" ? [1, 1.03, 1] : 1 }}
                        transition={{ repeat: agent.status === "processing" ? Infinity : 0, duration: 0.8 }}
                        className={cn(
                          "p-3 rounded-xl border text-center transition-all duration-300",
                          agent.status === "processing" && "border-warning bg-warning/5 shadow-md",
                          agent.status === "success" && "border-success bg-success/5 shadow-md",
                          agent.status === "idle" && "border-border/50 bg-card"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center transition-all",
                          agent.status === "idle" && `bg-gradient-to-br ${getAgentColor(agent.type)} text-white`,
                          agent.status === "processing" && "bg-warning text-warning-foreground",
                          agent.status === "success" && "bg-success text-success-foreground"
                        )}>
                          {agent.status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : agent.status === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <p className="text-xs font-medium truncate">{agent.name}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* System Stats */}
            <Card className="shadow-lg border-border/50 overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-secondary/10 to-primary/10">
                <CardTitle className="text-lg">System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Devices Online</span>
                    <span className="text-sm font-semibold text-foreground">{onlineDevices}/{devices.length}</span>
                  </div>
                  <Progress value={(onlineDevices / devices.length) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Active Devices</span>
                    <span className="text-sm font-semibold text-foreground">{activeDevices}</span>
                  </div>
                  <Progress value={(activeDevices / devices.length) * 100} className="h-2" />
                </div>
                <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Energy Today</span>
                  <span className="font-bold text-lg text-gradient">12.4 kWh</span>
                </div>
              </CardContent>
            </Card>

            {/* Device Grid */}
            <Card className="shadow-lg border-border/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Devices</CardTitle>
                  <Badge variant="secondary" className="text-xs">{devices.length} total</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {devices.map((device) => {
                  const Icon = getDeviceIcon(device.type);
                  return (
                    <div
                      key={device.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all duration-200",
                        device.state && device.online ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border/50",
                        !device.online && "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                          device.state && device.online ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{device.name}</p>
                          <p className="text-xs text-muted-foreground">{device.room}</p>
                        </div>
                      </div>
                      <Switch
                        checked={device.state}
                        onCheckedChange={() => toggleDevice(device.id)}
                        disabled={!device.online}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;