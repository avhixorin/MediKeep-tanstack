"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
}

interface PricingCardProps {
  plan: Plan;
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isPopular = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`relative cursor-pointer flex flex-col justify-between p-8 rounded-2xl backdrop-blur-md bg-background from-[hsl(var(--background))]/70 to-[hsl(var(--muted))]/50 border border-border/40 shadow-lg hover:shadow-2xl transition-all duration-300 ${
      isPopular ? "border-red-500/70 ring-2 ring-red-400/30" : ""
    }`}
  >
    {isPopular && (
      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
        Most Popular
      </div>
    )}

    <div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">{plan.name}</h3>
      <p className="text-muted-foreground mb-4">{plan.description}</p>

      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-bold text-red-500">{plan.price}</span>
        <span className="text-sm text-muted-foreground">/month</span>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-foreground/90">
            <CheckCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`w-full cursor-pointer font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md ${
        isPopular
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-[hsl(var(--muted))]/40 hover:bg-[hsl(var(--muted))]/60 text-foreground border border-border/40"
      }`}
    >
      Subscribe to {plan.name}
    </motion.button>

    <motion.div
      animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.03, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute inset-0 rounded-2xl ${
        isPopular ? "bg-red-400/10 blur-2xl" : "bg-red-300/5 blur-2xl"
      } -z-10`}
    />
  </motion.div>
);

const Pricing = () => {
  const plans: Plan[] = [
    {
      name: "Basic",
      price: "$10",
      description: "Perfect for individuals starting their digital care journey.",
      features: ["Consultation scheduling", "Access to 10 health records"],
    },
    {
      name: "Standard",
      price: "$25",
      description: "Ideal for families and regular users with growing needs.",
      features: [
        "All Basic features",
        "Unlimited health records",
        "Priority doctor support",
      ],
    },
    {
      name: "Premium",
      price: "$50",
      description: "Comprehensive support with full AI-assisted insights.",
      features: [
        "All Standard features",
        "24/7 doctor access",
        "Advanced AI health tracking tools",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-background"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tighter leading-[1.1]">
          Choose Your <span className="text-red-500">Plan of Care</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg mt-4 font-medium leading-relaxed max-w-2xl px-4">
          Empower your healthcare journey with smart, scalable plans that adapt to your lifestyle.
        </p>
      </motion.div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full z-10">
        {plans.map((plan, i) => (
          <PricingCard key={i} plan={plan} isPopular={i === 1} />
        ))}
      </div>
    </section>
  );
};

export default Pricing;
