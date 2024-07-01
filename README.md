# Brainstory

Think out loud! 🧠

## Getting Started

1. Clone the repo, navigate into it
2. `npm install`
3. `npm run dev`
4. Create a `.env.development` file at the top level and populate it with this:

```bash
PUBLIC_API_URL=<Your API URL>
```

> [!IMPORTANT]  
> Look through the repository for all instances of the URL `brainstory.ai`. You will want to remove and/or replace those with your own URL (or, if you're hosting on your local machine, with localhost).

## Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |
