import { Code, Shield, Zap } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const About = () => {
  return (
    <AnimatedSection id="about" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          <span className="gradient-text">About Me</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I am a Frontend Developer and Ethical Hacker with a strong focus on building secure, modern,
              and intelligent digital experiences. My work combines clean UI/UX design, solid frontend
              engineering, and practical cybersecurity knowledge to create projects that are both visually
              strong and technically reliable.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Over the past years, I’ve built a wide range of applications—from responsive frontend interfaces
              and AI-powered tools, to Python automation scripts and Telegram bots. I also work with n8n and
              Supabase to build automation workflows and integrate apps with databases and APIs.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My background in ethical hacking allows me to approach development with a security-first mindset.
              I regularly use tools like Nmap, Burp Suite, and Wireshark to understand how systems behave,
              which helps me write safer and more optimized code.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I enjoy building things that solve real problems, whether it’s a business dashboard, a Telegram
              bot, an AI workflow, or a complete website. My goal is to grow into a highly skilled software
              engineer capable of creating reliable systems, while continuing to improve in cybersecurity,
              automation, and modern frontend technologies.
            </p>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 hover:neon-glow-primary transition-all duration-300">
              <Code className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Frontend Excellence</h3>
              <p className="text-muted-foreground">
                Building responsive, accessible, and performant web applications 
                using modern frameworks and best practices.
              </p>
            </div>

            <div className="glass-card p-6 hover:neon-glow-secondary transition-all duration-300">
              <Shield className="h-10 w-10 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Security First</h3>
              <p className="text-muted-foreground">
                Identifying vulnerabilities and implementing robust security measures 
                to protect applications and data.
              </p>
            </div>

            <div className="glass-card p-6 hover:neon-glow-accent transition-all duration-300">
              <Zap className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Automation</h3>
              <p className="text-muted-foreground">
                Designing intelligent workflows and agents that streamline processes 
                and enhance productivity through automation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default About;
