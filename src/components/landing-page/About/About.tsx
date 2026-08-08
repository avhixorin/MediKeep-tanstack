import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { features } from "@/constants/landingPageConsts";

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 md:py-32 min-h-screen flex items-center bg-background">
        <div className="absolute inset-0 bg-linear-to-br from-rose-100/40 via-background to-sky-100/30 dark:from-rose-950/20 dark:via-background dark:to-sky-950/20 blur-3xl pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="grid gap-12 lg:gap-20 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-600 dark:text-rose-400 mb-2">
                <span className="flex h-2 w-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
                Redefining Healthcare
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Building the Bridge Between{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-orange-400">
                  Patients
                </span>{" "}
                and{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-blue-500">
                  Doctors
                </span>
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-lg font-medium">
                At <span className="font-semibold text-foreground">MediKeep</span>, 
                we&apos;re bringing patients and doctors closer through smart, seamless technology. 
                Our platform simplifies communication, organizes records, and empowers personalized care.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="flex justify-center relative group"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-rose-400/20 to-sky-400/20 blur-3xl rounded-full scale-90 group-hover:scale-105 transition-transform duration-700" />
              
              <img
                src="https://res.cloudinary.com/avhixorin/image/upload/f_auto/v1737574912/Essential_-_Doctor_clinic_doctor_consultation_doctor_patient_discussion_bbjw4g.png"
                alt="Doctor and patient consultation"
                className="relative z-10 object-contain dark:bg-foreground/5 dark:invert rounded-3xl w-[90%] md:w-[85%] drop-shadow-2xl transition-transform duration-500 hover:-translate-y-2"
              />
            </motion.div>
          </div>
        </div>

        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 bottom-0 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-1/4 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl translate-x-1/2" 
        />
      </section>

      <section className="relative px-6 py-24 md:py-32 bg-muted/50 border-t border-border/40 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20 space-y-4 flex flex-col items-center"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-rose-400">MediKeep?</span>
            </h3>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              Because we don&apos;t just build software — we build connections.  
              Designed with empathy, powered by data, and driven by precision.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 100 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card
                  className="group relative h-full overflow-hidden p-8 rounded-3xl border border-border/50 
                  bg-background/40 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-500
                  hover:-translate-y-1 hover:bg-background/80 hover:border-rose-500/30"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-rose-500/0 to-transparent group-hover:from-rose-500/5 transition-colors duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted text-3xl mb-6 text-foreground group-hover:text-rose-500 group-hover:bg-rose-500/10 transition-colors duration-300 shadow-inner"
                    >
                      {feature.icon}
                    </motion.div>

                    <h4 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground/90 text-base leading-relaxed grow">
                      {feature.desc}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}