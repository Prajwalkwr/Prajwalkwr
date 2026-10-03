import { motion, useReducedMotion } from "framer-motion";
import { ExternalIcon, GithubIcon, TriangleIcon } from "./Icons";
import SafeImage from "./SafeImage";

export default function ProjectCard({ project, index, total }) {
  const reduce = useReducedMotion();
  const reversed = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const count = String(total).padStart(2, "0");
  const reveal = reduce
    ? { duration: 0.2 }
    : { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={reveal}
      className="relative flex flex-col justify-start overflow-hidden rounded-[32px] border border-white/20 bg-white/[0.04] px-4 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-3xl sm:px-10 sm:py-12 lg:min-h-[530px] lg:justify-center lg:px-14 lg:py-14"
    >
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: reversed ? 45 : -45 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ ...reveal, delay: reduce ? 0 : 0.1 }}
          className={`flex h-full flex-col justify-between space-y-6 lg:col-span-6 ${reversed ? "lg:order-2" : "lg:order-1"}`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-xl transition-transform hover:scale-105 hover:bg-white/20"
            >
              <GithubIcon className="h-4 w-4" />
              View on GitHub
            </a>
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold tracking-wider text-black uppercase shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-transform hover:scale-105"
              >
                <TriangleIcon className="h-3.5 w-3.5 shrink-0 text-black" />
                <span>Live Site</span>
                <ExternalIcon className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}
            <span className="ml-auto font-mono text-xs font-bold tracking-widest text-slate-400 uppercase">
              {number} / {count}
            </span>
          </div>
          <h3 className="text-[clamp(1.7rem,6vw,3rem)] font-bold tracking-tight text-balance text-white" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            {project.title}
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">{project.description}</p>
          {project.technologies?.length ? (
            <ul className="flex flex-wrap gap-2.5 pt-2">
              {project.technologies.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm backdrop-blur-lg"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ ...reveal, delay: reduce ? 0 : 0.15 }}
          className={`flex items-center justify-center lg:col-span-6 ${reversed ? "lg:order-1" : "lg:order-2"}`}
        >
          <a
            href={project.live || project.github}
            target="_blank"
            rel="noreferrer"
            className="group relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/[0.03] p-2 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl sm:p-3"
            aria-label={`${project.live ? "Open live site" : "View on GitHub"}: ${project.title}`}
          >
            <div className="flex items-center gap-1.5 rounded-t-xl border-b border-white/10 bg-white/[0.05] px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <SafeImage
              src={project.image}
              alt={`${project.title} preview`}
              label={project.title}
              className="h-auto w-full rounded-b-xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </a>
        </motion.div>
      </div>
    </motion.article>
  );
}
