"use client";
import React, { useEffect, useRef } from "react";

export function Atmosphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-all duration-300"
      style={{
        background: `
          radial-gradient(circle 800px at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(201, 168, 76, 0.035) 0%, transparent 80%),
          radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(45, 61, 86, 0.15) 0%, transparent 70%),
          #070B13
        `,
      }}
    >
      {/* Editorial geometric mesh grid backdrop */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            radial-gradient(circle, #C9A84C 1px, transparent 1px),
            linear-gradient(to right, rgba(139, 155, 180, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 155, 180, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 50px 50px, 50px 50px',
          backgroundPosition: '0 0, 25px 25px, 25px 25px'
        }}
      />
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
