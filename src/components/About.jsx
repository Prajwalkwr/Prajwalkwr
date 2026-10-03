import { useState } from "react";
import SplitText from "./SplitText";

const groups = [
  {
    title: "Frontend Tools",
    text: "HTML, CSS, JavaScript, React, Vite, and responsive web design.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="2" />
        <path d="M2 6h12M6 6v8" />
      </svg>
    ),
  },
  {
    title: "Backend Tools",
    text: "Node.js, Express.js, MongoDB, and REST APIs.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true">
        <rect x="2" y="2" width="12" height="5" rx="1.5" />
        <rect x="2" y="9" width="12" height="5" rx="1.5" />
        <circle cx="5" cy="4.5" r="0.8" fill="#fff" />
        <circle cx="5" cy="11.5" r="0.8" fill="#fff" />
      </svg>
    ),
  },
  {
    title: "Workflow",
    text: "Git and GitHub for version control and project collaboration.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true">
        <circle cx="4" cy="4" r="1.6" />
        <circle cx="12" cy="8" r="1.6" />
        <circle cx="4" cy="12" r="1.6" />
        <path d="M4 5.6v4.8M5.4 4.7c2.2.4 4.4 1.6 5.2 2.5" />
      </svg>
    ),
  },
];

export default function About() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = open || hovered;

  return (
    <section id="about" className="relative z-10 w-full bg-black py-28 text-white sm:py-36">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src="/about-bg.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-55 brightness-90 select-none sm:opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/20 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/45" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        <div className="mb-14 flex flex-col items-start sm:mb-20" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
          <SplitText
            text="BUILDING PRACTICAL"
            className="text-[clamp(2rem,6vw,4.5rem)] leading-[1.08] font-bold tracking-tight text-neutral-400 uppercase"
          />
          <SplitText
            text="DIGITAL SYSTEMS."
            className="text-[clamp(2rem,6vw,4.5rem)] leading-[1.08] font-bold tracking-tight text-[#EAE6E1] uppercase"
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <div
            className="space-y-6 text-lg leading-relaxed font-normal text-slate-200 sm:text-xl lg:col-span-6 lg:text-2xl"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            <p>
              Prajwal Kunwor is a BIM student from Kathmandu, Nepal, interested in web development and software projects.
            </p>
            <p>
              He enjoys creating practical digital solutions and learning modern technologies through real-world projects.
            </p>
          </div>

          <div className="flex w-full items-start justify-start pt-1 lg:col-span-6">
            <div
              className={`about-staggered-wrapper ${active ? "is-open" : ""}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className="trigger-wrapper">
                <button
                  type="button"
                  className="merge-btn"
                  aria-expanded={active}
                  onClick={() => setOpen((value) => !value)}
                >
                  Tools
                </button>
              </div>
              <svg className="branch-svg-canvas" viewBox="0 0 660 600" aria-hidden="true">
                <path className="branch-line line-box1" d="M62,48 C62,70 150,70 210,76" />
                <circle cx="210" cy="76" r="4" className="branch-dot dot-box1" />
                <path className="branch-line line-box2" d="M62,48 C62,150 15,170 15,245" />
                <circle cx="15" cy="245" r="4" className="branch-dot dot-box2" />
                <path className="branch-line line-box3" d="M62,48 C62,220 240,300 240,415" />
                <circle cx="240" cy="415" r="4" className="branch-dot dot-box3" />
              </svg>
              {groups.map((group, index) => (
                <div className={`tooltip-content box-${index + 1}`} key={group.title}>
                  <h3 className="tooltip-header">
                    {group.icon}
                    <span>{group.title}</span>
                  </h3>
                  <p className="tooltip-info">{group.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
