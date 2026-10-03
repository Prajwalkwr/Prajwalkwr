import { useCallback, useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import WorkRail from "./components/WorkRail";

export default function App() {
  const [ready, setReady] = useState(false);
  const reveal = useCallback(() => setReady(true), []);

  return (
    <ErrorBoundary>
      <a className="skip-link" href="#hero">
        Skip to content
      </a>
      <Loader onComplete={reveal} />
      <Navbar />
      <main className={ready ? "opacity-100" : "opacity-0"} style={{ transition: "opacity 0.6s ease" }}>
        <Hero ready={ready} />
        <About />
        <WorkRail />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
