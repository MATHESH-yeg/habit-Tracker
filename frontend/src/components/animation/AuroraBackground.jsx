import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const AuroraCanvasLazy = lazy(() => import('./AuroraCanvas'));

export const AuroraBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Static CSS gradient fallback for reduced motion or low GPU / hidden tab
  if (prefersReducedMotion || !isVisible) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 aurora-gradient-amber opacity-60" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 aurora-gradient-amber opacity-40 z-0" />
      <Suspense fallback={null}>
        <AuroraCanvasLazy />
      </Suspense>
    </div>
  );
};
