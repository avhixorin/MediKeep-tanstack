import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const typingPrompts = [
  "How do I store medical reports safely?",
  "What is my ideal blood pressure?",
  "Explain MRI in simple terms.",
  "How to improve heart health?"
];

const HeroAI = () => {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [displayedBubble, setDisplayedBubble] = useState(null);
  const [answered, setAnswered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const writeLoop = () => {
      const text = typingPrompts[Math.floor(Math.random() * typingPrompts.length)];
      let index = 0;
      const interval = setInterval(() => {
        setPlaceholder(text.slice(0, index));
        index++;
        if (index > text.length) {
          clearInterval(interval);
          setTimeout(writeLoop, 2500);
        }
      }, 80);
    };
    writeLoop();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (answered) {
      navigate({ to: "/login" });
      return;
    }

    const res = await fetch("/api/mini-demo", {
      method: "POST",
      body: JSON.stringify({ query })
    });
    const data = await res.json();

    setDisplayedBubble(data.reply || "AI-powered medical insight just for you ❤️");
    setAnswered(true);
  };

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="flex w-full md:w-112.5 bg-background rounded-full shadow-lg border p-2 gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 text-sm focus:outline-none"
        />
        <button
          className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-background font-semibold transition"
        >
          Ask →
        </button>
      </form>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: -10 }}
        transition={{ duration: 0.5 }}
        className="mt-6 p-4 rounded-2xl bg-background shadow-md border max-w-70 text-sm"
      >
        {displayedBubble}
      </motion.div>

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-red-400/15 text-xs text-red-900 px-3 py-1 rounded-xl backdrop-blur-md"
          style={{ top: `${20 + i * 10}%`, left: `${i % 2 ? 70 : 15}%` }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💬 AI Insight
        </motion.div>
      ))}
    </div>
  );
};

export default HeroAI;
