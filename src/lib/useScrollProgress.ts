import { useEffect, useState, RefObject } from "react";

export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let lastScrollTop = 0;
    let lastTime = Date.now();
    let frameId: number | null = null;
    let isIntersecting = false;

    const handleScroll = () => {
      if (!isIntersecting) return;
      
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the element has scrolled through the viewport
        // 0.0 means the top of the element just entered the bottom of the viewport
        // 1.0 means the bottom of the element just left the top of the viewport
        const totalDist = rect.height + viewportHeight;
        const currentDist = viewportHeight - rect.top;
        
        let currentProgress = currentDist / totalDist;
        currentProgress = Math.max(0, Math.min(1, currentProgress));
        
        // Calculate velocity
        const now = Date.now();
        const timeDiff = Math.max(1, now - lastTime);
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollDiff = Math.abs(scrollTop - lastScrollTop);
        const currentVelocity = scrollDiff / timeDiff; // pixels per ms
        
        lastScrollTop = scrollTop;
        lastTime = now;

        setProgress(currentProgress);
        setVelocity(currentVelocity);

        // Set CSS custom property directly for buttery smooth CSS animations
        element.style.setProperty("--scroll-progress", currentProgress.toString());
        element.style.setProperty("--scroll-velocity", currentVelocity.toString());
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          window.addEventListener("scroll", handleScroll, { passive: true });
          // Initial trigger
          handleScroll();
        } else {
          window.removeEventListener("scroll", handleScroll);
        }
      },
      { threshold: 0 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [ref]);

  return { progress, velocity };
}
