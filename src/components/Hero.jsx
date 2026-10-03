import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { scrollToHash } from "../data/site";
import { ArrowUpRight } from "./Icons";
import ParticleField from "./ParticleField";

const SUBTITLE = "KUNWOR  ·  BIM STUDENT";

export default function Hero({ ready }) {
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const width = window.matchMedia("(min-width: 768px)");
    const update = () => {
      setFinePointer(pointer.matches);
      setDesktop(width.matches);
    };
    update();
    pointer.addEventListener("change", update);
    width.addEventListener("change", update);
    return () => {
      pointer.removeEventListener("change", update);
      width.removeEventListener("change", update);
    };
  }, []);

  const showParticles = desktop && finePointer && !reduce;
  const enter = (delay) =>
    reduce
      ? { duration: 0.2 }
      : { duration: ready ? 0.9 : 0.8, delay: ready ? delay : 0.15, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="hero-pin">
      <section id="hero" className="hero-fixed" aria-label="Introduction">
        <div className="pointer-events-none absolute top-[calc(50%+1.5rem)] left-4 z-30 w-[calc(100%-2rem)] -translate-y-1/2 select-none sm:left-8 sm:w-[calc(100%-4rem)] md:left-12 md:w-[calc(100%-6rem)] lg:left-16 lg:w-[calc(100%-8rem)]">
          <div className="inline-flex max-w-full flex-col items-stretch">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={enter(0.15)}>
              <h1
                className="hero-headline-mask text-shine-once mt-2 mb-0.5 max-w-full origin-left bg-clip-text text-[clamp(3.25rem,11vw,12.5rem)] leading-[0.85] font-bold tracking-[-0.04em] text-transparent sm:mt-3.5 sm:mb-1"
                style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
              >
                Prajwal
              </h1>
              <div className="hero-subtext-mask mt-1 w-full translate-x-1.5 px-0.5 sm:mt-1 sm:translate-x-4 md:translate-x-6">
                <p
                  className="flex w-full max-w-full justify-between text-[clamp(0.55rem,1.7vw,0.95rem)] leading-none font-normal tracking-[0.08em] text-white uppercase whitespace-nowrap sm:tracking-[0.14em]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {Array.from(SUBTITLE).map((char, index) => (
                    <span key={`${char}-${index}`}>{char === " " ? "\u00A0" : char}</span>
                  ))}
                </p>
              </div>
            </motion.div>
            <motion.div
              className="pointer-events-auto relative z-20 mt-5 translate-x-1.5 sm:mt-8 sm:translate-x-4 md:translate-x-6"
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 25, scale: 0.95 }}
              transition={enter(0.35)}
            >
              <a
                href="#projects"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToHash("#projects");
                }}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#FFB6C1]/40 bg-[#FFB6C1]/20 px-5 py-2.5 text-xs font-medium tracking-wide text-white shadow-[0_4px_20px_rgba(255,182,193,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-[#FFB6C1]/70 hover:bg-[#FFB6C1]/30 active:scale-95 sm:gap-2.5 sm:px-6 sm:py-3 sm:text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="bg-gradient-to-r from-white via-[#FFE4EC] to-[#FFB6C1] bg-clip-text text-transparent transition-all duration-300 group-hover:from-white group-hover:to-white">
                  Explore projects
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#FFB6C1] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4" />
              </a>
            </motion.div>
          </div>
        </div>

        <div className={`${showParticles ? "hidden md:block" : "hidden"} h-full w-full`}>
          <ParticleField active={showParticles && ready} />
        </div>

        <div className={`${showParticles ? "md:hidden" : "block"} pointer-events-none absolute inset-0 z-0 overflow-hidden select-none`}>
          <img src="/hero-subject.jpg" alt="" className="h-full w-full object-cover object-center opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35" />
          <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
      </section>
    </div>
  );
}
