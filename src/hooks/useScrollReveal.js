import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(options = {}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const {
      y = 40,
      opacity = 0,
      duration = 1,
      ease = 'power3.out',
      stagger = 0.15,
      threshold = 'top 85%',
      scrub = false,
    } = options;

    const targets = el.dataset.revealGroup ? el.children : el;

    const anim = gsap.fromTo(
      targets,
      { y, opacity },
      {
        y: 0,
        opacity: 1,
        duration,
        ease,
        stagger: el.dataset.revealGroup ? stagger : 0,
        scrollTrigger: {
          trigger: el,
          start: threshold,
          toggleActions: scrub ? undefined : 'play none none none',
          scrub: scrub,
        },
      }
    );

    return () => {
      anim.kill();
      if (anim.scrollTrigger) {
        anim.scrollTrigger.kill();
      }
    };
  }, [options]);

  return elementRef;
}
