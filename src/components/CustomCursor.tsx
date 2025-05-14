import { useEffect, useState, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device is touch-enabled
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0;

    // If it's a touch device, don't initialize cursor effects
    if (isTouchDevice) {
      return;
    }

    let animationFrameId: number;
    let currentX = 0;
    let currentY = 0;
    let aimX = 0;
    let aimY = 0;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const createParticle = (x: number, y: number) => {
      const size = Math.random() * 3 + 1;
      const speedX = (Math.random() - 0.5) * 2;
      const speedY = (Math.random() - 0.5) * 2;
      return {
        x,
        y,
        size,
        speedX,
        speedY,
        opacity: 1,
      };
    };

    const updatePosition = (e: MouseEvent) => {
      aimX = e.clientX;
      aimY = e.clientY;
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Add new particles
      if (Math.random() > 0.5) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    const animate = () => {
      // Smooth follow for the outline
      const dx = aimX - currentX;
      const dy = aimY - currentY;

      currentX += dx * 0.15;
      currentY += dy * 0.15;

      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${aimX}px, ${aimY}px)`;
      }

      // Update and draw particles
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current = particlesRef.current.filter((particle) => {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.opacity -= 0.02;

          if (particle.opacity <= 0) return false;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(var(--primary) / ${particle.opacity})`;
          ctx.fill();

          return true;
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      particlesRef.current = [];
    };
    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="cursor-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9997,
        }}
      />
      <div
        ref={cursorRef}
        className="cursor-dot"
        style={{
          opacity: isVisible ? 1 : 0,
        }}
      />
      <div
        ref={outlineRef}
        className="cursor-outline"
        style={{
          opacity: isVisible ? 1 : 0,
        }}
        data-active={isActive}
      />
    </>
  );
};
