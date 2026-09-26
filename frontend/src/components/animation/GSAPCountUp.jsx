import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const GSAPCountUp = ({ end = 0, duration = 1.5, prefix = '', suffix = '' }) => {
  const [value, setValue] = useState(0);
  const elRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: end,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elRef.current,
          start: 'top 90%',
        },
        onUpdate: () => {
          setValue(Math.round(obj.val));
        },
      });
    }, elRef);

    return () => ctx.revert();
  }, [end, duration, prefersReducedMotion]);

  return (
    <span ref={elRef} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  );
};
