import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navlinks } from "@/constants/landingPageConsts";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "@tanstack/react-router";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = {
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    profilePicture: "https://i.pravatar.cc/150?img=3",
  };

  return (
    <header
      className={`fixed ${isMenuOpen ? "max-md:bg-background/95" : ""
        } max-md:backdrop-blur-md top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-3 md:px-16" : "py-4 md:px-12"
        } px-4`}
    >
      <div className="flex items-center justify-between">
        <button
          className="flex items-center cursor-pointer z-3"
          onClick={() => navigate({ to: "/" })}
        >
          <img
            src="https://res.cloudinary.com/avhixorin/image/upload/f_auto/v1724770946/Logo_kletrg.png"
            alt="MediKeep Logo"
            className="h-6 md:h-8"
          />
        </button>

        {!isMobile && (
          <>
            <motion.div
              initial={false}
              animate={{
                width: scrolled ? "96%" : "20%",
                borderRadius: scrolled ? "2rem" : "9999px",
                borderWidth: scrolled ? "1px" : "1.5px",
                padding: scrolled ? "1.5rem 1.5rem" : "1.2rem 1.75rem",
                boxShadow: scrolled
                  ? "0 2px 12px rgba(0,0,0,0.05)"
                  : "0 8px 30px rgba(0,0,0,0.08)",
                backgroundColor: scrolled
                  ? "hsl(var(--background) / 0.85)"
                  : "hsl(var(--background) / 0.7)",
                backdropFilter: scrolled ? "blur(5px)" : "blur(20px)",
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 26,
                mass: 0.7,
              }}
              className={`absolute left-1/2 -translate-x-1/2 z-1 border border-border backdrop-blur-lg transition-colors duration-300`}
            />

            <motion.nav className="absolute left-1/2 -translate-x-1/2 z-2 flex justify-center items-center">
              <ul className="hidden md:flex items-center text-foreground/80! space-x-8 font-medium">
                {navlinks.map((item) => (
                  <motion.li
                    key={item.name}
                    className="relative group cursor-pointer"
                  >
                    <a
                      href={item.link}
                      className="hover:text-primary! transition-colors duration-300"
                    >
                      {item.name}
                    </a>
                    <motion.div className="absolute left-0 bottom-0 w-full h-[0.1rem] bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            <div className="flex items-center gap-4 z-2">
              {/* {user ? ( */}
              <button
                className="cursor-pointer"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage
                    src={user.profilePicture}
                    alt={user.username}
                  />
                  <AvatarFallback className="text-foreground rounded-full">
                    {user.firstName[0].toUpperCase()}
                    {user.lastName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
              {/* ) : (
                <Button
                  variant={"ghost"}
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 hover:shadow-lg transition-all duration-200 hover:text-white"
                  onClick={() => navigate("/register")}
                >
                  Get Started{" "}
                  <ArrowRight className="h-4 w-4 hover:translate-x-1 transition-transform duration-200" />
                </Button>
              )} */}
            </div>
          </>
        )}

        {isMobile && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-border/40 md:hidden shadow-lg isolate"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <nav className="flex flex-col p-4">
              {navlinks.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="border-t border-border/40 mt-4 pt-4 flex items-center justify-between">
                {/* {user ? ( */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 w-full justify-start"
                  onClick={() => {
                    navigate({ to: "/dashboard" });
                    setIsMenuOpen(false);
                  }}
                >
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      src={user.profilePicture}
                      alt={user.username}
                    />
                    <AvatarFallback className="text-foreground rounded-full">
                      {user.firstName[0].toUpperCase()}
                      {user.lastName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {user.firstName || "Profile"}
                  </span>
                </Button>
                {/* ) : (
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                  >
                    Log in
                  </Button>
                )} */}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
