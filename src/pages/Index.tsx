import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeatureTiles from "@/components/FeatureTiles";
import TryItSection from "@/components/TryItSection";
import Architecture from "@/components/Architecture";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <FeatureTiles />
        <TryItSection />
        <Architecture />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
