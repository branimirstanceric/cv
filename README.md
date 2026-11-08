# Branimir Stančerić: CV website

My personal CV and portfolio site: **https://branimirstanceric.github.io/cv/**

I'm an AI Project Manager and Delivery Manager with 10+ years in eCommerce and integrations, and more recently fintech, and I work AI-first. The site shows the projects I've worked on, what I did on each one, and the results.

## What's on the site

- **About:** a short introduction, how I work, and contact links.
- **Work:** all projects, with filters by area and a few highlighted ones.
- **Project pages:** the challenge, my role, what I did and the outcome for each project.
- **CV:** the current PDF, available to download.

## How it's built

- Plain HTML, CSS and JavaScript, with no framework and no build step.
- Hosted on **GitHub Pages**.
- Content lives in JSON files in `content/` and is edited through **[Pages CMS](https://pagescms.org)**, so text can change without touching code.
- Light and dark themes, a phone layout, and key text in the HTML for tools that don't run JavaScript.
- Cookie-free visitor statistics with **GoatCounter**.

## How it was made

I wrote the content and made the decisions on design, structure and wording. The code was written by **Claude Code** (Anthropic's AI coding assistant), working with me: I review the changes, commit them and manage the repository.

## Repository layout

| Path | What it holds |
|---|---|
| `index.html` | Home page |
| `work.html` | All projects |
| `case.html` | One template for every project page (`case.html?id=...`) |
| `content/` | Profile, capabilities, experience and project content |
| `assets/` | Images, logos and the CV PDF |
| `style.css`, `common.js` | Shared styles and scripts |
| `.pages.yml` | Pages CMS configuration |

## Contact

- Email: branimir.stanceric@gmail.com
- LinkedIn: https://www.linkedin.com/in/branimir-stanceric
