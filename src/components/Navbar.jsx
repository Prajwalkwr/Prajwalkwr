import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { navItems, scrollToHash, site, socialItems } from "../data/site";
import { GithubIcon, InstagramIcon } from "./Icons";

const socialIcons = {
  GitHub: GithubIcon,
  Instagram: InstagramIcon,
};

export default function Navbar() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const panelId = useId();
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const showBrand = atTop || open;

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (panelRef.current?.contains(event.target) || toggleRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const go = (event, hash) => {
    if (!hash.startsWith("#")) return;
    event.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToHash(hash), reduce ? 0 : 180);
  };

  return (
    <div className="staggered-menu-wrapper fixed-wrapper" style={{ "--sm-accent": "#FFB6C1" }} data-open={open || undefined}>
      <header className="staggered-menu-header" aria-label="Main navigation header">
        <div className={`min-w-0 ${reduce ? "" : "transition-opacity duration-300"} ${showBrand ? "opacity-100" : "pointer-events-none invisible opacity-0"}`}>
          <button
            ref={toggleRef}
            type="button"
            className="sm-glass-pill group flex cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 outline-none select-none active:scale-[0.98] sm:gap-4 sm:px-6 sm:py-3"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className="text-base leading-none font-bold tracking-[0.18em] text-white uppercase sm:text-xl sm:tracking-[0.22em] md:text-2xl"
              style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
            >
              {site.brand}
            </span>
            <span className="h-4.5 w-px bg-white/30 transition-colors group-hover:bg-white/50" />
            <span className="sm-bars" aria-hidden="true">
              <span className={`sm-bar sm-bar-top ${open ? "sm-bar-open-top" : ""}`} />
              <span className={`sm-bar sm-bar-bottom ${open ? "sm-bar-open-bottom" : ""}`} />
            </span>
          </button>
        </div>
        <div className="sm-header-socials">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="sm-glass-pill group flex items-center justify-center rounded-full p-2.5 text-white hover:text-[#FFB6C1] sm:p-3"
            aria-label="GitHub profile"
          >
            <GithubIcon className="h-4.5 w-4.5 fill-white transition-all duration-300 group-hover:scale-110 group-hover:fill-[#FFB6C1] sm:h-5 sm:w-5" />
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="sm-glass-pill group flex items-center justify-center rounded-full p-2.5 text-white hover:text-[#FFB6C1] sm:p-3"
            aria-label="Instagram profile"
          >
            <InstagramIcon className="h-4.5 w-4.5 fill-white transition-all duration-300 group-hover:scale-110 group-hover:fill-[#FFB6C1] sm:h-5 sm:w-5" />
          </a>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.aside
            id={panelId}
            ref={panelRef}
            className="staggered-menu-panel"
            initial={{ x: reduce ? 0 : "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: reduce ? 0 : "100%" }}
            transition={{ duration: reduce ? 0.15 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Site menu"
          >
            <div className="sm-panel-inner">
              <ul className="sm-panel-list" data-numbering="true">
                {navItems.map((item, index) => (
                  <li className="sm-panel-itemWrap" key={item.label}>
                    <a
                      className="sm-panel-item"
                      href={item.link}
                      aria-label={item.ariaLabel}
                      style={{ "--sm-num-opacity": 1 }}
                      onClick={(event) => go(event, item.link)}
                    >
                      <motion.span
                        className="sm-panel-itemLabel"
                        initial={reduce ? false : { y: "140%", rotate: 10 }}
                        animate={{ y: "0%", rotate: 0 }}
                        transition={{ duration: 0.7, delay: reduce ? 0 : 0.12 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {item.label}
                      </motion.span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="sm-socials">
                <h2 className="sm-socials-title">Socials</h2>
                <ul className="sm-socials-list">
                  {socialItems.map((item) => {
                    const Icon = socialIcons[item.label];
                    return (
                      <li key={item.label}>
                        <a className="sm-socials-link inline-flex items-center gap-2" href={item.link} target="_blank" rel="noreferrer">
                          {Icon ? <Icon className="h-4 w-4" /> : null}
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
