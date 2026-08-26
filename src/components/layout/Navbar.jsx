import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, User, LogOut, ShieldAlert, Sparkles, Calendar, LayoutDashboard } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onOpenJourneyModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Experiences", path: "/experiences" },
    { name: "Restaurant", path: "/restaurant" },
    { name: "Events", path: "/events" },
    { name: "Automotive", path: "/automotive" },
    { name: "Packages", path: "/packages" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || location.pathname !== '/'
          ? 'bg-brand-black/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-brand-black/90 via-brand-black/40 to-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" href="/" />
            <div className="hidden xl:block">
              <Badge variant="red" pulse={true} className="text-[10px] py-0.5 px-2">
                Chikkaballapura
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 px-3 py-1.5 rounded-full bg-carbon-900/80 border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-red text-white font-semibold shadow-glow-red'
                      : 'text-carbon-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Book Now Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/booking')}
              icon={Calendar}
              className="hidden sm:inline-flex text-xs font-bold tracking-wider shadow-glow-red"
            >
              BOOK NOW
            </Button>

            {/* Auth / Account Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-carbon-850 border border-white/10 text-xs font-mono text-white hover:border-brand-red transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-carbon-900 border border-white/15 shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-white/10 text-xs font-mono text-carbon-400">
                      Signed in as <span className="text-white block truncate">{user?.email}</span>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-carbon-200 hover:text-white hover:bg-white/10"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-red" />
                      My Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-amber-400 hover:bg-white/10"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-mono text-red-400 hover:bg-white/10 border-t border-white/5"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon-850 border border-white/10 text-xs font-mono text-carbon-300 hover:text-white hover:border-brand-red transition-all"
              >
                <User className="w-3.5 h-3.5 text-brand-red" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg bg-carbon-850 border border-white/10 text-carbon-200 hover:text-white hover:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-black/98 border-b border-white/15 backdrop-blur-2xl px-4 pt-4 pb-8 space-y-4 animate-fadeIn max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-mono text-carbon-400">Chikkaballapura, Karnataka</span>
            <Badge variant="red" pulse={true} className="text-[10px]">
              Destination Open
            </Badge>
          </div>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-3 rounded-lg text-sm font-heading font-semibold uppercase tracking-wider text-carbon-200 hover:text-white hover:bg-carbon-850/80 hover:border-l-2 hover:border-brand-red transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/booking')}
              icon={Calendar}
              className="w-full justify-center shadow-glow-red"
            >
              BOOK EXPERIENCES NOW
            </Button>
            
            {isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/dashboard"
                  className="p-3 text-center rounded-lg bg-carbon-850 border border-white/10 text-xs font-mono text-white"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-3 text-center rounded-lg bg-carbon-850 border border-white/10 text-xs font-mono text-red-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-3 text-center rounded-lg bg-carbon-850 border border-white/10 text-xs font-mono text-white"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
