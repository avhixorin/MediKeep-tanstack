import { Shield } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import type { RegistrationFormData } from "#/types";
import { useAuth } from "#/hooks/useAuth";
import { otpSchema } from "#/schemas/registration.schema";

const OtpStep = ({
    form,
    setStep
}: {
    form: RegistrationFormData;
    setStep: (step: 'type' | 'personal' | 'security' | 'otp' | 'profile') => void
}) => {
    const [otp, setOtp] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const { register } = useAuth();

    const handleCreateAccount = async () => {
        try {
            await register(form);
            setStep("profile");
        } catch {
            // useAuth already handles the error toast
        }
    };

    const handleVerifyOtp = async () => {
        setOtpError(null);

        const result = otpSchema.safeParse({ otp });

        if (!result.success) {
            setOtpError(result.error.flatten().fieldErrors.otp?.[0] ?? null);
            return;
        }

        const success = await verifyOtp();

        if (success) {
            setIsOtpVerified(true);
        } else {
            setOtpError("Invalid OTP");
        }
    };

    const verifyOtp = async (): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return otp === "123456";
    }
    return (
        <div className="space-y-6 text-center py-6">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verify Email</h2>
            <p className="text-slate-500">We've sent a 6-digit code to 
                <span className="font-semibold text-slate-800">
                    {" "}{form.email || "your email"}
                </span>
            </p>
            <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className={`text-center text-3xl tracking-[1em] h-16 bg-slate-50 mt-6 ${otpError
                    ? "border-red-400 focus-visible:ring-red-500"
                    : "border-slate-200"
                    }`}
                maxLength={6}
            />
            {otpError && (
                <p className="text-sm text-red-500">
                    {otpError}
                </p>
            )}
            {!isOtpVerified ? (
                <Button
                    onClick={handleVerifyOtp}
                >
                    Verify OTP
                </Button>
            ) : (
                <Button
                    onClick={handleCreateAccount}
                >
                    Create Account
                </Button>
            )}
        </div>
    )
}

export default OtpStep