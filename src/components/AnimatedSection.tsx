import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";

type AnimatedSectionProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

const AnimatedSection = ({ children, delay = 0, className, ...props }: AnimatedSectionProps) => (
  <motion.section
    className={className}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.6, delay }}
    {...props}
  >
    {children}
  </motion.section>
);

export default AnimatedSection;

