import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare } from "lucide-react";

const ContactUs = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_qy1d9d6",
        "template_p2xo9oe",
        {
          from_name: form.name,
          to_name: "avhixorin",
          from_email: form.email,
          to_email: "ay5497368@gmail.com",
          message: form.message,
        },
        "WXfxZnnOlNJxJqPdw"
      )
      .then(
        () => {
          setLoading(false);
          toast.success("Message sent successfully!");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          toast.error("Failed to send message");
        }
      );
  };

  return (
    <section
      id="contact"
      className="relative min-h-[90vh] flex justify-center items-center px-6 md:px-10 py-20 bg-linear-to-b from-[hsl(var(--background))] via-[hsl(var(--muted))] to-[hsl(var(--background))]"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl rounded-3xl overflow-hidden shadow-xl border border-border/40 backdrop-blur-md bg-[hsl(var(--background))]/70"
      >
        <div className="lg:w-1/2 w-full bg-[url('https://res.cloudinary.com/avhixorin/image/upload/v1737574912/Essential_-_Doctor_clinic_doctor_consultation_doctor_patient_discussion_bbjw4g.png')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-linear-to-t from-red-900/70 via-red-800/50 to-transparent" />
          <div className="absolute bottom-10 left-8 text-white space-y-3">
            <h3 className="text-2xl font-bold">MediKeep</h3>
            <p className="text-sm max-w-xs text-gray-200 leading-relaxed">
              Powered by intelligent care and modern technology, we make your
              healthcare journey seamless, personal, and human.
            </p>
            <div className="flex gap-3 mt-3">
              <a
                href="mailto:ay5497368@gmail.com"
                className="text-red-300 hover:text-white text-sm transition-all duration-200"
              >
                contact@medikeep.ai
              </a>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full p-8 md:p-12 bg-background/80">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Get in <span className="text-red-500">Touch</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Our team is always here to listen and help you out.
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="w-full py-3 pl-10 pr-4 bg-[hsl(var(--muted))]/30 border border-border/40 rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-red-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-muted-foreground h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full py-3 pl-10 pr-4 bg-[hsl(var(--muted))]/30 border border-border/40 rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-red-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 text-muted-foreground h-5 w-5" />
                <textarea
                  rows={4}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  className="w-full py-3 pl-10 pr-4 bg-[hsl(var(--muted))]/30 border border-border/40 rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-red-400 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition-all duration-300"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactUs;
