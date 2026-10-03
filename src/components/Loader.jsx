import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const GREETINGS = ["Hello", "こんにちは", "Bonjour", "Hola", "안녕하세요", "Ciao", "Hallo", "こんにちは"];

export default function Loader({ onComplete }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onComplete?.();
    };

    const hold = window.setTimeout(() => setLeaving(true), reduce ? 350 : 2400);
    const failsafe = window.setTimeout(() => {
      setLeaving(true);
      finish();
    }, reduce ? 900 : 5200);
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(failsafe);
    };
  }, [onComplete, reduce]);

  useEffect(() => {
    if (leaving || reduce) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1 >= GREETINGS.length ? current : current + 1));
    }, 420);
    return () => window.clearInterval(timer);
  }, [leaving, reduce]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (!gone) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [gone]);

  return (
    <AnimatePresence onExitComplete={() => {
      setGone(true);
      onComplete?.();
    }}>
      {!leaving && (
        <motion.div
          key="preloader-overlay"
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-[#1c3126]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: reduce ? 0 : 0.7, duration: reduce ? 0.15 : 0.3 } }}
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          <div className="absolute inset-0 flex h-full w-full" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, column) => (
              <motion.div
                key={column}
                className="loader-stair relative h-full flex-1 border-r border-black/25 shadow-[inset_-18px_0_28px_rgba(0,0,0,0.22)] last:border-none"
                exit={
                  reduce
                    ? { opacity: 0 }
                    : { y: "-100%", transition: { duration: 0.8, delay: (4 - column) * 0.08, ease: [0.76, 0, 0.24, 1] } }
                }
              />
            ))}
          </div>
          <motion.div
            className="relative z-10 grid h-14 place-items-center overflow-hidden px-6 sm:h-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.35 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={GREETINGS[index]}
                className="col-start-1 row-start-1 text-center text-2xl font-semibold tracking-[0.22em] text-[#F7F4EA] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-3xl md:text-4xl sm:tracking-[0.28em]"
                style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                initial={reduce ? false : { y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {GREETINGS[index]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
