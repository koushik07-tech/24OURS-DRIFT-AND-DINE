"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User as UserIcon, AtSign, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }

    if (!trimmedUsername || trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      setError("Username can only contain letters, numbers, underscores, and hyphens.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name: trimmedName,
        username: trimmedUsername,
        email: trimmedEmail,
        password,
        confirmPassword,
      });

      if (res.success) {
        router.push("/login?registered=true");
      } else {
        setError(res.error || "Failed to create account. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isLoading || isSubmitting;

  return (
    <div className="min-h-screen w-full bg-brand-black subtle-grid flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-brand-red selection:text-white">
      {/* Ambient background motorsport red accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] sm:w-[48rem] h-[24rem] bg-brand-red/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-brand-redDark/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Centered Authentication Card */}
      <div className="relative z-10 w-full max-w-md my-8">
        
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-white font-display font-black text-2xl shadow-glow-red tracking-tighter">
              24
            </div>
            <div className="text-left">
              <span className="text-2xl font-display font-black tracking-tight text-white block leading-none">
                24OURS
              </span>
              <span className="text-[10px] font-mono tracking-[0.25em] text-brand-red font-bold uppercase block mt-0.5">
                DRIFT & DINE
              </span>
            </div>
          </div>

          <div className="pt-1">
            <h1 className="text-lg font-display font-bold text-white uppercase tracking-wider">
              Driver Registration
            </h1>
            <p className="text-xs text-carbon-400 font-mono mt-0.5">
              Create an account to reserve experiences and track lap telemetry
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="p-7 sm:p-9 rounded-3xl bg-carbon-950/95 border border-white/15 shadow-2xl backdrop-blur-2xl text-left space-y-5">
          
          {/* Error Message Box */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-brand-red/60 text-red-200 text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono text-carbon-300 uppercase mb-1 font-semibold">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Rahul Sharma"
                  disabled={isBusy}
                  className="w-full pl-10 pr-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:opacity-50 transition-all font-sans placeholder:text-carbon-600"
                />
                <UserIcon className="w-4 h-4 text-carbon-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-300 uppercase mb-1 font-semibold">
                Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="rahul_drift"
                  disabled={isBusy}
                  className="w-full pl-10 pr-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:opacity-50 transition-all font-sans placeholder:text-carbon-600"
                />
                <AtSign className="w-4 h-4 text-carbon-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-300 uppercase mb-1 font-semibold">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="rahul@example.com"
                  disabled={isBusy}
                  className="w-full pl-10 pr-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:opacity-50 transition-all font-sans placeholder:text-carbon-600"
                />
                <Mail className="w-4 h-4 text-carbon-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-300 uppercase mb-1 font-semibold">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Min 6 characters"
                  disabled={isBusy}
                  className="w-full pl-10 pr-10 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:opacity-50 transition-all font-sans placeholder:text-carbon-600"
                />
                <Lock className="w-4 h-4 text-carbon-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-3 text-carbon-500 hover:text-carbon-300 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-300 uppercase mb-1 font-semibold">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Re-enter password"
                  disabled={isBusy}
                  className="w-full pl-10 pr-10 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:opacity-50 transition-all font-sans placeholder:text-carbon-600"
                />
                <Lock className="w-4 h-4 text-carbon-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-3 text-carbon-500 hover:text-carbon-300 focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isBusy}
                className="w-full py-3.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CREATING ACCOUNT...</span>
                  </>
                ) : (
                  <span>CREATE ACCOUNT</span>
                )}
              </button>
            </div>
          </form>

          {/* Already have an account */}
          <div className="text-center text-xs text-carbon-400 pt-3 border-t border-white/10 font-mono">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-red hover:underline font-bold transition-colors">
              Sign In
            </Link>
          </div>

        </div>

        {/* Security badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[11px] font-mono text-carbon-500">
          <ShieldCheck className="w-3.5 h-3.5 text-carbon-500" />
          <span>Encrypted Session Protection • 24OURS</span>
        </div>

      </div>
    </div>
  );
}

