"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.15, once = false) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.classList.add("about-reveal-ready");
    const reveal = () => {
      element.classList.add("about-reveal-visible");
      setInView(true);
    };
    const hide = () => {
      element.classList.remove("about-reveal-visible");
      setInView(false);
    };

    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          if (once) observer.disconnect();
        } else if (!once) {
          hide();
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold]);

  return { ref, inView };
}
