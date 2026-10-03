import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import SplitText from "./SplitText";

export default function Projects() {
  const list = Array.isArray(projects) ? projects.filter((project) => project?.title && project?.github) : [];

  return (
    <section id="projects" className="relative z-10 w-full bg-black py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        <div className="mb-16 text-center sm:mb-24">
          <SplitText
            text="SELECTED PROJECTS"
            as="h2"
            delay={40}
            duration={0.65}
            className="mb-4 text-[clamp(1.7rem,6.5vw,4.5rem)] font-extrabold tracking-tight text-[#EAE6E1] uppercase"
          />
          <p
            className="mx-auto max-w-2xl text-xs leading-relaxed font-bold tracking-[0.16em] text-[#C4C4C8] uppercase sm:text-sm sm:tracking-[0.2em]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Practical web and software projects built while learning modern development.
          </p>
        </div>

        {list.length ? (
          <div className="flex flex-col gap-8 sm:gap-10">
            {list.map((project, index) => (
              <ProjectCard key={project.github} project={project} index={index} total={list.length} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">Projects will appear here once they are added.</p>
        )}
      </div>
    </section>
  );
}
