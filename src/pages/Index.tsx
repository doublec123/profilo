import { motion } from "framer-motion";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Certificates from "@/components/Certificates";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <motion.main
      className="min-h-screen"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Certificates />
      <Projects />
      <Contact />
      <Footer />
    </motion.main>
  );
};

export default Index;
