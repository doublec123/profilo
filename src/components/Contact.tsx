import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AnimatedSection from "./AnimatedSection";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace these with your actual EmailJS credentials
    const serviceId = "your-emailjs-service-id";
    const templateId = "your-emailjs-template-id";
    const publicKey = "your-emailjs-public-key";

    if (!serviceId || !templateId || !publicKey || serviceId === "your-emailjs-service-id") {
      toast.error("Email service is not configured. Please configure EmailJS credentials in Contact.tsx");
      return;
    }

    setIsSending(true);
    emailjs
      .send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
          to_email: "ilesomari9@gmail.com",
          phone: "+213557550841",
        },
        { publicKey },
      )
      .then(() => {
        toast.success("Message sent! I’ll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => {
        toast.error("Something went wrong while sending your message.");
      })
      .finally(() => setIsSending(false));
  };

  return (
    <AnimatedSection id="contact" className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          <span className="gradient-text">Get In Touch</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Let's Work Together</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                I'm always interested in hearing about new projects and opportunities. 
                Whether you need a website, security audit, or automation solution, 
                let's discuss how I can help bring your ideas to life.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span>ilesomari9@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground hover:text-secondary transition-colors">
                <Phone className="h-5 w-5" />
                <span>+213 557 550 841</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground hover:text-accent transition-colors">
                <MapPin className="h-5 w-5" />
                <span>Remote / Available Worldwide</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            <div>
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-background/50 border-glass-border focus:border-primary transition-colors"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-background/50 border-glass-border focus:border-primary transition-colors"
              />
            </div>
            <div>
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="bg-background/50 border-glass-border focus:border-primary transition-colors resize-none"
              />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Contact;
