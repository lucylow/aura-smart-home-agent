import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain, Mic, MicOff, Send, Settings, ChevronLeft,
  Lightbulb, Thermometer, Lock, Camera, Zap, Shield,
  Palette, HeartPulse, Crown, CheckCircle2,
  Loader2, Power, Home, Moon, Film, Car, Sun, Bot, User, Sparkles, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { callAuraOrchestrator, AuraOrchestratorResponse, AuraPlanStep, QUICK_SCENARIOS } from "@/lib/aura";

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

const quickActions = [
  { id: "goodnight", name: "Goodnight", icon: Moon, gradient: "from-indigo-500 to-purple-600", goal: QUICK_SCENARIOS.goodnight },
  { id: "movie-time", name: "Movie Time", icon: Film, gradient: "from-pink-500 to-rose-600", goal: QUICK_SCENARIOS.movie },
  { id: "leaving", name: "Away Mode", icon: Car, gradient: "from-orange-500 to-amber-600", goal: QUICK_SCENARIOS.leaving },
  { id: "morning", name: "Wake Up", icon: Sun, gradient: "from-yellow-400 to-orange-500", goal: QUICK_SCENARIOS.morning },
];

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "👋 Hello! I'm A.U.R.A., your Home Executive. How can I assist you today?", sender: "agent", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [devices, setDevices] = useState(mockDevices);
  const [agents, setAgents] = useState(initialAgents);
  const [currentPlan, setCurrentPlan] = useState<AuraOrchestratorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isProcessing = isPlanning || isExecuting;

  // Map specialist names to agent types for animation
  const specialistToAgentType = (specialist: string): string => {
    if (specialist.toLowerCase().includes('ambiance')) return 'ambiance';
    if (specialist.toLowerCase().includes('security')) return 'security';
    if (specialist.toLowerCase().includes('energy')) return 'energy';
    return 'orchestrator';
  };

  const processGoal = async (goalText: string) => {
    if (!goalText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: goalText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsPlanning(true);
    setError(null);
    setCurrentPlan(null);

    // Set orchestrator to processing
    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: a.type === "orchestrator" ? "processing" : "idle",
      }))
    );

    try {
      const res = await callAuraOrchestrator({ mode: 'plan', goalText, userId: 'demo-user' });
      
      if (!res.ok) {
        const errorMsg = 'error' in res ? res.error : 'Unknown error';
        setError(errorMsg);
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: `❌ Error: ${errorMsg}`,
          sender: "agent",
          timestamp: new Date(),
        }]);
        setAgents(initialAgents);
      } else {
        setCurrentPlan(res);
        
        // Animate agents based on steps
        const involvedTypes = new Set<string>(['orchestrator']);
        res.steps.forEach(step => {
          involvedTypes.add(specialistToAgentType(step.specialist));
        });

        setAgents((prev) =>
          prev.map((a) => ({
            ...a,
            status: involvedTypes.has(a.type) ? "success" : "idle",
          }))
        );

        // Build response message
        const planGoalText = res.mode === 'plan' ? res.goalText : goalText;
        const stepSummary = res.steps.map((s, i) => `${i + 1}. ${s.description}`).join('\n');
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: `🎯 Plan created for "${planGoalText}":\n\n${stepSummary}\n\nReady to execute when you are!`,
          sender: "agent",
          timestamp: new Date(),
        }]);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
      setAgents(initialAgents);
    } finally {
      setIsPlanning(false);
      setTimeout(() => setAgents(initialAgents), 3000);
    }
  };

  const executePlan = async () => {
    if (!currentPlan || !('planId' in currentPlan) || isProcessing) return;

    setIsExecuting(true);
    setError(null);

    // Set all involved agents to processing
    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: "processing",
      }))
    );

    try {
      const res = await callAuraOrchestrator({
        mode: 'execute',
        planId: currentPlan.planId,
        userId: 'demo-user',
      });

      if (!res.ok) {
        const errorMsg = 'error' in res ? res.error : 'Unknown error';
        setError(errorMsg);
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: `❌ Execution failed: ${errorMsg}`,
          sender: "agent",
          timestamp: new Date(),
        }]);
      } else {
        setCurrentPlan(res);
        
        // All agents success
        setAgents((prev) =>
          prev.map((a) => ({
            ...a,
            status: "success",
          }))
        );

        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: `✅ Plan executed successfully! All ${res.steps.length} steps completed.`,
          sender: "agent",
          timestamp: new Date(),
        }]);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setIsExecuting(false);
      setTimeout(() => setAgents(initialAgents), 3000);
    }
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

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'running': return <Loader2 className="w-4 h-4 text-warning animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  const onlineDevices = devices.filter((d) => d.online).length;
  const activeDevices = devices.filter((d) => d.state).length;

  const canExecute = currentPlan && 'planId' in currentPlan && currentPlan.mode === 'plan' && !isProcessing;

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
            <Badge variant="outline" className="hidden md:flex text-xs">Demo Mode</Badge>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
              <button onClick={() => setError(null)} className="ml-auto text-xs underline">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

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
                  {isPlanning && (
                    <Badge className="gap-1 bg-warning/10 text-warning border-warning/20">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Planning...
                    </Badge>
                  )}
                  {isExecuting && (
                    <Badge className="gap-1 bg-success/10 text-success border-success/20">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Executing...
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
                          <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                          <p className={cn("text-[10px] mt-1.5", msg.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground")}>
                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {isPlanning && (
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
                      onKeyDown={(e) => e.key === "Enter" && processGoal(input)}
                      placeholder="Tell A.U.R.A. what you want..."
                      disabled={isProcessing}
                      className="flex-1 rounded-full px-4 bg-background border-border/50"
                    />
                    <Button variant={voiceActive ? "destructive" : "outline"} size="icon" onClick={() => setVoiceActive(!voiceActive)} className="rounded-full shrink-0">
                      {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Button onClick={() => processGoal(input)} disabled={!input.trim() || isProcessing} className="rounded-full shrink-0" size="icon">
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
                  disabled={isProcessing}
                  onClick={() => {
                    setInput(action.goal);
                    processGoal(action.goal);
                  }}
                  className={cn(
                    "relative p-4 rounded-2xl text-white text-center overflow-hidden shadow-lg transition-shadow hover:shadow-xl disabled:opacity-50",
                    `bg-gradient-to-br ${action.gradient}`
                  )}
                >
                  <action.icon className="w-7 h-7 mx-auto mb-2 drop-shadow-sm" />
                  <span className="text-sm font-medium">{action.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Plan Visualization */}
            <AnimatePresence>
              {currentPlan && 'steps' in currentPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="shadow-lg border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Brain className="w-5 h-5 text-primary" />
                          Execution Plan
                        </CardTitle>
                        <Badge variant="outline" className="text-xs font-mono">
                          {currentPlan.planId}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {currentPlan.steps.map((step, idx) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl border transition-all",
                            step.status === 'completed' && "bg-success/5 border-success/20",
                            step.status === 'running' && "bg-warning/5 border-warning/20",
                            step.status === 'pending' && "bg-muted/30 border-border/50"
                          )}
                        >
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {step.order}
                            </span>
                            {getStepStatusIcon(step.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {step.specialist}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground">{step.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {step.devices.map((device) => (
                                <span key={device} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  {device}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {canExecute && (
                        <Button 
                          onClick={executePlan} 
                          className="w-full mt-4 rounded-xl"
                          size="lg"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Execute Plan
                        </Button>
                      )}

                      {currentPlan.mode === 'execute' && (
                        <div className="text-center py-2">
                          <Badge className="bg-success/10 text-success border-success/20">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            All steps completed
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

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
