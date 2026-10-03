import { Component } from "react";
import { site } from "../data/site";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center bg-black px-6 text-center text-white">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="text-slate-400">The page could not finish rendering. You can still reach Prajwal directly.</p>
          <a className="inline-flex rounded-full bg-white px-5 py-2 font-semibold text-black" href={`mailto:${site.email}`}>
            Email {site.email}
          </a>
        </div>
      </main>
    );
  }
}
