import { useState } from "react";
import { site } from "../data/site";
import { GithubIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, PlusIcon, SendIcon } from "./Icons";
import SplitText from "./SplitText";

const initial = { name: "", email: "", phone: "", message: "" };

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function Contact() {
  const [fields, setFields] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");

  const update = (key) => (event) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const next = {};
    if (!fields.name.trim()) next.name = "Please enter your name.";
    if (!isEmail(fields.email.trim())) next.email = "Please enter a valid email address.";
    if (fields.phone.trim() && !/^[0-9+\-\s()]{7,20}$/.test(fields.phone.trim())) {
      next.phone = "Please enter a valid phone number.";
    }
    if (fields.message.trim().length < 8) next.message = "Please write a short message.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("error");
      setNotice("Check the highlighted fields, then try again.");
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${fields.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${fields.name.trim()}\nEmail: ${fields.email.trim()}\nPhone: ${fields.phone.trim() || "Not provided"}\n\n${fields.message.trim()}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("success");
    setNotice("Your email app should open with this message. If it does not, use the email address below.");
    setFields(initial);
  };

  const details = [
    { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: MailIcon },
    { label: "Phone", value: site.phoneDisplay, href: `tel:${site.phoneTel}`, icon: PhoneIcon },
    { label: "Address", value: site.location, href: site.maps, icon: PinIcon, external: true },
    { label: "GitHub", value: site.githubLabel, href: site.github, icon: GithubIcon, external: true },
    { label: "Instagram", value: site.instagramLabel, href: site.instagram, icon: InstagramIcon, external: true },
  ];

  return (
    <section id="contact" className="relative z-10 w-full bg-black py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="mb-14 text-center sm:mb-20">
          <SplitText
            text="LET'S CONNECT"
            delay={40}
            duration={0.65}
            className="mb-4 text-[clamp(1.8rem,7vw,4.5rem)] font-extrabold tracking-tight text-[#EAE6E1] uppercase"
          />
          <p
            className="mx-auto max-w-xl text-xs leading-relaxed font-bold tracking-[0.16em] text-[#C4C4C8] uppercase sm:text-sm sm:tracking-[0.2em]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Have an idea or a project in mind? Reach out and let’s build something useful together.
          </p>
        </div>

        <div className="relative grid h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-2xl md:grid-cols-2 lg:grid-cols-3">
          <PlusIcon className="absolute -top-3 -left-3 h-6 w-6 text-white/40" />
          <PlusIcon className="absolute -top-3 -right-3 h-6 w-6 text-white/40" />
          <PlusIcon className="absolute -bottom-3 -left-3 h-6 w-6 text-white/40" />
          <PlusIcon className="absolute -right-3 -bottom-3 h-6 w-6 text-white/40" />

          <div className="flex flex-col justify-between lg:col-span-2">
            <div className="space-y-4 px-4 py-8 md:p-8">
              <p className="text-sm tracking-[0.18em] text-[#FFB6C1] uppercase">{site.name}</p>
              <h3 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">Get in touch</h3>
              <p className="max-w-xl text-sm text-slate-400 md:text-base lg:text-lg">
                {site.role} in {site.location}. Send a message and it will open in your email app, addressed to Prajwal.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {details.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      className="flex items-center gap-3 rounded-xl py-3 pr-2 transition-colors hover:text-[#FFB6C1]"
                    >
                      <span className="rounded-lg bg-white/5 p-3 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-medium text-white">{item.label}</span>
                        <span className="block text-xs break-all text-slate-400">{item.value}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex h-full w-full items-center border-t border-white/10 bg-white/[0.02] p-5 md:border-t-0 md:border-l">
            <form className="w-full space-y-4" onSubmit={onSubmit} noValidate>
              <Field id="name" label="Name" value={fields.name} onChange={update("name")} error={errors.name} placeholder="Your name" required />
              <Field id="email" label="Email" type="email" value={fields.email} onChange={update("email")} error={errors.email} placeholder="you@email.com" required />
              <Field id="phone" label="Phone" type="tel" value={fields.phone} onChange={update("phone")} error={errors.phone} placeholder="Optional" />
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-200">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={fields.message}
                  onChange={update("message")}
                  placeholder="Tell Prajwal about your project..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className="min-h-28 w-full resize-none rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-[#FFB6C1]"
                />
                {errors.message ? (
                  <p id="message-error" className="text-xs text-red-300">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <div aria-live="polite">
                {status === "error" && notice ? (
                  <p className="rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-200">{notice}</p>
                ) : null}
                {status === "success" && notice ? (
                  <p className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-sm text-emerald-100">{notice}</p>
                ) : null}
              </div>
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white py-3 font-semibold tracking-wide text-black shadow-lg transition-colors duration-300 hover:bg-slate-200"
              >
                <span>Submit</span>
                <SendIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, error, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-[#FFB6C1]"
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
