export const site = {
  name: "Prajwal Kunwor",
  brand: "PRAJWAL",
  role: "BIM Student",
  email: "prajwalkwr567@gmail.com",
  phoneDisplay: "98617639879",
  phoneTel: "+97798617639879",
  location: "Kathmandu, Nepal",
  github: "https://github.com/Prajwalkwr",
  githubLabel: "Prajwalkwr",
  instagram: "https://www.instagram.com/prajwal_kunwor/",
  instagramLabel: "@prajwal_kunwor",
  maps: "https://www.google.com/maps/search/?api=1&query=Kathmandu%2C%20Nepal",
};

export const navItems = [
  { label: "Home", ariaLabel: "Go to the top of the page", link: "#hero" },
  { label: "About", ariaLabel: "About Prajwal Kunwor", link: "#about" },
  { label: "Projects", ariaLabel: "View selected projects", link: "#projects" },
  { label: "Contact", ariaLabel: "Get in touch", link: "#contact" },
];

export const socialItems = [
  { label: "Instagram", link: site.instagram },
  { label: "GitHub", link: site.github },
];

export function scrollToHash(hash) {
  const id = hash.replace("#", "");
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
}
