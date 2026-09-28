"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Calendar,
  Phone,
  ChevronRight,
  ShieldCheck,
  Zap,
  RotateCcw,
} from "lucide-react";
import { packagesData } from "@/data/packages";
import { faqData } from "@/data/faq";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/context/BookingContext";
import { soundEngine } from "@/lib/soundEngine";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  action?: {
    label: string;
    type: "booking" | "link" | "phone";
    target?: string;
  };
}

const QUICK_QUESTIONS = [
  "What package should I choose?",
  "How many laps do I get?",
  "Can beginners drive?",
  "What should I wear?",
  "Can children participate?",
  "What is the best time to visit?",
  "Can I book for a group?",
  "Where are you located & hours?",
];

export default function AIRaceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { openBookingModal } = useBooking();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `Welcome to 24OURS Pit Control! I am your AI Race Telemetry Assistant. Ask me anything about our racing heats, safety gear, packages, or track timings.`,
      timestamp: "Live",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Factual Business Knowledge Base matching
  const generateFactualResponse = (query: string): { text: string; action?: ChatMessage["action"] } => {
    const q = query.toLowerCase().trim();

    // 1. Packages / Which package
    if (q.includes("package") || q.includes("choose") || q.includes("recommend") || q.includes("price") || q.includes("cost")) {
      const topPacks = packagesData
        .filter((p) => p.price)
        .map((p) => `• ${p.name}: ₹${p.price.toLocaleString("en-IN")} (${p.duration}, ${p.tagline})`)
        .join("\n");
      return {
        text: `Here are our verified track packages at 24OURS:\n\n${topPacks}\n\nFor pure track thrills, we recommend the Race Pack (₹1,899 for 2x 10-min heats with full RFID telemetry). For families, our Family Pack (₹3,499) combines junior karting, arcade tokens, and Sky Dining.`,
        action: { label: "Book Race Pack", type: "booking", target: "RACE PACK" },
      };
    }

    // 2. Laps / Race heats
    if (q.includes("lap") || q.includes("heat") || q.includes("duration") || q.includes("how long")) {
      return {
        text: `Standard sessions are organized in high-intensity heats:\n• Race Pack: 2x 10-Minute Racing Heats (approx 18–24 total laps depending on your pace)\n• Telemetry RFID timing captures every sector delta and fastest lap\n• Safety briefing and gear fitment takes approx 15 minutes before heat 1.`,
        action: { label: "Reserve Track Heat", type: "booking", target: "Electric Go-Karting Grand Prix" },
      };
    }

    // 3. Beginners / First timers
    if (q.includes("beginner") || q.includes("first time") || q.includes("experience") || q.includes("license")) {
      return {
        text: `Absolutely! Beginners are warmly welcome. No driving license is required. Before taking the wheel, every racer goes through a professional safety briefing explaining steering, braking, flag protocols, and kart dynamics. Our electric karts feature multi-level speed governor systems adjusted for skill level.`,
      };
    }

    // 4. Dress code / What to wear / Shoes
    if (q.includes("wear") || q.includes("clothes") || q.includes("shoe") || q.includes("dress")) {
      return {
        text: `Attire requirements for maximum safety:\n• Closed-toe shoes (sneakers/sports shoes) are strictly MANDATORY. Sandals, Crocs, and high heels are not permitted on track.\n• Comfortable sports or casual attire is recommended.\n• We supply sanitized, race-certified full-face helmets and high-durability racing overalls on site.`,
      };
    }

    // 5. Children / Kids / Age / Height
    if (q.includes("child") || q.includes("kid") || q.includes("age") || q.includes("height") || q.includes("junior")) {
      return {
        text: `Age & Height Guidelines:\n• Adult Pro Karts: Minimum age 12 years and minimum height 4'6" (137 cm).\n• Junior Racers: Dual-control twin karts and restricted speed sessions are available for younger enthusiasts accompanied by a guardian.\n• Closed-toe footwear is required for all ages.`,
      };
    }

    // 6. Best time / Hours / Timings
    if (q.includes("time") || q.includes("visit") || q.includes("hour") || q.includes("open") || q.includes("timing")) {
      return {
        text: `Operating Hours:\n• ${siteConfig.contact.openingHours}\n\nBest Visiting Times:\n• Sunset Hot Laps: 5:00 PM – 7:30 PM (Golden hour racing with floodlights)\n• Night Grand Prix: 8:00 PM – 11:00 PM (Cool evening asphalt + neon track illumination)\n• Weekday afternoons (Mon–Thu) offer shorter wait times and student discounts (20% off with Student ID).`,
      };
    }

    // 7. Group / Corporate / Birthday
    if (q.includes("group") || q.includes("corporate") || q.includes("birthday") || q.includes("party") || q.includes("bulk")) {
      return {
        text: `Yes! We specialize in private group grand prix and corporate tournaments:\n• Corporate Pack (₹4,999/guest for 10–50 pax): Exclusive circuit tournament, podium ceremony, climate-controlled presentation banquet hall, and gourmet catering.\n• Birthday Pack (₹3,999/guest for 6–20 pax): Private karting heat, birthday trophy, arcade passes, and 360° Sky Dining celebration area.`,
        action: { label: "Plan Group Event", type: "booking", target: "Corporate Grand Prix Tournament" },
      };
    }

    // 8. Location & Directions
    if (q.includes("location") || q.includes("where") || q.includes("address") || q.includes("reach") || q.includes("route")) {
      return {
        text: `Location Details:\n• Address: ${siteConfig.location.displayAddress}\n• GPS Coordinates: ${siteConfig.location.coordinates}\n• Route: ${siteConfig.location.accessNote}.\nAmple valet and self-parking are provided on site.`,
        action: { label: "Call Track Support", type: "phone", target: siteConfig.contact.phone },
      };
    }

    // 9. Safety rules / Barriers
    if (q.includes("safety") || q.includes("rule") || q.includes("barrier") || q.includes("crash")) {
      return {
        text: `Safety Specifications:\n• Championship polymer spring barriers with electronic deceleration sensors.\n• Remote pit throttle cut-off system for immediate marshaling.\n• Strict zero-tolerance policy on bumping, spinning others, or reckless driving.\n• Mandatory safety briefing and full-face helmet fitment for all drivers.`,
      };
    }

    // 10. Dining / Restaurant
    if (q.includes("dine") || q.includes("restaurant") || q.includes("food") || q.includes("sky deck")) {
      return {
        text: `Our 360° Sky Dining Restaurant is elevated directly above the circuit with panoramic glass views of the entire asphalt layout. No track ticket is required to dine. We offer multi-cuisine artisanal dining, mocktails, and sunset reservations.`,
      };
    }

    // Fallback responsibly using actual contact
    return {
      text: `For specific inquiries about track schedule or customized race bookings, please contact our pit operations team directly at ${siteConfig.contact.phone} or ${siteConfig.contact.email}. You can also reserve directly through our booking calendar.`,
      action: { label: "Open Booking System", type: "booking", target: "General Track Pass" },
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    soundEngine.playClick(600);

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateFactualResponse(query);
      const botMsg: ChatMessage = {
        id: "b-" + Date.now(),
        sender: "bot",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        action: response.action,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      soundEngine.playClick(720);
    }, 650);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => {
            soundEngine.playClick(600);
            setIsOpen(!isOpen);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group px-4 py-3.5 rounded-full liquid-glass border border-[#FF5A36]/50 bg-[#06080d]/90 shadow-[0_0_25px_rgba(255,90,54,0.4)] text-white flex items-center gap-3 backdrop-blur-xl"
          aria-label="Open AI Race Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5A36] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#06080d]" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#FF5A36] font-bold">
              AI PIT CREW
            </div>
            <div className="text-[10px] text-zinc-300 font-sans">Ask Telemetry & Rules</div>
          </div>
        </motion.button>
      </div>

      {/* Slide-Up Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] rounded-2xl liquid-glass border border-white/15 bg-[#0b0f17]/95 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#FF5A36]/15 via-transparent to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5A36] to-[#ff3b14] flex items-center justify-center shadow-[0_0_15px_rgba(255,90,54,0.5)]">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-display font-bold text-white tracking-wider flex items-center gap-2">
                    AI RACE ASSISTANT
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">24OURS Verified Track Intelligence</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    soundEngine.playClick(400);
                    setMessages([
                      {
                        id: "reset-" + Date.now(),
                        sender: "bot",
                        text: "Pit assistant reset. How may I assist your track visit today?",
                        timestamp: "Live",
                      },
                    ]);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Clear history"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClick(400);
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Chips Carousel */}
            <div className="px-3 py-2 border-b border-white/5 bg-black/30 overflow-x-auto flex gap-1.5 no-scrollbar">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 hover:bg-[#FF5A36]/20 border border-white/10 hover:border-[#FF5A36]/40 text-zinc-300 hover:text-white transition-all whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-line ${
                      m.sender === "user"
                        ? "bg-[#FF5A36] text-white font-medium rounded-tr-none shadow-md"
                        : "bg-white/5 text-zinc-200 border border-white/10 rounded-tl-none"
                    }`}
                  >
                    {m.text}

                    {m.action && (
                      <div className="mt-2.5 pt-2 border-t border-white/15">
                        {m.action.type === "booking" && (
                          <button
                            onClick={() => {
                              soundEngine.playClick(600);
                              openBookingModal(m.action?.target);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF5A36] to-[#ff4721] hover:brightness-110 text-white font-mono font-bold text-[11px] flex items-center justify-center gap-1.5 uppercase shadow-md transition-all"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{m.action.label}</span>
                          </button>
                        )}
                        {m.action.type === "phone" && (
                          <a
                            href={`tel:${m.action.target}`}
                            className="w-full px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[11px] flex items-center justify-center gap-1.5 uppercase shadow-md transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{m.action.label}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">{m.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 w-fit text-zinc-400 text-xs font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] animate-bounce [animation-delay:0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] animate-bounce [animation-delay:0.3s]" />
                  <span className="text-[10px] ml-1">Analyzing track telemetry...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about laps, height rules, packages..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-[#FF5A36]/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-[#FF5A36] hover:bg-[#ff4721] disabled:opacity-40 disabled:hover:bg-[#FF5A36] text-white transition-all shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
