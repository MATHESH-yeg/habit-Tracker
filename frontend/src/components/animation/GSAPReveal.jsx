import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const GSAPReveal = ({ children, direction = 'up', delay = 0, className = '' }) => {
  const elRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !elRef.current) return;

    let yOffset = 40;
    if (direction === 'down') yOffset = -40;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elRef.current,
        {
          opacity: 0,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, elRef);

    return () => ctx.revert();
  }, [direction, delay, prefersReducedMotion]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
};
