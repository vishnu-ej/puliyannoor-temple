'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Key,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Send,
  User,
} from 'lucide-react';
import {
  resetDevoteePasswordViaSupabase,
  generateAndSendOtp,
  verifyOtpCode,
  resetPasswordWithVerifiedOtp,
} from '../../../lib/supabaseDb';

function ChangePasswordContent() {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode = (searchParams.get('mode') as 'update' | 'reset') || 'update';
  const [activeMode, setActiveMode] = useState<'update' | 'reset'>(initialMode);

  // Direct Update State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // OTP Reset State
  const [otpEmail, setOtpEmail] = useState(currentUser?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [otpNewPass, setOtpNewPass] = useState('');
  const [otpConfirmPass, setOtpConfirmPass] = useState('');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Success Celebration & 5-Second Countdown Redirect State
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  // Keep email synced with user
  useEffect(() => {
    if (currentUser?.email) {
      setOtpEmail(currentUser.email);
    }
  }, [currentUser]);

  // Handle countdown for resending OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle 5-second automatic countdown and redirect upon success
  useEffect(() => {
    if (isSuccess) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        router.push('/profile');
      }
    }
  }, [isSuccess, countdown, router]);

  // 1. Handle Direct Password Update
  const handleDirectPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');

    if (newPassword.length < 6) {
      setUpdateError('Password must be at least 6 characters long / പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ വേണം');
      return;
    }

    if (newPassword !== confirmPassword) {
      setUpdateError('New password and confirm password do not match / നൽകിയ പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല');
      return;
    }

    setIsUpdating(true);
    const result = await resetDevoteePasswordViaSupabase(newPassword);
    setIsUpdating(false);

    if (result.success) {
      setSuccessMessage(result.message || 'Password updated successfully!');
      setIsSuccess(true);
      setCountdown(5);
    } else {
      setUpdateError(result.message || 'Failed to update password');
    }
  };

  // 2. Handle Send OTP for Reset
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setOtpSuccessMsg('');

    const targetEmail = otpEmail.trim() || currentUser?.email || '';
    if (!targetEmail || !targetEmail.includes('@')) {
      setOtpError('Please enter a valid registered email address');
      return;
    }

    setIsSendingOtp(true);
    const res = await generateAndSendOtp(targetEmail, 'forgot_password', currentUser?.name);
    setIsSendingOtp(false);

    if (res.success) {
      setOtpSuccessMsg(res.message);
      setOtpStep('verify');
      setResendTimer(60);
    } else {
      setOtpError('Failed to send OTP. Please try again.');
    }
  };

  // 3. Handle Verify OTP and Set New Password
  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setOtpSuccessMsg('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setOtpError('Please enter the 6-digit OTP verification code');
      return;
    }

    if (otpNewPass.length < 6) {
      setOtpError('Password must be at least 6 characters long / പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ വേണം');
      return;
    }

    if (otpNewPass !== otpConfirmPass) {
      setOtpError('New password and confirm password do not match / നൽകിയ പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല');
      return;
    }

    const targetEmail = otpEmail.trim() || currentUser?.email || '';

    setIsVerifyingOtp(true);
    const verifyRes = verifyOtpCode(targetEmail, otpCode);
    if (!verifyRes.success) {
      setIsVerifyingOtp(false);
      setOtpError(verifyRes.message || 'Invalid OTP code');
      return;
    }

    const resetRes = await resetPasswordWithVerifiedOtp(targetEmail, otpNewPass, false);
    setIsVerifyingOtp(false);

    if (resetRes.success) {
      setSuccessMessage(resetRes.message || 'Password reset successfully!');
      setIsSuccess(true);
      setCountdown(5);
    } else {
      setOtpError(resetRes.message || 'Failed to reset password');
    }
  };

  // Unauthenticated View
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#F3EBD7]">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border-2 border-[#C99738] shadow-xl space-y-5 animate-scaleUp">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#610C1B] to-[#38050E] border-2 border-[#C99738] text-[#E6BE65] font-cinzel font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
            ॐ
          </div>
          <div>
            <h2 className="font-cinzel font-bold text-xl text-[#38050E] mb-1.5">
              Devotee Authentication Required
            </h2>
            <p className="text-xs sm:text-sm text-[#5A382A] leading-relaxed">
              Please sign in to your Puliyannoor Temple account to manage your password and account security credentials.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => openAuthModal('login', '/profile/change-password')}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] text-[#FAF5E8] font-bold text-sm shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EBD7] py-10 md:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#610C1B] hover:text-[#8B1428] transition-colors py-1.5 px-3 rounded-xl bg-white/70 border border-[#E4D5AE] shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile (തിരികെ പ്രൊഫൈലിലേക്ക്)</span>
          </Link>
          <div className="flex items-center gap-1 text-[11px] text-[#8C6219] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Supabase Cloud Auth</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUCCESS CELEBRATION CARD WITH 5-SECOND COUNTDOWN REDIRECT     */}
        {/* ------------------------------------------------------------- */}
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-emerald-500 shadow-2xl text-center space-y-6 animate-scaleUp">
            {/* Animated Large Green Tick Icon */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 border-4 border-[#C99738] flex items-center justify-center text-white shadow-xl">
                <CheckCircle2 className="w-12 h-12 text-[#FAF5E8] stroke-[2.5]" />
              </div>
            </div>

            <div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                Update Successful
              </span>
              <h2 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#38050E]">
                Password Successfully Updated!
              </h2>
              <p className="text-sm font-semibold text-[#610C1B] mt-1 font-cinzel">
                പാസ്‌വേഡ് വിജയകരമായി മാറ്റി!
              </p>
              <p className="text-xs sm:text-sm text-[#5A382A] max-w-md mx-auto mt-2 leading-relaxed">
                {successMessage || 'Your new login credentials have been securely verified and saved to the database.'}
              </p>
            </div>

            {/* Countdown Banner */}
            <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#C99738]/50 space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#610C1B]">
                <Clock className="w-4 h-4 text-[#8C6219] animate-spin" />
                <span>Redirecting to Profile in {countdown} {countdown === 1 ? 'second' : 'seconds'}...</span>
              </div>
              {/* Progress bar counting down */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#610C1B] to-[#C99738] h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-[#8C6219] font-mono">
                Redirecting in {countdown}...
              </p>
            </div>

            {/* Instant Manual Redirect Button */}
            <div>
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 text-[#FAF5E8] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                Go to Profile Now (ഇപ്പോൾ പ്രൊഫൈലിലേക്ക് പോകുക)
              </button>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* PASSWORD FORM CARD (UPDATE / RESET TABS)                       */
          /* ------------------------------------------------------------- */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C99738] shadow-xl space-y-6">
            
            {/* Header Title */}
            <div className="text-center border-b border-[#E4D5AE] pb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#610C1B] to-[#38050E] border border-[#C99738] flex items-center justify-center text-[#E6BE65] font-cinzel font-bold text-xl mx-auto mb-2.5 shadow-md">
                <Key className="w-6 h-6 text-[#E6BE65]" />
              </div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-[#38050E]">
                Account Security & Password
              </h2>
              <p className="text-xs text-[#5A382A] mt-1">
                Manage your credentials for devotee account: <strong>{currentUser.email}</strong>
              </p>
            </div>

            {/* Tab Selector: Update vs Reset via OTP */}
            <div className="flex rounded-2xl bg-[#FAF5E8] p-1.5 border border-[#E4D5AE]">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('update');
                  setUpdateError('');
                  setOtpError('');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'update'
                    ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm'
                    : 'text-[#5A382A] hover:text-[#38050E]'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-[#E6BE65]" />
                <span>Update Password</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('reset');
                  setUpdateError('');
                  setOtpError('');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'reset'
                    ? 'bg-[#610C1B] text-[#FAF5E8] shadow-sm'
                    : 'text-[#5A382A] hover:text-[#38050E]'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#E6BE65]" />
                <span>Reset via Email OTP</span>
              </button>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* OPTION 1: DIRECT PASSWORD UPDATE FORM                       */}
            {/* ----------------------------------------------------------- */}
            {activeMode === 'update' && (
              <form onSubmit={handleDirectPasswordUpdate} className="space-y-4 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-[#FAF5E8]/60 border border-[#E4D5AE] text-xs text-[#5A382A] space-y-1">
                  <span className="font-bold text-[#38050E] block font-cinzel">Direct Update Mode</span>
                  <p>Enter your new password below. It will be updated instantly for your active session.</p>
                </div>

                {updateError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{updateError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                    New Password (പുതിയ പാസ്‌വേഡ്) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C6219] absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#8C6219] hover:text-[#610C1B] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                    Confirm New Password (പാസ്‌വേഡ് വീണ്ടും നൽകുക) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C6219] absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 disabled:opacity-75 text-[#FAF5E8] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUpdating ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin text-[#E6BE65]" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 text-[#E6BE65]" />
                        <span>Update Password Now</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ----------------------------------------------------------- */}
            {/* OPTION 2: RESET VIA EMAIL OTP (RESEND)                      */}
            {/* ----------------------------------------------------------- */}
            {activeMode === 'reset' && (
              <div className="space-y-4 animate-fadeIn">
                {otpStep === 'request' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-[#FAF5E8]/60 border border-[#E4D5AE] text-xs text-[#5A382A] space-y-1">
                      <span className="font-bold text-[#38050E] block font-cinzel">Email OTP Verification</span>
                      <p>
                        A secure 6-digit verification code will be dispatched to your registered email address via Resend.
                      </p>
                    </div>

                    {otpError && (
                      <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#8C6219] absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={otpEmail}
                          onChange={(e) => setOtpEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 disabled:opacity-75 text-[#FAF5E8] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSendingOtp ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin text-[#E6BE65]" />
                          <span>Dispatching OTP via Resend...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#E6BE65]" />
                          <span>Send 6-Digit Verification Code</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                    {otpSuccessMsg && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{otpSuccessMsg}</span>
                      </div>
                    )}

                    {otpError && (
                      <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] font-cinzel">
                          Enter 6-Digit OTP Code *
                        </label>
                        {resendTimer > 0 ? (
                          <span className="text-[11px] text-[#8C6219] font-mono">
                            Resend in {resendTimer}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-[11px] font-bold text-[#610C1B] hover:underline cursor-pointer"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full text-center tracking-[0.4em] font-mono text-xl py-2.5 rounded-xl border-2 border-[#C99738] bg-white text-[#38050E] font-bold focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                        New Password *
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={otpNewPass}
                        onChange={(e) => setOtpNewPass(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#610C1B] mb-1 font-cinzel">
                        Confirm New Password *
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={otpConfirmPass}
                        onChange={(e) => setOtpConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#C99738] bg-white text-sm text-[#2B150F] focus:outline-none focus:ring-2 focus:ring-[#C99738]"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setOtpStep('request')}
                        className="py-3 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifyingOtp}
                        className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#610C1B] to-[#8B1428] hover:brightness-110 disabled:opacity-75 text-[#FAF5E8] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isVerifyingOtp ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin text-[#E6BE65]" />
                            <span>Verifying & Updating...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#E6BE65]" />
                            <span>Verify OTP & Set Password</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#F3EBD7]">
          <div className="text-center font-cinzel font-bold text-[#610C1B]">
            Loading Security Portal...
          </div>
        </div>
      }
    >
      <ChangePasswordContent />
    </Suspense>
  );
}
