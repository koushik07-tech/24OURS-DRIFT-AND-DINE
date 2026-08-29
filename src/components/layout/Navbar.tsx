"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, User, ShieldAlert, LogOut, LayoutDashboard } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { openBookingModal } = useBooking();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || pathname !== "/"
          ? "bg-brand-black/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl"
          : "bg-gradient-to-b from-brand-black/90 via-brand-black/40 to-transparent py-5 sm:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white font-display font-black text-xl shadow-glow-red group-hover:scale-105 transition-transform">
              24
            </div>
            <div className="text-left">
              <span className="text-base font-display font-black tracking-tight text-white block leading-none">
                24OURS
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-brand-red font-bold uppercase block">
                DRIFT AND DINE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 px-3 py-1.5 rounded-full bg-carbon-900/80 border border-white/10 backdrop-blur-md">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full text-carbon-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Action Hook (No Pricing) */}
            <button
              onClick={() => openBookingModal()}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK NOW</span>
            </button>

            {/* Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-carbon-850 border border-white/10 text-xs font-mono text-white hover:border-brand-red transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="max-w-[90px] truncate">{user?.name || "Driver"}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-carbon-900 border border-white/15 shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-white/10 text-[11px] font-mono text-carbon-400">
                      Logged in: <span className="text-white block truncate">{user?.email}</span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-carbon-200 hover:text-white hover:bg-white/10"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-brand-red" />
                      My Telemetry
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-amber-400 hover:bg-white/10"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Admin Console
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-mono text-red-400 hover:bg-white/10 border-t border-white/5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon-850 border border-white/10 text-xs font-mono text-carbon-300 hover:text-white hover:border-brand-red transition-all"
              >
                <User className="w-3.5 h-3.5 text-brand-red" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg bg-carbon-850 border border-white/10 text-carbon-200 hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-black/98 border-b border-white/15 backdrop-blur-2xl px-4 pt-4 pb-8 space-y-4 animate-fadeIn">
          <nav className="flex flex-col space-y-1">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-heading font-semibold uppercase tracking-wider text-carbon-200 hover:text-white hover:bg-carbon-850"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full py-3 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider shadow-glow-red"
            >
              BOOK NOW
            </button>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-carbon-850 border border-white/10 text-white font-mono text-xs font-bold uppercase text-center"
            >
              Driver Login / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
