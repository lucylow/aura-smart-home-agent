import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Architecture from "@/components/Architecture";
import InteractiveDemo from "@/components/InteractiveDemo";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProblemSolution />
        <Architecture />
        <InteractiveDemo />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
