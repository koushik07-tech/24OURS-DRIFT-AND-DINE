"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, User, ShieldAlert, LogOut, LayoutDashboard, Volume2, VolumeX, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { soundEngine } from "@/lib/soundEngine";

export default function Navbar() {
  const pathname = usePathname();
  const { openBookingModal } = useBooking();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playClick(650);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Floating Pill Navigation Container */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex items-center justify-between px-3.5 sm:px-5 py-2.5 rounded-full transition-all duration-300 liquid-glass"
        >
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={() => soundEngine.playClick(500)}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FF5A36] via-[#ff3b14] to-red-700 flex items-center justify-center text-white font-display font-black text-lg sm:text-xl shadow-[0_0_20px_rgba(255,90,54,0.6)] group-hover:scale-105 transition-transform border border-red-400/40">
              24
            </div>
            <div className="text-left">
              <span className="text-sm sm:text-base font-display font-black tracking-tight text-white block leading-none drop-shadow-md">
                24OURS
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.24em] text-[#FF5A36] font-bold uppercase block mt-0.5">
                DRIFT &amp; DINE
              </span>
            </div>
          </Link>

          {/* Center Desktop Floating Nav Pill Links */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 border border-white/5 backdrop-blur-md relative"
          >
            {siteConfig.navLinks.map((link) => {
              const isHovered = hoveredNav === link.name;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => {
                    setHoveredNav(link.name);
                    soundEngine.playHover();
                  }}
                  onClick={() => soundEngine.playClick(600)}
                  className="relative px-3.5 py-1 text-xs font-mono uppercase tracking-wider rounded-full text-zinc-300 hover:text-white transition-colors z-10"
                >
                  {isHovered && (
                    <motion.span
                      layoutId="navHoverPill"
                      className="absolute inset-0 bg-white/10 border border-white/15 rounded-full -z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:border-[#FF5A36]/50 transition-all"
              title="Toggle sound effects"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#FF5A36] animate-pulse" />
              )}
              <span className="text-[10px] uppercase text-zinc-300 hidden xl:inline">
                {isMuted ? "MUTED" : "AUDIO"}
              </span>
            </button>

            {/* Quick Action Book Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                soundEngine.playClick(600);
                openBookingModal();
              }}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#FF5A36] to-[#ff3b14] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(255,90,54,0.5)] hover:shadow-[0_0_35px_rgba(255,90,54,0.7)] transition-all border border-red-400/40"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK NOW</span>
            </motion.button>

            {/* Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    soundEngine.playClick(500);
                    setUserDropdownOpen(!userDropdownOpen);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-carbon-900/80 border border-white/10 text-xs font-mono text-white hover:border-brand-crimson transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="max-w-[85px] truncate">{user?.name || "Driver"}</span>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl bg-carbon-900/95 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-white/10 text-[11px] font-mono text-carbon-400">
                        Logged in: <span className="text-white block truncate">{user?.email}</span>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => {
                          soundEngine.playClick(600);
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-carbon-200 hover:text-white hover:bg-white/10"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-brand-crimson" />
                        My Telemetry
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => {
                            soundEngine.playClick(600);
                            setUserDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-amber-400 hover:bg-white/10"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          soundEngine.playClick(400);
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-mono text-red-400 hover:bg-white/10 border-t border-white/5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => soundEngine.playClick(600)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-carbon-900/80 border border-white/10 text-xs font-mono text-carbon-300 hover:text-white hover:border-brand-crimson transition-all"
              >
                <User className="w-3.5 h-3.5 text-brand-crimson" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                soundEngine.playClick(500);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-full bg-carbon-900 border border-white/10 text-carbon-200 hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden mt-2 mx-auto max-w-lg bg-[#08080c]/98 border border-white/15 rounded-3xl backdrop-blur-2xl p-5 space-y-4 shadow-2xl pointer-events-auto"
          >
            <nav className="flex flex-col space-y-1">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    soundEngine.playClick(600);
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-carbon-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  soundEngine.playClick(600);
                  setMobileMenuOpen(false);
                  openBookingModal();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-crimson to-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-glow-red"
              >
                BOOK NOW
              </button>
              {isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => {
                      soundEngine.playClick(600);
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 text-center rounded-xl bg-carbon-850 border border-white/10 text-white font-mono text-xs font-bold uppercase"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      soundEngine.playClick(400);
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-2.5 text-center rounded-xl bg-carbon-850 border border-white/10 text-red-400 font-mono text-xs font-bold uppercase"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => {
                    soundEngine.playClick(600);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-carbon-850 border border-white/10 text-white font-mono text-xs font-bold uppercase text-center"
                >
                  Driver Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
