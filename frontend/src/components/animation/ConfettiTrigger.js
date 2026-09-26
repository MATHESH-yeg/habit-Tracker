import confetti from 'canvas-confetti';

export const triggerConfetti = (originX = 0.5, originY = 0.5) => {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: ['#fa8c16', '#ffe58f', '#ffc069', '#ffffff', '#eab308'],
      ticks: 150,
      gravity: 0.9,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  } catch (e) {
    console.error('Confetti execution error:', e);
  }
};
