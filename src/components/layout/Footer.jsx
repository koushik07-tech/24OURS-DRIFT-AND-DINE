import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Instagram, Youtube, Linkedin, Twitter, ArrowUp, Sparkles, Phone, Mail, Clock } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import Badge from '../ui/Badge';
import { siteConfig } from '../../data/siteConfig';

export default function Footer({ onOpenJourneyModal }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-carbon-950 border-t border-white/10 pt-16 pb-12 text-carbon-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="lg" href="/" />
            
            <p className="text-carbon-400 text-sm max-w-sm leading-relaxed">
              Karnataka’s premier entertainment destination. High-speed electric go-karting, 360° sky-dining restaurant, RC racing arena, banquet halls, and automotive showcase.
            </p>

            <div className="space-y-1.5 text-xs font-mono text-carbon-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span>{siteConfig.location.displayAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span>Mon–Sun: 11:00 AM – 11:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <a href="tel:+919187194643" className="hover:text-white transition-colors">
                  +91 9187194643
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <a href="mailto:24ourschalukya@gmail.com" className="hover:text-white transition-colors">
                  24ourschalukya@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Explore
            </p>
            <ul className="space-y-2 font-mono">
              <li><Link to="/" className="hover:text-brand-red transition-colors">Home</Link></li>
              <li><Link to="/experiences" className="hover:text-brand-red transition-colors">All Experiences</Link></li>
              <li><Link to="/experiences/go-karting" className="hover:text-brand-red transition-colors">Go-Karting</Link></li>
              <li><Link to="/experiences/rc-racing" className="hover:text-brand-red transition-colors">RC Racing</Link></li>
              <li><Link to="/restaurant" className="hover:text-brand-red transition-colors">360° Restaurant</Link></li>
              <li><Link to="/events" className="hover:text-brand-red transition-colors">Event Halls</Link></li>
              <li><Link to="/automotive" className="hover:text-brand-red transition-colors">Automotive Showcase</Link></li>
              <li><Link to="/packages" className="hover:text-brand-red transition-colors">Packages & Deals</Link></li>
            </ul>
          </div>

          {/* Customer & Dashboard */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Customer Portal
            </p>
            <ul className="space-y-2 font-mono">
              <li><Link to="/booking" className="text-brand-red font-semibold hover:text-white transition-colors">Book Tickets Online</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-red transition-colors">My Bookings & Passes</Link></li>
              <li><Link to="/login" className="hover:text-brand-red transition-colors">Login / Register</Link></li>
              <li><Link to="/about" className="hover:text-brand-red transition-colors">About 24OURS</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-red transition-colors">Photo & Video Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red transition-colors">Contact & Directions</Link></li>
              <li><Link to="/admin" className="text-amber-400 hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Connect & Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Connect & Follow
            </p>
            <p className="text-carbon-400 leading-relaxed">
              Stay tuned for live racing tournaments, weekend DJ nights, and exclusive dining masterclasses.
            </p>

            {/* Social Channels */}
            <div className="flex items-center gap-2 pt-1">
              <a href="#" className="w-8 h-8 rounded-lg bg-carbon-900 border border-white/10 flex items-center justify-center text-carbon-400 hover:text-white hover:border-brand-red hover:bg-brand-red/10 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-carbon-900 border border-white/10 flex items-center justify-center text-carbon-400 hover:text-white hover:border-brand-red hover:bg-brand-red/10 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-carbon-900 border border-white/10 flex items-center justify-center text-carbon-400 hover:text-white hover:border-brand-red hover:bg-brand-red/10 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-carbon-900 border border-white/10 flex items-center justify-center text-carbon-400 hover:text-white hover:border-brand-red hover:bg-brand-red/10 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            {onOpenJourneyModal && (
              <div className="pt-2">
                <button
                  onClick={onOpenJourneyModal}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-red hover:text-white transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join VIP Updates Circle</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Legal Tier */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-carbon-400 font-mono text-[11px]">
          <div>
            <p>© {currentYear} 24OURS — Drift and Dine. All rights reserved. Malur, Kolar, Karnataka, India.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-carbon-900 border border-white/10 text-carbon-400 hover:text-white hover:border-brand-red transition-all ml-2"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
