# Prajwal Kunwor

Live site: [https://prajwalkwr.vercel.app](https://prajwalkwr.vercel.app)

Personal portfolio for Prajwal Kunwor, a BIM student in Kathmandu. The interface follows the structure of the referenced motion portfolio: loading stairs, staggered menu, particle hero, project panels, and a contact form that opens the visitor’s email app.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

The production build is a static site in `dist/` and can be deployed as-is.

## Add a project

Edit `src/data/projects.js` and append one object:

```js
{
  title: "Project name",
  description: "What the project does.",
  github: "https://github.com/Prajwalkwr/repo",
  live: null,
  image: "/projects/preview.svg",
  technologies: ["React"]
}
```

Use a real `live` URL only when the project is actually online. Put the image in `public/projects/`.
