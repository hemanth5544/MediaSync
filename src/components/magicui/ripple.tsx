import React, { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "../../lib/utils";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  rippleText?: string;
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 20,
  mainCircleOpacity = 0.24,
  numCircles = 5,
  rippleText = "You left the meeting",
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none [mask-image:linear-gradient(to_bottom,white,transparent)] flex items-center justify-center",
        className,
      )}
      {...props}
    >
    <div className="absolute z-10 text-foreground font-sans font-bold tracking-normal text-2xl text-white">
      {rippleText}
    </div>


      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 50;
        const opacity = mainCircleOpacity - i * 0.02;
        const animationDelay = `${i * 0.1}s`; 

        const borderStyle = "solid";
        const borderOpacity = 0;

        return (
          <div
            key={i}
            className={`absolute animate-ripple rounded-full border bg-foreground/25 shadow-xl`}
            style={
              {
                "--i": i,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle,
                borderWidth: "1px",
                borderColor: `hsl(var(--foreground), ${borderOpacity / 100})`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";