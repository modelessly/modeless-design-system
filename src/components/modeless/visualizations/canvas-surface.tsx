import * as React from "react";
import { cn } from "../../../lib/utils";
import {
  useCanvasAnimation,
  type CanvasAnimationOptions,
  type CanvasRenderFn,
} from "./lib/use-canvas-animation";

export interface CanvasSurfaceProps extends CanvasAnimationOptions {
  render: CanvasRenderFn;
  className?: string;
}

export function CanvasSurface({ render, cost, alpha, className }: CanvasSurfaceProps) {
  const { canvasRef, containerRef } = useCanvasAnimation(render, { cost, alpha });
  return (
    <div ref={containerRef} className={cn("absolute inset-0", className)}>
      <canvas ref={canvasRef} aria-hidden={true} className="block h-full w-full" />
    </div>
  );
}
