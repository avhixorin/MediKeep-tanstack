const navlinks = [
  {
    name: "Features",
    link: "/",
  },
  {
    name: "Pricing",
    link: "/",
  },
  {
    name: "About",
    link: "/",
  },
  {
    name: "Contact",
    link: "/",
  },
];

const organs = [
  {
    id: 1,
    name: "Heart",
    image: "/images/heart_model.png",
    chats: [
      { side: "left", text: "🩺 Detecting mild hypertrophy..." },
      { side: "right", text: "Recommendation: Monitor BP daily." },
    ],
    nwidth: "400px",
    mwidth: "300px",
  },
  {
    id: 2,
    name: "Brain",
    image: "/images/brain_model.png",
    chats: [
      { side: "left", text: "🧠 Neural scan shows stability." },
      { side: "right", text: "All good! No signs of imbalance." },
    ],
    nwidth: "300px",
    mwidth: "200px",
  },
  {
    id: 3,
    name: "Lungs",
    image: "/images/lungs_model.png",
    chats: [
      { side: "left", text: "🌬️ Oxygen levels optimal." },
      { side: "right", text: "Breathing pattern looks healthy!" },
    ],
    nwidth: "300px",
    mwidth: "200px",
  },
  {
    id: 4,
    name: "Stomach",
    image: "/images/stomach_model.png",
    chats: [
      { side: "left", text: "🍽 Digestive rhythm normal." },
      { side: "right", text: "No inflammation detected." },
    ],
    nwidth: "300px",
    mwidth: "200px",
  },
];

const features = [
  {
    title: "Multi-Language Support",
    desc: "Connect with healthcare professionals globally in your preferred language. We break barriers so your care is never lost in translation.",
    icon: "🌍",
  },
  {
    title: "Real-Time Chat & Video Calls",
    desc: "Instantly consult doctors through secure chat and HD video. MediKeep ensures access to care whenever you need it most.",
    icon: "💬",
  },
  {
    title: "AI-Driven Insights",
    desc: "Get personalized recommendations and early health warnings powered by advanced AI — your smart healthcare companion.",
    icon: "🤖",
  },
];

export { navlinks, organs, features };
