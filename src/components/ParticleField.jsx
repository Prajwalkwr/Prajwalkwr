import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const MAX_PARTICLES = 32000;
const PARTICLE_SIZE = 2;
const MOUSE_RADIUS = 95;
const REPEL_FORCE = 26;
const RETURN_SPEED = 0.048;
const DAMPING = 0.942;
const OFFSET_X = 90;
const SCALE_RATIO = 0.84;
const BRIGHTNESS = 0.94;

function isLittleEndian() {
  return new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;
}

export default function ParticleField({ src = "/hero-subject.jpg", active = true }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    isHovered: false,
    isDown: false,
  });

  useEffect(() => {
    if (!active || reduce) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let frame = 0;
    let running = true;
    const littleEndian = isLittleEndian();
    const image = new Image();

    const sample = (source, width, height) => {
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const context = off.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      const fit = width < 640 ? 0.92 : width < 1024 ? 0.88 : SCALE_RATIO;
      const scale = Math.min((width * fit) / source.width, (height * fit) / source.height);
      const drawW = source.width * scale;
      const drawH = source.height * scale;
      const shift = width > 1024 ? OFFSET_X : width > 640 ? OFFSET_X * 0.45 : OFFSET_X * 0.12;
      const dx = (width - drawW) / 2 + shift;
      const dy = (height - drawH) / 2;
      context.clearRect(0, 0, width, height);
      context.drawImage(source, dx, dy, drawW, drawH);
      const pixels = context.getImageData(0, 0, width, height).data;
      let bright = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        const alpha = pixels[index + 3];
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        if (alpha > 15 && !(red < 45 && green < 45 && blue < 45)) bright += 1;
      }
      const step = Math.max(1, Math.floor(Math.sqrt(bright / MAX_PARTICLES)));
      const next = [];
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          if (pixels[index + 3] <= 15 || (red < 45 && green < 45 && blue < 45)) continue;
          const cr = Math.min(255, Math.floor(red * BRIGHTNESS));
          const cg = Math.min(255, Math.floor(green * BRIGHTNESS));
          const cb = Math.min(255, Math.floor(blue * BRIGHTNESS));
          const color32 = littleEndian ? (255 << 24) | (cb << 16) | (cg << 8) | cr : (cr << 24) | (cg << 16) | (cb << 8) | 255;
          next.push({ x, y, originX: x, originY: y, vx: 0, vy: 0, color32 });
        }
      }
      particlesRef.current = next;
    };

    const resize = () => {
      const bounds = canvas.parentElement?.getBoundingClientRect();
      const width = Math.max(1, Math.floor(bounds?.width || window.innerWidth));
      const height = Math.max(1, Math.floor(bounds?.height || window.innerHeight));
      sizeRef.current = { width, height };
      canvas.width = width;
      canvas.height = height;
      if (width >= 768 && image.complete && image.naturalWidth) sample(image, width, height);
    };

    image.onload = () => resize();
    image.src = src;
    resize();
    window.addEventListener("resize", resize);

    const context = canvas.getContext("2d", { willReadFrequently: true });
    let last = performance.now();
    const maxSpeed = 7.5;
    let buffer = null;
    let pixels = null;
    let bufferW = 0;
    let bufferH = 0;

    const tick = (now) => {
      if (!running) return;
      frame = window.requestAnimationFrame(tick);
      const elapsed = Math.min(now - last, 32);
      last = now;
      const dt = elapsed / 16.667;
      const { width, height } = sizeRef.current;
      if (!context || width <= 0 || height <= 0) return;
      if (width < 768 || window.scrollY > height * 1.05) return;
      if (!buffer || bufferW !== width || bufferH !== height) {
        bufferW = width;
        bufferH = height;
        buffer = context.createImageData(width, height);
        pixels = new Uint32Array(buffer.data.buffer, buffer.data.byteOffset, width * height);
      }
      pixels.fill(0);
      const mouse = mouseRef.current;
      const follow = 1 - (1 - 0.32) ** dt;
      mouse.x += (mouse.targetX - mouse.x) * follow;
      mouse.y += (mouse.targetY - mouse.y) * follow;
      const list = particlesRef.current;
      const radius = mouse.isDown ? MOUSE_RADIUS * 1.35 : MOUSE_RADIUS;
      const radiusSq = radius * radius;
      const force = mouse.isDown ? REPEL_FORCE * 1.7 : REPEL_FORCE;
      const damp = DAMPING ** dt;
      const stamp = PARTICLE_SIZE >= 1.5;
      const time = now * 0.0025;

      for (let index = 0; index < list.length; index += 1) {
        const particle = list[index];
        particle.vx += (particle.originX - particle.x) * RETURN_SPEED * dt;
        particle.vy += (particle.originY - particle.y) * RETURN_SPEED * dt;
        particle.vy += Math.sin(particle.originX * 0.01 + particle.originY * 0.015 + time) * 0.16 * dt;
        particle.vx += Math.cos(particle.originY * 0.01 + time) * 0.11 * dt;
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        if (mouse.isHovered && Math.abs(dx) < radius && Math.abs(dy) < radius) {
          const distSq = dx * dx + dy * dy;
          if (distSq < radiusSq && distSq > 0) {
            const ratio = Math.sqrt(distSq) / radius;
            const falloff = 0.5 * (1 + Math.cos(Math.PI * ratio));
            const push = falloff * force * dt;
            const angle = Math.atan2(dy, dx);
            particle.vx += Math.cos(angle) * push;
            particle.vy += Math.sin(angle) * push;
            const swirl = force * 0.22 * falloff * dt;
            particle.vx += Math.cos(angle + Math.PI / 2) * swirl;
            particle.vy += Math.sin(angle + Math.PI / 2) * swirl;
          }
        }
        const speedSq = particle.vx * particle.vx + particle.vy * particle.vy;
        if (speedSq > maxSpeed * maxSpeed) {
          const limit = maxSpeed / Math.sqrt(speedSq);
          particle.vx *= limit;
          particle.vy *= limit;
        }
        particle.vx *= damp;
        particle.vy *= damp;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        const px = Math.floor(particle.x);
        const py = Math.floor(particle.y);
        if (px < 0 || py < 0 || px >= width || py >= height) continue;
        const slot = py * width + px;
        pixels[slot] = particle.color32;
        if (!stamp) continue;
        if (px + 1 < width) pixels[slot + 1] = particle.color32;
        if (py + 1 < height) {
          pixels[slot + width] = particle.color32;
          if (px + 1 < width) pixels[slot + width + 1] = particle.color32;
        }
      }
      context.putImageData(buffer, 0, 0);
    };

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;
      mouse.targetX = event.clientX - rect.left;
      mouse.targetY = event.clientY - rect.top;
      if (mouse.x === -9999) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      }
      mouse.isHovered = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    };
    const onDown = () => {
      mouseRef.current.isDown = true;
    };
    const onUp = () => {
      mouseRef.current.isDown = false;
    };
    const onLeave = () => {
      const mouse = mouseRef.current;
      mouse.isHovered = false;
      mouse.isDown = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    const onVisibility = () => {
      running = document.visibilityState !== "hidden";
      if (running) {
        last = performance.now();
        frame = window.requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    frame = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active, reduce, src]);

  return (
    <motion.div
      className="pointer-events-none relative z-10 h-full min-h-screen w-full overflow-hidden bg-transparent select-none"
      initial={reduce ? false : { x: "-95vw", opacity: 0 }}
      animate={active ? { x: 0, opacity: 1 } : { x: "-95vw", opacity: 0 }}
      transition={reduce ? { duration: 0.2 } : { duration: 2.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
    >
      <canvas
        ref={canvasRef}
        className="relative z-10 block h-full w-full"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 78%, rgba(0,0,0,0.55) 90%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 78%, rgba(0,0,0,0.55) 90%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-24 bg-gradient-to-t from-black via-black/65 to-transparent sm:h-36" />
    </motion.div>
  );
}
