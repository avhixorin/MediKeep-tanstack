import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks';

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
});

type Step = 'email' | 'otp' | 'newPassword' | 'success';

function ForgotPasswordPage() {
  const { forgotPassword, resetPassword } = useAuth();
  
  const [step, setStep] = useState<Step>('email');
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 'email':
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        break;
        
      case 'otp':
        if (!formData.otp) {
          newErrors.otp = 'OTP is required';
        } else if (formData.otp.length !== 6) {
          newErrors.otp = 'OTP must be 6 digits';
        }
        break;
        
      case 'newPassword':
        if (!formData.newPassword) {
          newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
          newErrors.newPassword = 'Password must be at least 8 characters';
        }
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitEmail = async () => {
    if (!validateStep()) return;
    
    forgotPassword({ email: formData.email }, {
      onSuccess: () => {
        setStep('otp');
      },
    });
  };

  const handleVerifyOTP = () => {
    if (!validateStep()) return;
    setStep('newPassword');
  };

  const handleResetPassword = async () => {
    if (!validateStep()) return;
    
    resetPassword({
      email: formData.email,
      otp: formData.otp,
      newPassword: formData.newPassword,
    }, {
      onSuccess: () => {
        setStep('success');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 via-teal-50 to-yellow-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              {step === 'success' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Lock className="h-8 w-8 text-primary-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {step === 'email' && 'Forgot Password?'}
              {step === 'otp' && 'Enter Verification Code'}
              {step === 'newPassword' && 'Create New Password'}
              {step === 'success' && 'Password Reset!'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {step === 'email' && "Enter your email and we'll send you a verification code"}
              {step === 'otp' && `We've sent a 6-digit code to ${formData.email}`}
              {step === 'newPassword' && 'Enter your new password below'}
              {step === 'success' && 'Your password has been successfully reset'}
            </p>
          </div>

          <div className="space-y-6">
            {step === 'email' && (
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {step === 'otp' && (
              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                />
                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
                  Didn't receive the code?{' '}
                  <button 
                    onClick={() => forgotPassword({ email: formData.email })}
                    className="text-primary-600 hover:underline font-medium"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}

            {step === 'newPassword' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="Create a strong password"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  You can now sign in with your new password.
                </p>
                <Link to="/auth/login">
                  <Button className="w-full">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {step !== 'success' && (
              <Button
                onClick={
                  step === 'email' ? handleSubmitEmail :
                  step === 'otp' ? handleVerifyOTP :
                  handleResetPassword
                }
                className="w-full"
              >
                {step === 'email' && 'Send Code'}
                {step === 'otp' && 'Verify Code'}
                {step === 'newPassword' && 'Reset Password'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {step !== 'success' && (
            <div className="mt-6 text-center">
              <Link
                to="/auth/login"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
