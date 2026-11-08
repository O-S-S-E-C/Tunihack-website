"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "01<>/\\{}[]*+×⌘⌥∆λЖ";

type Glyph = {
  x: number;
  y: number;
  char: string;
  phase: number;
  size: number;
};

export default function GlyphSonar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let animation = 0;
    let glyphs: Glyph[] = [];
    const startedAt = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const columns = Math.ceil(width / 42);
      const rows = Math.ceil(height / 38);
      glyphs = Array.from({ length: columns * rows }, (_, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        return {
          x: (col + 0.5) * (width / columns),
          y: (row + 0.5) * (height / rows),
          char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          phase: Math.random() * Math.PI * 2,
          size: 10 + Math.random() * 4,
        };
      });
    };

    const draw = (now: number) => {
      if (!context) return;
      frame += 1;
      const elapsed = (now - startedAt) / 1000;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const maxRadius = Math.hypot(width, height) * 0.62;
      const sweep = (elapsed % 5.8) / 5.8;
      const radius = sweep * maxRadius;

      context.clearRect(0, 0, width, height);

      context.textAlign = "center";
      context.textBaseline = "middle";
      for (const glyph of glyphs) {
        const distance = Math.hypot(glyph.x - centerX, glyph.y - centerY);
        const angle = Math.atan2(glyph.y - centerY, glyph.x - centerX);
        const angularDistance = Math.abs(Math.atan2(Math.sin(angle - (sweep * Math.PI * 2 - Math.PI / 2)), Math.cos(angle - (sweep * Math.PI * 2 - Math.PI / 2))));
        const ping = !reduceMotion && Math.abs(distance - radius) < 26;
        const shoal = !reduceMotion && angularDistance < 0.22 && distance < radius;
        const drift = reduceMotion ? 0.13 : 0.1 + (Math.sin(elapsed * 0.7 + glyph.phase) + 1) * 0.035;
        const alpha = ping ? 0.96 : shoal ? 0.58 : drift;
        context.font = `${glyph.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        context.fillStyle = ping ? "rgba(133, 239, 255, 0.98)" : `rgba(80, 156, 230, ${alpha})`;
        if (ping) {
          context.shadowColor = "rgba(34, 211, 238, 0.85)";
          context.shadowBlur = 12;
        }
        context.fillText(glyph.char, glyph.x, glyph.y);
        context.shadowBlur = 0;

        if (!reduceMotion && frame % 90 === 0 && Math.random() > 0.992) {
          glyph.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      if (!reduceMotion) animation = window.requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      if (reduceMotion) draw(performance.now());
    };

    resize();
    draw(startedAt);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(animation);
    };
  }, []);

  return <canvas ref={canvasRef} className="glyph-sonar" aria-hidden="true" />;
}
