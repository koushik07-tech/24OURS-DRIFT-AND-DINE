"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, CheckSquare, Square, Flag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    const res = await register({ name, email, phone, password });
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Failed to create account.");
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen subtle-grid flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-carbon-950 border border-white/15 shadow-card-elevated text-left space-y-6">
        
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold inline-block">
            Driver Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
            CREATE ACCOUNT.
          </h1>
          <p className="text-xs text-carbon-400 font-sans">
            Register to record personal lap times and reserve digital destination passes.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-brand-red/50 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Sharma"
              className="w-full px-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@example.com"
              className="w-full px-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Mobile Phone *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="pt-1 flex items-start gap-2">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className="mt-0.5 text-brand-red focus:outline-none"
            >
              {agreed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-carbon-500" />}
            </button>
            <span className="text-[11px] text-carbon-400 font-mono leading-tight">
              I agree to the <Link href="/terms" className="text-white underline">Terms of Service</Link> and <Link href="/privacy" className="text-white underline">Privacy Policy</Link>.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red"
            >
              {isLoading ? "Creating..." : "CREATE ACCOUNT"}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-carbon-400 pt-2 font-mono">
          Already registered?{" "}
          <Link href="/login" className="text-brand-red hover:underline font-bold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
