import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatedSection className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-background to-neon-cyan/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span className="gradient-text">Iles Omari</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Frontend Developer • Ethical Hacker
          </p>
        </div>

        <p
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Crafting secure, intelligent digital experiences through cutting-edge frontend development, 
          ethical security testing, and AI-powered automation solutions. Transforming complex problems 
          into elegant, user-centric designs.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => scrollToSection('projects')}
            className="group"
          >
            View Projects
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="secondary-hero" 
            size="lg"
            onClick={() => scrollToSection('contact')}
            className="group"
          >
            <Mail className="mr-2 h-5 w-5" />
            Contact Me
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Hero;
