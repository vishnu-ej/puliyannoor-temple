'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Send,
  Clock,
} from 'lucide-react';
import {
  generateAndSendOtp,
  verifyOtpCode,
  resetPasswordWithVerifiedOtp,
} from '../lib/supabaseDb';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    loginWithGoogle,
    startSignupStep1,
    sendOtp,
    verifyOtpAndRegister,
    pendingSignupData,
    redirectAfterAuth,
  } = useAuth();

  const { language } = useLanguage();
  const router = useRouter();

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginGeneralError, setLoginGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Signup Step 1 Form State
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupStep1Error, setSignupStep1Error] = useState('');

  // Signup Step 2 Form State
  const [signupName, setSignupName] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCountryCode, setSignupCountryCode] = useState('+91');
  const [signupPlace, setSignupPlace] = useState('');
  const [signupStar, setSignupStar] = useState('Ashwathi (അശ്വതി)');
  const [otpCode, setOtpCode] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [signupStep2Error, setSignupStep2Error] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Devotee Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [forgotShowPass, setForgotShowPass] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp_pass'>('email');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isSendingDevoteeOtp, setIsSendingDevoteeOtp] = useState(false);
  const [forgotDevoteeTimer, setForgotDevoteeTimer] = useState(0);

  // Reset errors when modal opens or tab changes
  useEffect(() => {
    setLoginEmailError('');
    setLoginGeneralError('');
    setSignupStep1Error('');
    setSignupStep2Error('');
    setForgotError('');
    setForgotSuccess('');
  }, [authModalTab, isAuthModalOpen]);

  // Handle countdown for devotee forgot password resend OTP
  useEffect(() => {
    if (forgotDevoteeTimer > 0) {
      const timer = setTimeout(() => setForgotDevoteeTimer(forgotDevoteeTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [forgotDevoteeTimer]);

  const handleSendDevoteeForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!isValidEmail(forgotEmail)) {
      setForgotError('Please enter a valid registered email address');
      return;
    }

    setIsSendingDevoteeOtp(true);
    const res = await generateAndSendOtp(forgotEmail, 'forgot_password');
    setIsSendingDevoteeOtp(false);

    if (res.success) {
      setForgotSuccess(res.message);
      setForgotStep('otp_pass');
      setForgotDevoteeTimer(60);
    } else {
      setForgotError('Failed to send OTP code. Please try again.');
    }
  };

  const handleResetDevoteePasswordWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotOtp.trim() || forgotOtp.trim().length !== 6) {
      setForgotError('Please enter the 6-digit OTP code sent to your email');
      return;
    }

    if (forgotNewPass !== forgotConfirmPass) {
      setForgotError('New password and confirm password do not match');
      return;
    }

    if (forgotNewPass.length < 6) {
      setForgotError('Password must be at least 6 characters long');
      return;
    }

    const verifyRes = verifyOtpCode(forgotEmail, forgotOtp);
    if (!verifyRes.success) {
      setForgotError(verifyRes.message || 'Invalid OTP code');
      return;
    }

    const resetRes = await resetPasswordWithVerifiedOtp(forgotEmail, forgotNewPass, false);
    if (resetRes.success) {
      setForgotSuccess(resetRes.message + ' You can now sign in with your new password.');
      setTimeout(() => {
        setAuthModalTab('login');
        setLoginEmail(forgotEmail);
        setForgotStep('email');
        setForgotOtp('');
        setForgotNewPass('');
        setForgotConfirmPass('');
      }, 2500);
    } else {
      setForgotError(resetRes.message);
    }
  };

  // Handle countdown for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // When opening step 2, trigger OTP send
  useEffect(() => {
    if (authModalTab === 'signup_step2' && pendingSignupData?.email) {
      sendOtp(pendingSignupData.email).then((res) => {
        if (res.message) {
          setOtpSentMessage(res.message);
          setResendTimer(45);
        }
      });
    }
  }, [authModalTab, pendingSignupData?.email]);

  if (!isAuthModalOpen) return null;

  // Validate Email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Handle Sign In Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginEmailError('');
    setLoginGeneralError('');

    if (!isValidEmail(loginEmail)) {
      setLoginEmailError('Enter a valid email inside the input tab');
      return;
    }

    if (!loginPassword) {
      setLoginGeneralError('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (res.success) {
      if (redirectAfterAuth) {
        router.push(redirectAfterAuth);
      } else {
        router.push('/profile');
      }
    } else {
      setLoginGeneralError(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    setIsSubmitting(false);
    if (res.success) {
      if (redirectAfterAuth) {
        router.push(redirectAfterAuth);
      } else {
        router.push('/profile');
      }
    }
  };

  // Handle Sign Up Step 1 Submit
  const handleSignupStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupStep1Error('');

    if (!isValidEmail(signupEmail)) {
      setSignupStep1Error('Enter a valid email inside the input tab');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupStep1Error('Password must be at least 6 characters long');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupStep1Error('Passwords do not match. Please re-enter.');
      return;
    }

    startSignupStep1(signupEmail, signupPassword);
  };

  // Handle Sign Up Step 2 Submit (Final Registration)
  const handleSignupStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupStep2Error('');

    if (!signupName.trim()) {
      setSignupStep2Error('Please enter your full name');
      return;
    }

    if (!signupPhone.trim()) {
      setSignupStep2Error('Please enter your contact phone number');
      return;
    }

    if (signupCountryCode === '+91' && signupPhone.trim().length !== 10) {
      setSignupStep2Error('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setSignupStep2Error('Please enter the 6-digit verification code sent to your email');
      return;
    }

    if (!privacyAgreed) {
      setSignupStep2Error('Please agree to the Privacy Policy & Devaswom Terms to proceed');
      return;
    }

    setIsSubmitting(true);
    const fullPhone = `${signupCountryCode} ${signupPhone.trim()}`;
    const res = await verifyOtpAndRegister(otpCode, {
      name: signupName,
      phone: fullPhone,
      dob: signupDob || undefined,
      place: signupPlace || 'Kerala, India',
      star: signupStar,
    });
    setIsSubmitting(false);

    if (res.success) {
      if (redirectAfterAuth) {
        router.push(redirectAfterAuth);
      } else {
        router.push('/profile');
      }
    } else {
      setSignupStep2Error(res.error || 'Verification failed. Please check OTP code.');
    }
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 bg-[#1A0409]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF5E8] rounded-3xl border-2 border-[#C99738] shadow-2xl max-w-md w-full p-5 sm:p-7 relative my-auto animate-scaleUp text-left"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-[#8C6219] hover:text-[#610C1B] p-1.5 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Branding */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#610C1B] to-[#38050E] border-2 border-[#C99738] text-[#E6BE65] font-cinzel font-bold text-xl flex items-center justify-center mx-auto mb-2 shadow-md">
            ॐ
          </div>
          <h2 className="font-cinzel font-bold text-lg sm:text-xl text-[#38050E]">
            {authModalTab === 'login' && 'Devotee Sign In'}
            {authModalTab === 'signup_step1' && 'Create Devotee Account'}
            {authModalTab === 'signup_step2' && 'Complete Profile & Verify'}
            {authModalTab === 'forgot_password' && 'Password Recovery (OTP)'}
          </h2>
          <p className="text-xs text-[#5A382A] mt-0.5">
            {authModalTab === 'login' && 'Access Vazhipadu bookings, history & direct temple chat'}
            {authModalTab === 'signup_step1' && 'Step 1 of 2: Set your login credentials'}
            {authModalTab === 'signup_step2' && 'Step 2 of 2: Personal details & email OTP confirmation'}
            {authModalTab === 'forgot_password' && 'Verify your registered email with a 6-digit OTP code to set a new password'}
          </p>
        </div>

        {/* ================================================================= */}
        {/* 1. SIGN IN INTERFACE */}
        {/* ================================================================= */}
        {authModalTab === 'login' && (
          <div className="space-y-4">
            {/* Google OAuth Quick Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-[#E4D5AE] text-xs font-bold text-[#38050E] flex items-center justify-center gap-2.5 shadow-xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px bg-[#E4D5AE] flex-1" />
              <span className="text-[10px] uppercase font-bold text-[#8C6219] tracking-wider">or email login</span>
              <div className="h-px bg-[#E4D5AE] flex-1" />
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginEmailError) setLoginEmailError('');
                    }}
                    placeholder="name@example.com"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 ${
                      loginEmailError
                        ? 'border-red-400 focus:ring-red-400 bg-red-50/50'
                        : 'border-[#E4D5AE] focus:ring-[#C99738]'
                    }`}
                    required
                  />
                </div>
                {loginEmailError && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{loginEmailError}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] font-cinzel">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setForgotStep('email');
                      setForgotError('');
                      setForgotSuccess('');
                      setAuthModalTab('forgot_password');
                    }}
                    className="text-[11px] font-bold text-[#610C1B] hover:text-[#8B1428] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={loginShowPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setLoginShowPassword(!loginShowPassword)}
                    className="absolute right-3 top-3 text-[#8C6219] hover:text-[#610C1B]"
                  >
                    {loginShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginGeneralError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{loginGeneralError}</span>
                </div>
              )}

              {/* Sign In CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Verifying...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4 text-[#E6BE65]" />
              </button>
            </form>

            {/* Switch to Sign Up */}
            <div className="text-center pt-3 border-t border-[#E4D5AE]/60 text-xs text-[#5A382A]">
              <span>New to Puliyannoor Temple Portal? </span>
              <button
                type="button"
                onClick={() => setAuthModalTab('signup_step1')}
                className="font-bold text-[#610C1B] hover:underline cursor-pointer ml-1"
              >
                Create an Account
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. SIGN UP - STEP 1 (Credentials) */}
        {/* ================================================================= */}
        {authModalTab === 'signup_step1' && (
          <div className="space-y-4">
            {/* Google OAuth Quick Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-[#E4D5AE] text-xs font-bold text-[#38050E] flex items-center justify-center gap-2.5 shadow-xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign Up with Google</span>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px bg-[#E4D5AE] flex-1" />
              <span className="text-[10px] uppercase font-bold text-[#8C6219] tracking-wider">or sign up with email</span>
              <div className="h-px bg-[#E4D5AE] flex-1" />
            </div>

            <form onSubmit={handleSignupStep1Submit} className="space-y-3.5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  Email ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={signupShowPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setSignupShowPassword(!signupShowPassword)}
                    className="absolute right-3 top-3 text-[#8C6219] hover:text-[#610C1B]"
                  >
                    {signupShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Re-enter Password Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  Re-enter Password *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={signupShowPassword ? 'text' : 'password'}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    required
                  />
                </div>
              </div>

              {signupStep1Error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{signupStep1Error}</span>
                </div>
              )}

              {/* Bottom Actions: Log In & Next */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalTab('login')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF5E8] border border-[#E4D5AE] text-xs font-bold text-[#5A382A] text-center transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E6BE65]" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. SIGN UP - STEP 2 (Details & Email OTP Verification) */}
        {/* ================================================================= */}
        {authModalTab === 'signup_step2' && (
          <form onSubmit={handleSignupStep2Submit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  required
                />
              </div>
            </div>

            {/* Email ID (Pre-entered & Locked) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] font-cinzel">
                  Email ID (Pre-entered)
                </label>
                <span className="text-[10px] text-gray-500 font-medium italic">Cannot be changed</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={pendingSignupData?.email || ''}
                  disabled
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 bg-gray-100 text-xs sm:text-sm text-gray-600 cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* DOB & Place (2 Cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  Date of Birth (DOB)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="date"
                    value={signupDob}
                    onChange={(e) => setSignupDob(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                  Place / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={signupPlace}
                    onChange={(e) => setSignupPlace(e.target.value)}
                    placeholder="e.g. Pala, Kottayam"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  />
                </div>
              </div>
            </div>

            {/* Birth Star (Nakshatram - Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                Birth Star (ജന്മനക്ഷത്രം - Optional)
              </label>
              <select
                value={signupStar}
                onChange={(e) => setSignupStar(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738] cursor-pointer"
              >
                <option value="">Select Birth Star (Optional - Can be edited later)</option>
                {[
                  'Ashwathi (അശ്വതി)', 'Bharani (ഭരണി)', 'Karthika (കാർത്തിക)', 'Rohini (രോഹിണി)',
                  'Makayiram (മകയിരം)', 'Thiruvathira (തിരുവാതിര)', 'Punartham (പുണർതം)', 'Pooyam (പൂയം)',
                  'Ayilyam (ആയില്യം)', 'Makam (മകം)', 'Pooram (പൂരം)', 'Uthram (ഉത്രം)',
                  'Atham (അത്തം)', 'Chithira (ചിത്തിര)', 'Chothi (ചോതി)', 'Visakham (വിശാഖം)',
                  'Anizham (അനിഴം)', 'Thrikketta (തൃക്കേട്ട)', 'Moolam (മൂലം)', 'Pooradam (പൂരാടം)',
                  'Uthrダム (ഉത്രാടം)', 'Thiruvonam (തിരുവോണം)', 'Avittom (അവിട്ടം)', 'Chathayam (ചതയം)',
                  'Poororuttathi (പൂരുരുട്ടാതി)', 'Uthrattathi (ഉത്രട്ടാതി)', 'Revathi (രേവതി)',
                ].map((star) => (
                  <option key={star} value={star}>
                    {star}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                Contact Phone Number *
              </label>
              <div className="flex gap-2">
                <select
                  value={signupCountryCode}
                  onChange={(e) => setSignupCountryCode(e.target.value)}
                  className="w-[96px] sm:w-[102px] flex-shrink-0 pl-2.5 pr-1 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs font-mono font-bold text-[#38050E]"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+971">+971 (UAE)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+65">+65 (SG)</option>
                  <option value="+966">+966 (SA)</option>
                </select>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder={signupCountryCode === '+91' ? '10-digit number' : 'Mobile number'}
                    maxLength={signupCountryCode === '+91' ? 10 : 15}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] font-mono focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email OTP Verification Field */}
            <div className="p-3 bg-white rounded-2xl border border-[#E4D5AE] space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] font-cinzel">
                  Email OTP Code *
                </label>
                {resendTimer > 0 ? (
                  <span className="text-[10px] text-gray-500 font-medium">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (pendingSignupData?.email) {
                        sendOtp(pendingSignupData.email);
                        setResendTimer(45);
                      }
                    }}
                    className="text-[10px] font-bold text-[#610C1B] hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP (Try: 123456)"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4D5AE] bg-[#FAF5E8]/40 text-center font-mono font-bold text-sm tracking-widest text-[#38050E] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                maxLength={6}
                required
              />

              {otpSentMessage && (
                <p className="text-[10px] text-[#1F4E34] font-medium leading-tight">
                  ✓ {otpSentMessage}
                </p>
              )}
            </div>

            {/* Privacy Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-[#5A382A] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#610C1B] border-[#C99738] focus:ring-[#610C1B] cursor-pointer"
                />
                <span className="leading-tight">
                  I agree to the <strong>Privacy Policy</strong> & <strong>Devaswom Terms</strong> for ritual bookings & correspondence.
                </span>
              </label>
            </div>

            {signupStep2Error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{signupStep2Error}</span>
              </div>
            )}

            {/* Bottom Actions: Back & Sign Up */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAuthModalTab('signup_step1')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF5E8] border border-[#E4D5AE] text-xs font-bold text-[#5A382A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E6BE65]" />
                <span>{isSubmitting ? 'Registering...' : 'Sign Up'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* 4. FORGOT PASSWORD (OTP VERIFICATION & RESET) INTERFACE */}
        {/* ================================================================= */}
        {authModalTab === 'forgot_password' && (
          <div className="space-y-4">
            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 'email' ? (
              <form onSubmit={handleSendDevoteeForgotOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="devotee@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('login')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF5E8] border border-[#E4D5AE] text-xs font-bold text-[#5A382A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingDevoteeOtp}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 disabled:opacity-75 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isSendingDevoteeOtp ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin text-[#E6BE65]" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Send 6-Digit OTP</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetDevoteePasswordWithOtp} className="space-y-3.5">
                {/* OTP Input */}
                <div className="p-3 bg-white rounded-2xl border border-[#E4D5AE] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] font-cinzel">
                      Enter 6-Digit OTP *
                    </label>
                    {forgotDevoteeTimer > 0 ? (
                      <span className="text-[10px] text-gray-500 font-medium">Resend in {forgotDevoteeTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendDevoteeForgotOtp}
                        className="text-[10px] font-bold text-[#610C1B] hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4D5AE] bg-[#FAF5E8]/40 text-center font-mono font-bold text-base tracking-widest text-[#38050E] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                  />
                  <span className="text-[10px] text-[#8C6219] block text-center">
                    Sent to: <strong>{forgotEmail}</strong>
                  </span>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={forgotShowPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                    <button
                      type="button"
                      onClick={() => setForgotShowPass(!forgotShowPass)}
                      className="absolute right-3 top-3 text-[#8C6219] hover:text-[#610C1B]"
                    >
                      {forgotShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6219] mb-1 font-cinzel">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C6219] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={forgotShowPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                      value={forgotConfirmPass}
                      onChange={(e) => setForgotConfirmPass(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E4D5AE] bg-white text-xs sm:text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF5E8] border border-[#E4D5AE] text-xs font-bold text-[#5A382A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E6BE65]" />
                    <span>Reset Password</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
