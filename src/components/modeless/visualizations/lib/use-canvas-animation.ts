import * as React from "react";
import { motionBudget, type Waiter } from "./motion-budget";
import { resolveModelessVisualizationPalette, type ModelessVisualizationPalette } from "./palette";

const STATIC_T = 7.5;

export type CanvasFrameInfo = {
  ctx: CanvasRenderingContext2D;
  t: number;
  dt: number;
  w: number;
  h: number;
  dpr: number;
  frame: number;
  palette: ModelessVisualizationPalette;
  reducedMotion: boolean;
};

export type CanvasRenderFn = (info: CanvasFrameInfo) => void;

export type CanvasAnimationOptions = {
  cost?: "light" | "heavy";
  alpha?: boolean;
};

export function useCanvasAnimation(render: CanvasRenderFn, options: CanvasAnimationOptions = {}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const renderRef = React.useRef(render);
  renderRef.current = render;
  const heavy = options.cost === "heavy";
  const alpha = options.alpha ?? false;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha });
    if (!ctx) return;
    const canvasEl = canvas;
    const containerEl = container;
    const ctx2d = ctx;

    const palette = resolveModelessVisualizationPalette();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssW = 0;
    let cssH = 0;
    let frame = 0;
    let raf = 0;
    let lastTs = 0;
    let elapsed = 0;
    let onScreen = true;
    let reduced = motionQuery.matches;
    let slot: "none" | "queued" | "held" = "none";

    function paint(t: number, dt: number) {
      if (cssW === 0 || cssH === 0) return;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderRef.current({ ctx: ctx2d, t, dt, w: cssW, h: cssH, dpr, frame, palette, reducedMotion: reduced });
      frame++;
    }

    function loop(ts: number) {
      if (!lastTs) lastTs = ts;
      const rawDt = (ts - lastTs) / 1000;
      lastTs = ts;
      const dt = Math.min(rawDt, 0.05);
      elapsed += dt;
      paint(elapsed, dt);
      raf = requestAnimationFrame(loop);
    }

    function shouldRun() {
      return !reduced && onScreen && !document.hidden;
    }

    function runLoop() {
      if (raf) return;
      lastTs = 0;
      raf = requestAnimationFrame(loop);
    }

    const onGranted: Waiter = () => {
      slot = "held";
      if (shouldRun()) runLoop();
      else {
        motionBudget.release();
        slot = "none";
      }
    };

    function start() {
      if (!shouldRun()) return;
      if (!heavy) {
        runLoop();
        return;
      }
      if (slot === "held") {
        runLoop();
        return;
      }
      if (slot === "queued") return;
      const granted = motionBudget.acquire(onGranted);
      slot = granted ? "held" : "queued";
      if (granted) runLoop();
    }

    function stop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (!heavy) return;
      if (slot === "held") {
        motionBudget.release();
        slot = "none";
      } else if (slot === "queued") {
        motionBudget.cancelRequest(onGranted);
        slot = "none";
      }
    }

    function resize() {
      const rect = containerEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = rect.width;
      cssH = rect.height;
      canvasEl.width = Math.round(cssW * dpr);
      canvasEl.height = Math.round(cssH * dpr);
      paint(reduced ? STATIC_T : elapsed, 0);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(containerEl);
    resize();

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        if (shouldRun()) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    io.observe(containerEl);

    function onVisibility() {
      if (shouldRun()) start();
      else stop();
    }
    document.addEventListener("visibilitychange", onVisibility);

    function onMotionChange() {
      reduced = motionQuery.matches;
      if (reduced) {
        stop();
        paint(STATIC_T, 0);
      } else {
        start();
      }
    }
    motionQuery.addEventListener("change", onMotionChange);

    if (reduced) paint(STATIC_T, 0);
    else start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [alpha, heavy]);

  return { canvasRef, containerRef };
}
