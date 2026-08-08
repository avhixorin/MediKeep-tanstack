import React from "react";
import { motion } from "framer-motion";
import { testimonials } from "./testimonials";

const Benefits: React.FC = () => {

  return (
    <section
      id="benefits"
      className="relative min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-[hsl(var(--background))] to-[hsl(var(--muted))]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tighter leading-[1.1]">
          Real Stories. <span className="text-red-500">Real Impact.</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg mt-4 font-medium leading-relaxed max-w-2xl px-4">
          Voices from patients and professionals connected through MediKeep’s
          intelligent care network.
        </p>
      </motion.div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl z-10">
        {testimonials.slice(0, 6).map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative p-6 rounded-2xl backdrop-blur-md bg-background/80 border border-border/40 shadow-lg hover:shadow-2xl transition-all duration-150 cursor-default"
          >
            <motion.div
              className="absolute inset-0 rounded-2xl bg-red-400/10 blur-xl -z-10 opacity-0"
              whileHover={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />

            <p className="text-muted-foreground italic text-sm mb-4 leading-relaxed">
              “{t.testimonial}”
            </p>
            <div className="flex items-center gap-4 mt-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border border-border/40 shadow-sm"
              />
              <div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.designation}, {t.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-95 h-95 bg-red-500/10 blur-3xl rounded-full top-[30%] left-1/2 -translate-x-1/2 -z-10"
      />

      {/* Decorative bottom wave */}
      <svg
        className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none -z-10"
        viewBox="0 0 1440 320"
      >
        <defs>
          <linearGradient id="gradient" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          fill="url(#gradient)"
          d="M0,288L60,277.3C120,267,240,245,360,208C480,171,600,117,720,106.7C840,96,960,128,1080,138.7C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>
    </section>
  );
};

export default Benefits;
