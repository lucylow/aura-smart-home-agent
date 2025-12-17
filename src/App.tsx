import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import Research from "./pages/demo/Research";
import Graph from "./pages/demo/Graph";
import Memory from "./pages/demo/Memory";
import Agents from "./pages/Agents";
import PI from "./pages/agents/PI";
import Literature from "./pages/agents/Literature";
import Hypothesis from "./pages/agents/Hypothesis";
import Docs from "./pages/Docs";
import Api from "./pages/Api";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/demo/research" element={<Research />} />
          <Route path="/demo/graph" element={<Graph />} />
          <Route path="/demo/memory" element={<Memory />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/pi" element={<PI />} />
          <Route path="/agents/literature" element={<Literature />} />
          <Route path="/agents/hypothesis" element={<Hypothesis />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/api" element={<Api />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
