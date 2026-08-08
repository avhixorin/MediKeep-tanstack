import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "#/hooks/useAuth";

export const Route = createFileRoute("/auth/login/")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values);
      navigate({ to: "/dashboard" });
    } catch {
      // useAuth already handles the error toast
    }
    setLoading(false);
  };

  return (
    <div className="grid-cols-1 grid lg:grid-cols-2 min-h-dvh bg-linear-to-br from-blue-100 via-teal-50 to-yellow-100 text-gray-900 overflow-hidden">
      <div className="flex items-center justify-center col-span-1 p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-110 bg-white/50 backdrop-blur-2xl border border-white/60 p-8 sm:p-10 rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]">

          <div className="w-full mb-8 flex flex-col items-center justify-center gap-2">
            <h1 className="text-3xl font-bold text-center tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-600 text-center">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex gap-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder="johndoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/80 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-300 h-11"
              />
            </div>

            <div className="w-full relative space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex gap-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/80 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-300 h-11 pr-12"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Eye size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EyeOff size={20} />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full pb-2">
              <span
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                onClick={() => navigate({ to: "/auth/forgot-password" })}
              >
                Forgot Password?
              </span>
            </div>

            <Button
              className={`w-full h-11 text-base font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-md ${loading ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                }`}
              type="submit"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit({ email: email, password: password });
              }}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={"/auth/register"}
              className="font-semibold text-gray-900 hover:underline underline-offset-4 transition-all"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center w-full h-full relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-112.5 h-112.5 bg-white/60 blur-[100px] rounded-full pointer-events-none" />

        <img
          className="h-[75%] w-[75%] object-contain relative z-10 drop-shadow-2xl"
          draggable={false}
          src="https://res.cloudinary.com/avhixorin/image/upload/f_auto/v1724779943/Account3DAnimatedIcon-ezgif.com-crop_1_xivavn.gif"
          alt="3D Account Animation"
        />
      </div>
    </div>
  );
}

export default LoginPage;