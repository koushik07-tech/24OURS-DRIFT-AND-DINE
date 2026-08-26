"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  initialMinutes?: number;
  className?: string;
}

export default function CountdownTimer({ initialMinutes = 28, className = "" }: CountdownTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isExpired = secondsRemaining === 0;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const ariaLabel = isExpired
    ? "Countdown timer expired"
    : `Time remaining: ${minutes} minutes ${seconds} seconds`;

  return (
    <div
      role="timer"
      aria-label={ariaLabel}
      className={`flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/95 border border-blue-200/80 shadow-md backdrop-blur-md transition-all">
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-900 shrink-0 animate-pulse" />
        
        {isExpired ? (
          <span className="font-mono font-black text-xs sm:text-sm text-red-600 tracking-wider">
            TIME EXPIRED
          </span>
        ) : (
          <span className="font-mono font-black text-sm sm:text-base text-blue-950 tracking-wider">
            {isMounted ? `${formattedMinutes} : ${formattedSeconds}` : `${String(initialMinutes).padStart(2, "0")} : 00`}
          </span>
        )}
      </div>
      
      <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-white/90 uppercase mt-0.5 drop-shadow">
        TIME LEFT
      </span>
    </div>
  );
}
