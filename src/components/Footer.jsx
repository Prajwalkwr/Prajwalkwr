import { motion, useReducedMotion } from "framer-motion";
import { projects } from "../data/projects";
import { navItems, scrollToHash, site } from "../data/site";
import { ExternalIcon, GithubIcon, InstagramIcon, MailIcon, TriangleIcon } from "./Icons";

export default function Footer() {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  const columns = [
    {
      label: "Navigation",
      links: navItems.map((item) => ({ title: item.label, href: item.link })),
    },
    {
      label: "Work",
      links: projects.map((project) => ({
        title: project.title,
        href: project.live || project.github,
        external: true,
        icon: project.live ? TriangleIcon : GithubIcon,
      })),
    },
    {
      label: "Connect",
      links: [
        { title: "GitHub", href: site.github, external: true, icon: GithubIcon },
        { title: "Instagram", href: site.instagram, external: true, icon: InstagramIcon },
        { title: "Email", href: `mailto:${site.email}`, icon: MailIcon },
      ],
    },
  ];

  return (
    <footer
      className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center rounded-t-[2.5rem] border-t border-white/8 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.06),transparent)] px-6 py-14 lg:py-20"
      style={{ fontFamily: "'Josefin Sans', sans-serif" }}
    >
      <div className="absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-sm" />
      <div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-8">
        <Fade delay={0.05} reduce={reduce} className="space-y-5">
          <p className="text-3xl font-extrabold tracking-tight text-white">{site.brand}</p>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">
            {site.role} from {site.location}, learning web development by building practical software.
          </p>
          <p className="text-xs text-slate-600">
            © {year} {site.name}. All rights reserved.
          </p>
        </Fade>
        <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-2 xl:mt-0">
          {columns.map((column, index) => (
            <Fade key={column.label} delay={0.1 + index * 0.1} reduce={reduce}>
              <h2 className="mb-4 text-[0.65rem] font-bold tracking-[0.18em] text-slate-500 uppercase">{column.label}</h2>
              <ul className="space-y-2.5">
                {column.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        onClick={(event) => {
                          if (link.href.startsWith("#")) {
                            event.preventDefault();
                            scrollToHash(link.href);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                      >
                        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
                        {link.title}
                        {link.external && !Icon ? <ExternalIcon className="h-3.5 w-3.5" /> : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Fade>
          ))}
        </div>
      </div>
      <Fade
        delay={0.45}
        reduce={reduce}
        className="mt-14 flex w-full flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row"
      >
        <p className="text-xs text-slate-600">
          {site.role} • {site.location}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
          <span className="text-xs text-slate-500">Building projects</span>
        </div>
      </Fade>
    </footer>
  );
}

function Fade({ children, className, delay, reduce }) {
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}
