"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, UserCheck, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const registeredParam = searchParams.get("registered");

  const { login, isLoading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setError("Please enter your username or email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(trimmedIdentifier, password);
      if (res.success && res.user) {
        if (
          redirectParam &&
          redirectParam.startsWith("/") &&
          !redirectParam.startsWith("/login") &&
          !redirectParam.startsWith("/signup")
        ) {
          router.push(redirectParam);
        } else if (res.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
      } else {
        setError(res.error || "Invalid username or password.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please check your connection and try again.");
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
      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-3">
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

          <div className="pt-2">
            <h1 className="text-lg font-display font-bold text-white uppercase tracking-wider">
              Authentication Portal
            </h1>
            <p className="text-xs text-carbon-400 font-mono mt-0.5">
              Sign in with your registered username or email
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="p-8 sm:p-10 rounded-3xl bg-carbon-950/95 border border-white/15 shadow-2xl backdrop-blur-2xl text-left space-y-6">
          
          {/* Registration Success Banner */}
          {registeredParam === "true" && !error && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">Account created successfully. Please log in.</span>
            </div>
          )}

          {/* Error Message Box */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-brand-red/60 text-red-200 text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-carbon-300 uppercase mb-1.5 font-semibold">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="racer@24ours.com or username"
                  disabled={isBusy}
                  className="w-full pl-10 pr-4 py-3 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:opacity-50 transition-all font-sans placeholder:text-carbon-600"
                />
                <UserCheck className="w-4 h-4 text-carbon-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-300 uppercase mb-1.5 font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••"
                  disabled={isBusy}
                  className="w-full pl-10 pr-10 py-3 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red disabled:opacity-50 transition-all font-sans placeholder:text-carbon-600"
                />
                <Lock className="w-4 h-4 text-carbon-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-3.5 text-carbon-500 hover:text-carbon-300 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    <span>SIGNING IN...</span>
                  </>
                ) : (
                  <span>SIGN IN</span>
                )}
              </button>
            </div>
          </form>

          {/* Create Account Link */}
          <div className="text-center text-xs text-carbon-400 pt-3 border-t border-white/10 font-mono">
            Don't have an account?{" "}
            <Link href="/signup" className="text-brand-red hover:underline font-bold transition-colors">
              Create Account
            </Link>
          </div>

        </div>

        {/* Security badge note */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[11px] font-mono text-carbon-500">
          <ShieldCheck className="w-3.5 h-3.5 text-carbon-500" />
          <span>Encrypted Session Protection • 24OURS</span>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-black flex items-center justify-center text-white font-mono text-xs">
          <Loader2 className="w-6 h-6 text-brand-red animate-spin mr-2" />
          <span>Loading Authentication Portal...</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
