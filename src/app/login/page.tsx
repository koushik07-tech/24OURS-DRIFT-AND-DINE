"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ShieldCheck, Flag, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide your email and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success && res.user) {
      if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(res.error || "Invalid credentials. Please try again.");
    }
  };

  const handleDemoAccess = async (role: "USER" | "ADMIN") => {
    const demoEmail = role === "ADMIN" ? "admin@24ours.com" : "racer@24ours.com";
    const demoPass = role === "ADMIN" ? "AdminPassword123!" : "RacerPassword123!";
    setEmail(demoEmail);
    setPassword(demoPass);
    const res = await login(demoEmail, demoPass);
    if (res.success && res.user) {
      if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen subtle-grid flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-carbon-950 border border-white/15 shadow-card-elevated text-left space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold inline-block">
            Driver & Admin Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
            SIGN IN TO 24OURS.
          </h1>
          <p className="text-xs text-carbon-400 font-sans">
            Access your lap telemetry, QR passes, and priority reservations.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-brand-red/50 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Email or Phone</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="racer@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
              <Mail className="w-4 h-4 text-carbon-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
              <Lock className="w-4 h-4 text-carbon-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red"
            >
              {isLoading ? "Signing In..." : "SIGN IN"}
            </button>
          </div>
        </form>

        {/* 1-Click Demo Testing Shortcuts */}
        <div className="pt-4 border-t border-white/10 space-y-2.5">
          <p className="text-[10px] font-mono text-carbon-500 uppercase text-center">Fast Demo Testing (1-Click):</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoAccess("USER")}
              className="p-2.5 rounded-xl bg-carbon-900 border border-white/10 text-xs font-mono text-carbon-300 hover:text-white hover:border-brand-red transition-all"
            >
              👤 Demo Racer
            </button>
            <button
              type="button"
              onClick={() => handleDemoAccess("ADMIN")}
              className="p-2.5 rounded-xl bg-carbon-900 border border-white/10 text-xs font-mono text-amber-400 hover:text-white hover:border-amber-400 transition-all"
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-carbon-400 pt-2 font-mono">
          Don't have an account?{" "}
          <Link href="/signup" className="text-brand-red hover:underline font-bold">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
