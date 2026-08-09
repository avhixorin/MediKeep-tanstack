import Iridescence from "#/components/Iridescence";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, FileText, HeartIcon, Send } from "lucide-react";
import { useState, useRef } from "react";
import Typewriter from "typewriter-effect";

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (asked) return navigate({ to: "/auth/register" });
    if (!query.trim()) return;

    // Trigger your transition or logic here
    setAsked(true);
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen pt-16 px-6 md:px-12 lg:px-16 overflow-hidden bg-transparent font-sans">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Iridescence
          speed={1}
          amplitude={0.1}
          mouseReact
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl">
        <div
          className="group flex items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-2 shadow-sm mb-10 transition-all hover:shadow-md cursor-pointer"
          onClick={() => navigate({ to: "/auth/register" })}
        >
          <HeartIcon className="size-4 text-rose-500" fill="red" />
          <span className="text-xs md:text-sm font-medium text-foreground/80">
            AI Driven Healthcare Platform
          </span>
          <div className="h-4 w-px bg-foreground/40 mx-1" />
          <span className="flex items-center text-xs md:text-sm font-medium text-rose-500">
            Try it now
            <ChevronRight className="ml-0.5 size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-tight text-foreground mb-6 leading-tight">
          Transforming{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-rose-500">Healthcare</span>
          </span>{" "}
          <br className="hidden md:block" />
          with Intelligence
        </h1>

        <p className="mt-2 max-w-2xl text-base md:text-lg text-foreground/60 font-normal leading-relaxed mb-12">
          MediKeep integrates advanced AI insights into modern healthcare, delivering personalized, data-driven care and seamless document analysis in real time.
        </p>

        <div className="relative w-full max-w-2xl">
          <form
            onSubmit={handleQuery}
            className="relative flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-2 z-20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="pl-4 pr-3 flex items-center justify-center text-rose-400">
              <FileText className="size-5" />
            </div>

            <div className="relative flex-1 h-12 flex items-center">
              {query === "" && (
                <div className="absolute inset-0 flex items-center text-gray-400 text-sm md:text-base pointer-events-none select-none">
                  <Typewriter
                    options={{
                      strings: [
                        "Analyze my latest blood test report...",
                        "Extract details from this prescription...",
                        "Summarize my patient history..."
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 45,
                      deleteSpeed: 20,
                    }}
                  />
                </div>
              )}

              <input
                ref={inputRef}
                type="text"
                className="w-full h-full bg-transparent outline-none text-gray-800 text-base z-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={!query.trim() && !asked}
              className="ml-2 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-6 py-3 transition-all duration-300 font-medium text-sm gap-2 disabled:opacity-50"
            >
              <span>{asked ? "Continue" : "Ask"}</span>
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;