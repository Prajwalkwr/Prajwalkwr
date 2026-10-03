import { useEffect, useRef } from "react";
import { projects } from "../data/projects";
import SafeImage from "./SafeImage";

export default function WorkRail() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cards = [...projects, ...projects];

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    let frame = 0;
    let current = 0;
    let target = 0;
    let active = false;
    let maxShift = 0;
    let running = true;

    const measure = () => {
      maxShift = Math.max(0, track.scrollWidth - window.innerWidth + 80);
      const start = section.offsetTop;
      const span = section.offsetHeight + window.innerHeight;
      const progress = (window.scrollY + window.innerHeight - start) / span;
      target = -Math.max(0, Math.min(1, progress)) * maxShift;
    };

    const tick = (now) => {
      if (!running) return;
      if (active) {
        current += (target - current) * 0.09;
        track.style.transform = `translate3d(${current}px, 0, 0)`;
      }
      frame = window.requestAnimationFrame(tick);
      return now;
    };

    const onScroll = () => {
      if (!active) return;
      measure();
    };

    measure();
    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) measure();
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    frame = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-black py-24 select-none sm:py-32" aria-label="Project preview rail">
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-20 w-20 bg-gradient-to-r from-black via-black/90 to-transparent sm:w-40" />
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-20 bg-gradient-to-l from-black via-black/90 to-transparent sm:w-40" />
      <div className="w-full overflow-visible py-4">
        <div ref={trackRef} className="flex w-max items-center gap-6 px-8 will-change-transform sm:gap-8 sm:px-16">
          {cards.map((project, index) => (
            <a
              key={`${project.title}-${index}`}
              href={project.live || project.github}
              target="_blank"
              rel="noreferrer"
              className="relative aspect-[16/10] w-64 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-xl transition-colors duration-300 hover:border-white/30 sm:w-72 md:w-80"
              aria-label={project.live ? `${project.title} live site` : `${project.title} on GitHub`}
            >
              <SafeImage src={project.image} alt="" label={project.title} className="h-full w-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-10 pb-3 text-sm font-semibold text-white">
                {project.title}
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="mt-12 px-4 text-center">
        <p
          className="text-xs font-bold tracking-[0.18em] text-[#EAE6E1] uppercase sm:text-sm sm:tracking-[0.22em]"
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
        >
          A few projects built while learning web development and practical software
        </p>
      </div>
    </section>
  );
}
