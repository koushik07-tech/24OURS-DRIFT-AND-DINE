"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, User as UserIcon, LogOut, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { openBookingModal } = useBooking();
  const { user, isAuthenticated, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      window.location.replace("/login");
    }
  };

  // Standalone auth pages do not render website navbar
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled || pathname !== "/"
            ? "bg-brand-black/95 backdrop-blur-xl border-b border-white/10 py-2.5 sm:py-3 shadow-2xl"
            : "bg-gradient-to-b from-brand-black/95 via-brand-black/50 to-transparent py-3.5 sm:py-4.5"
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            
            {/* Zone 1: 24OURS Brand Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-red flex items-center justify-center text-white font-display font-black text-lg sm:text-xl shadow-glow-red group-hover:scale-105 transition-transform">
                24
              </div>
              <div className="text-left hidden xs:block sm:block">
                <span className="text-sm sm:text-base font-display font-black tracking-tight text-white block leading-none">
                  24OURS
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.2em] text-brand-red font-bold uppercase block mt-0.5">
                  DRIFT AND DINE
                </span>
              </div>
            </Link>

            {/* Zone 2: Desktop Navigation Links — 11 Standard Sections */}
            <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 px-2.5 2xl:px-3.5 py-1.5 rounded-full bg-carbon-900/80 border border-white/10 backdrop-blur-md shrink min-w-0">
              {siteConfig.navLinks.map((link) => (
                <a
                  key={link.name}
                  href={pathname === "/" ? link.href : `/${link.href}`}
                  className="px-2 2xl:px-2.5 py-1 text-[10px] 2xl:text-xs font-mono uppercase tracking-wider rounded-full text-carbon-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Zone 3: Right Actions — User Account / Sign Out / Book Now / Mobile Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
              {isAuthenticated ? (
                <>
                  {/* Account / Dashboard Badge */}
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-carbon-900 border border-white/15 text-white text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider hover:border-brand-red hover:bg-carbon-850 transition-all shadow-sm shrink-0"
                    title="Driver Account & Passes"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span className="max-w-[70px] sm:max-w-[90px] md:max-w-[110px] truncate">
                      {user?.name ? user.name.split(" ")[0] : user?.username || "Driver"}
                    </span>
                  </Link>

                  {/* Fully Visible Navbar Logout Button */}
                  <button
                    id="navbar-logout-btn"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-red-950/50 border border-brand-red/40 text-red-300 hover:text-white hover:bg-brand-red hover:border-brand-red text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 shadow-sm shrink-0"
                    title="Log Out of Account"
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-brand-red" />
                        <span className="inline">LOGGING OUT...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        <span className="inline">LOG OUT</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-carbon-900 border border-white/15 text-carbon-200 hover:text-white hover:border-brand-red text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0"
                  title="Sign In to 24OURS"
                >
                  <UserIcon className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>SIGN IN</span>
                </Link>
              )}

              {/* BOOK NOW Action */}
              <button
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-brand-red text-white text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red transition-all cursor-pointer shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline sm:inline">BOOK NOW</span>
              </button>

              {/* Mobile / Tablet Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-1.5 sm:p-2 rounded-xl bg-carbon-850 border border-white/10 text-carbon-200 hover:text-white focus:outline-none transition-colors shrink-0"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-brand-black/98 border-b border-white/15 backdrop-blur-2xl px-4 pt-4 pb-8 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl animate-fadeIn">
          <nav className="flex flex-col space-y-1">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.name}
                href={pathname === "/" ? link.href : `/${link.href}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider text-carbon-200 hover:text-white hover:bg-carbon-850 transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            {isAuthenticated ? (
              <div className="pt-2 border-t border-white/10 space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-carbon-850 transition-colors flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-brand-red" />
                  <span>Account & Digital Passes ({user?.name ? user.name.split(" ")[0] : "Driver"})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-red-400 hover:text-white hover:bg-brand-red/20 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 text-brand-red animate-spin" />
                      <span>LOGGING OUT...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>LOG OUT</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/10">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider text-carbon-200 hover:text-white hover:bg-carbon-850 transition-colors flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-brand-red" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </nav>

          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full py-3 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider shadow-glow-red flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK NOW</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
