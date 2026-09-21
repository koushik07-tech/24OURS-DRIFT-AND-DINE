"use client";

import { useState, useEffect, useCallback } from "react";
import { soundEngine } from "@/lib/soundEngine";

export function useSound() {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  useEffect(() => {
    setIsMuted(soundEngine.getMuted());
  }, []);

  const toggleMute = useCallback(() => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    return muted;
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    soundEngine.setMuted(muted);
    setIsMuted(muted);
  }, []);

  const playClick = useCallback((freq = 600) => {
    soundEngine.playClick(freq);
  }, []);

  const playHover = useCallback(() => {
    soundEngine.playHover();
  }, []);

  const playBoost = useCallback(() => {
    soundEngine.playBoostSound();
  }, []);

  return {
    isMuted,
    toggleMute,
    setMuted,
    playClick,
    playHover,
    playBoost,
  };
}

export default useSound;
