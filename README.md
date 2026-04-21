# Shahzad Ali — Personal Portfolio

**Live site (once deployed):** [https://alishahzi.github.io/](https://alishahzi.github.io/)

A research and academic portfolio for **Shahzad Ali**, PhD Researcher in Data Science &
Computation at the Alma Mater Studiorum Università di Bologna and IRCCS Ospedale
Policlinico San Martino, Genova. Focus areas: Graph Neural Networks, deep learning, and
multimodal neuroimaging for Alzheimer's disease diagnosis and interpretable clinical AI.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Framework   | React 18 + TypeScript                   |
| Build       | Vite 5                                  |
| Styling     | Tailwind CSS 3                          |
| Animation   | Framer Motion 11                        |
| Icons       | Lucide React                            |
| Deployment  | GitHub Pages via GitHub Actions         |
| Fonts       | Space Grotesk · Inter · JetBrains Mono  |

---

## Local Development

### Prerequisites
- Node.js 18 or later
- npm 9 or later
- Git

### Setup & Run

```bash
# 1. Clone the repository
git clone https://github.com/alishahzi/alishahzi.github.io.git
cd alishahzi.github.io

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The site will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

Output goes to `./dist/`. Preview locally:

```bash
npm run preview
```

---

## Deploying to GitHub Pages — Step by Step

The whole site is configured as a **GitHub user site** at
`https://alishahzi.github.io/`, served from the `gh-pages` branch.

### Step 1 — Create the GitHub repository

1. Sign in at [github.com](https://github.com) as **alishahzi**.
2. Click the green **New** button (top-left) or open
   [https://github.com/new](https://github.com/new).
3. Set the repository name **exactly** to:

   ```
   alishahzi.github.io
   ```

   This exact name is what tells GitHub Pages to serve it as a user site.
4. Keep it **Public**.
5. Do NOT initialize with a README, .gitignore, or license (the local project
   already contains them).
6. Click **Create repository**.

### Step 2 — Push this project from your computer

Open a terminal inside this folder (the one containing `package.json`) and run:

```bash
# One-time setup
git init
git add .
git commit -m "feat: initial portfolio deployment"
git branch -M main
git remote add origin https://github.com/alishahzi/alishahzi.github.io.git

# Push
git push -u origin main
```

If Git asks for your credentials, use a
[Personal Access Token](https://github.com/settings/tokens) (classic, with the
`repo` scope) as the password when prompted.

### Step 3 — Enable GitHub Pages

1. Go to the repository on GitHub →
   `https://github.com/alishahzi/alishahzi.github.io`.
2. Click **Settings** → **Pages** (left sidebar).
3. Under **Build and deployment → Source**, pick **Deploy from a branch**.
4. Under **Branch**, select **`gh-pages`** and folder **/(root)** and click
   **Save**.

   The `gh-pages` branch is created automatically by the GitHub Actions workflow
   included in `.github/workflows/deploy.yml`. If it does not exist yet, run the
   workflow once first — see Step 4.

### Step 4 — Watch the deployment

Every push to `main` triggers the workflow in
`.github/workflows/deploy.yml`, which builds the Vite project and pushes the
compiled site to the `gh-pages` branch.

1. Open the **Actions** tab on the repository.
2. Find the **Deploy Portfolio to GitHub Pages** workflow.
3. Wait for the green tick.
4. Visit [https://alishahzi.github.io/](https://alishahzi.github.io/).

You can also run the workflow manually from the Actions tab via the
**Run workflow** button.

---

## Updating Content

All text content lives in a single file — edit it, commit, push, and the site
updates automatically:

```
src/data/content.ts
```

This file contains:

- `personal` — name, title, contact details, profile links, photo/CV paths
- `stats` — the four headline numbers (papers, certifications, etc.)
- `researchFocus` — research-area cards
- `experience` — PhD position, lectureship, research assistantship
- `education` — PhD, MSc, BSc entries
- `publications` — journals, working papers, conferences
- `projects` — project cards
- `skills` — programming, AI/ML, neuroimaging tools, domain tags
- `awards` — scholarships, grants, project awards
- `peerReview` — journals you have reviewed for
- `professionalDevelopment` — summer schools, seminars, Coursera certifications

### Adding a new publication

Open `src/data/content.ts`, find `publications.journalsPublished`, and add an
entry following this shape:

```typescript
{
  id: 'J5',
  authors: 'Shahzad Ali, ...',
  title: 'Your Paper Title.',
  venue: 'Journal Name',
  year: 2026,
  status: 'Published',
  if: 4.2,                    // optional impact factor
  doi: '10.xxxx/xxxxx',       // optional DOI
}
```

### Updating personal details or links

Edit the `personal` object at the top of `src/data/content.ts`.

---

## Replacing the Profile Photo and CV

- **Profile photo:** replace `public/profile.png` with your new image
  (keep the same filename or edit `personal.image` in `src/data/content.ts`).
- **CV PDF:** replace `public/cv/CV_Shahzad.pdf` with an updated version
  (keep the same filename or edit `personal.cvUrl`).

---

## Using Your Own Custom Domain (optional)

1. Create a file `public/CNAME` containing your domain (one line):

   ```
   www.yourdomain.com
   ```

2. In your domain registrar, add a CNAME DNS record pointing `www` to
   `alishahzi.github.io`.
3. In GitHub → Settings → Pages → enter your custom domain and tick
   **Enforce HTTPS**.
4. Push the change and wait for DNS to propagate (up to ~24 hours).

---

## Project Structure

```
alishahzi.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml           ← GitHub Actions deployment
├── public/
│   ├── favicon.svg              ← site icon
│   ├── profile.png              ← your headshot
│   └── cv/
│       └── CV_Shahzad.pdf       ← your CV (swap with updated versions)
├── src/
│   ├── components/              ← Navbar, Hero, About, Education, ...
│   ├── data/
│   │   └── content.ts           ← ⭐ edit this file to update any section
│   ├── App.tsx                  ← root component + section order
│   ├── main.tsx                 ← entry point
│   └── index.css                ← Tailwind + custom styles
├── index.html                    ← SEO metadata, fonts, root div
├── package.json
├── vite.config.ts                ← base path for GitHub Pages
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## License

© 2024–2026 Shahzad Ali. All rights reserved.

The source code structure (excluding personal content) was adapted from a
public portfolio template and may be re-used for personal portfolio purposes.
