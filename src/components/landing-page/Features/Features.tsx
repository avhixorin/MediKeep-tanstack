import { motion } from "framer-motion";

const features = [
  {
    icon: "🩺",
    title: "Consult with Experts",
    desc: "Instantly connect with top doctors and receive insights tailored to your health. Break down barriers to care.",
    gradient: "from-sky-400 via-blue-500 to-indigo-500", 
    glow: "shadow-blue-500/20",
    colSpan: "lg:col-span-7", 
  },
  {
    icon: "🗂️",
    title: "Health Records Hub",
    desc: "Your entire medical history, intelligently organized and secure in one single place.",
    gradient: "from-orange-400 to-rose-500", 
    glow: "shadow-rose-500/20",
    colSpan: "lg:col-span-5", 
  },
  {
    icon: "🧠",
    title: "AI-Powered Insights",
    desc: "Receive real-time health recommendations powered by MediKeep’s cutting-edge AI core.",
    gradient: "from-rose-500 to-pink-600", 
    glow: "shadow-pink-500/20",
    colSpan: "lg:col-span-5", 
  },
  {
    icon: "🛡️",
    title: "End-to-End Security",
    desc: "Military-grade encryption ensures your data stays private. Only you and authorized doctors can access it.",
    gradient: "from-indigo-400 to-cyan-500", 
    glow: "shadow-cyan-500/20",
    colSpan: "lg:col-span-7", 
  },
];

export default function Features() {
  return (
    <section className="relative min-h-screen lg:h-screen flex flex-col items-center justify-center overflow-hidden bg-background py-16 lg:py-0">
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center justify-center h-full max-w-6xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mb-10 lg:mb-12 flex flex-col items-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center rounded-full border border-border/60 bg-background/80 backdrop-blur-xl px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-4 sm:mb-6 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            Core Architecture
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tighter leading-[1.1]">
            The <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 via-orange-400 to-rose-500 bg-size-[200%_auto] animate-gradient">Pulse</span> Behind MediKeep
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mt-4 font-medium leading-relaxed max-w-2xl px-4">
            Where AI precision meets human care. Discover the underlying features that keep your health data alive, secure, and effortlessly connected.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5 w-full">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                type: "spring",
                stiffness: 90,
                damping: 15,
              }}
              viewport={{ once: true, margin: "-50px" }}
              className={`group relative ${f.colSpan} perspective-1000`}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className={`relative h-full flex flex-col justify-start p-6 lg:p-8 rounded-4xl bg-card/40 backdrop-blur-2xl border border-border/40 shadow-lg overflow-hidden hover:${f.glow} transition-all duration-400`}
              >
                <motion.div 
                  className={`absolute -right-10 -top-10 w-48 h-48 bg-linear-to-br ${f.gradient} opacity-0 group-hover:opacity-10 blur-3xl rounded-full transition-opacity duration-500 pointer-events-none`}
                  animate={{ scale: [1, 1.1, 1], x: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />

                <div className={`absolute inset-0 border-[1.5px] border-transparent bg-linear-to-br ${f.gradient} opacity-0 group-hover:opacity-15 rounded-4xl transition-opacity duration-400 pointer-events-none mask-image-border`} />

                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className={`relative z-10 flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-linear-to-br ${f.gradient} mb-5 shadow-md`}
                >
                  <div className="absolute inset-0.5 bg-card rounded-[14px] flex items-center justify-center">
                    <span className="text-2xl drop-shadow-sm">{f.icon}</span>
                  </div>
                </motion.div>

                <div className="relative z-10 grow flex flex-col">
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2 lg:mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-foreground group-hover:to-muted-foreground transition-all duration-300">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}