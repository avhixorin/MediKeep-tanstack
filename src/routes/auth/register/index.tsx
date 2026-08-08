import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoleSelectionStep from '#/components/auth/RoleSelectionStep';
import PersonalInfoStep from '#/components/auth/PersonalInfoStep';
import SecurityStep from '#/components/auth/SecurityStep';
import OtpStep from '#/components/auth/OtpStep';
import ProfileStep from '#/components/auth/ProfileStep';
import { UserRole } from '#/types';
import type { RegistrationFormData } from '#/types';
import { personalInfoSchema, securitySchema } from '#/schemas/registration.schema';


export const Route = createFileRoute('/auth/register/')({
  component: RegisterPage,
});

type Step = 'type' | 'personal' | 'security' | 'otp' | 'profile';

const SLIDESHOW_IMAGES = [
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1673958772332-ca01085725f8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2000&auto=format&fit=crop",
];

export type FormErrors = Record<string, string[] | null>;

function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('type');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [registerForm, setRegisterForm] = useState<RegistrationFormData>({
    role: UserRole.PATIENT,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    medicalLicenseNumber: "",
  });

  const [errors, setErrors] = useState<FormErrors | null>(null);

  const setValue = (
    field: keyof RegistrationFormData,
    value: string | UserRole
  ) => {
    setRegisterForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors?.[field]) {
      setErrors((prev) => {
        if (!prev) return null;

        const updated = { ...prev };
        delete updated[field];

        return Object.keys(updated).length > 0
          ? updated
          : null;
      });
    }
  };

  const stepOrder: Step[] = ['type', 'personal', 'security', 'otp', 'profile'];
  const currentStepIndex = stepOrder.indexOf(step);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % SLIDESHOW_IMAGES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    console.log("CONTINUE CLICKED");
    console.log("Current step:", step);
    console.log("Form:", registerForm);

    if (step === "personal") {
      console.log("ENTERED PERSONAL VALIDATION");

      const result = personalInfoSchema.safeParse(registerForm);

      console.log("ZOD RESULT:", result);

      if (!result.success) {
        console.log(
          "VALIDATION ERRORS:",
          result.error.flatten().fieldErrors
        );

        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      console.log("PERSONAL VALIDATION PASSED");

      setErrors(null);
    }

    if (step === "security") {
      console.log("ENTERED SECURITY VALIDATION");

      const result = securitySchema.safeParse(registerForm);

      console.log("ZOD RESULT:", result);

      if (!result.success) {
        console.log(
          "VALIDATION ERRORS:",
          result.error.flatten().fieldErrors
        );

        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      setErrors(null);
    }

    console.log("MOVING TO NEXT STEP");

    setStep(stepOrder[currentStepIndex + 1]);
  };

  const handleBack = () => {
    setStep(stepOrder[currentStepIndex - 1]);
  };

  const renderStepContent = () => {
    switch (step) {
      case "type":
        return <RoleSelectionStep form={registerForm} setValue={setValue} />;
      case 'personal': return <PersonalInfoStep form={registerForm} setValue={setValue} errors={errors} />;
      case 'security': return <SecurityStep form={registerForm} setValue={setValue} errors={errors} />;
      case 'otp':
        return <OtpStep form={registerForm} setStep={setStep} />;
      case 'profile':
        return <ProfileStep />;
    }
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-blue-100 via-teal-50 to-yellow-100">
      <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between overflow-hidden bg-indigo-950 p-14 text-white">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={SLIDESHOW_IMAGES[currentImageIndex]}
              alt="Medical Professionals and Patients"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-t from-indigo-950/90 via-indigo-900/40 to-indigo-950/60" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
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
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            className="absolute right-0 top-1/4 w-64 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-teal-400/20 flex items-center justify-center">
                <HeartPulse className="h-5 w-5 text-teal-300" />
              </div>
              <div>
                <div className="h-2 w-20 bg-white/40 rounded-full mb-2"></div>
                <div className="h-2 w-12 bg-white/20 rounded-full"></div>
              </div>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full mb-2"></div>
            <div className="h-2 w-4/5 bg-white/20 rounded-full"></div>
          </motion.div>

          <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight mt-12 mb-6 max-w-lg">
            Smarter health management starts here.
          </h1>
          <p className="text-lg text-indigo-200 font-medium max-w-md leading-relaxed">
            Join thousands of patients and doctors experiencing seamless healthcare records and communication.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex -space-x-3">
            <img className="w-10 h-10 rounded-full border-2 border-indigo-950" src="https://i.pravatar.cc/100?img=1" alt="User" />
            <img className="w-10 h-10 rounded-full border-2 border-indigo-950" src="https://i.pravatar.cc/100?img=2" alt="User" />
            <img className="w-10 h-10 rounded-full border-2 border-indigo-950" src="https://i.pravatar.cc/100?img=3" alt="User" />
          </div>
          <p className="text-sm font-medium text-indigo-200">Trusted by 10,000+ users</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-12 relative">
        <div className="w-full max-w-xl mx-auto">

          <div className="flex gap-2 mb-8">
            {stepOrder.slice(0, 4).map((s, i) => (
              <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-200">
                <motion.div
                  className={`h-full ${i < currentStepIndex ? 'bg-indigo-600' : i === currentStepIndex ? 'bg-indigo-400' : 'bg-transparent'}`}
                  initial={{ width: "0%" }}
                  animate={{ width: i <= currentStepIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            ))}
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex justify-between items-center pt-6 border-t border-slate-100">
              {step !== 'type' && step !== 'profile' ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  className='cursor-pointer'
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step !== 'otp' && step !== 'profile' && (
                <Button
                  type="button"
                  onClick={handleNext}
                  className='cursor-pointer'
                >
                  Continue
                </Button>
              )}

              {step === 'profile' && (
                <Button
                  type="button"
                  onClick={() => navigate({ to: '/dashboard' })}
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-all">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;