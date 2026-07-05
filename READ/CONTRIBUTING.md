# CONTRIBUTING — Evan Wallet Portfolio
## How to add work, update content, and deploy

---

## FOLDER STRUCTURE

```
evan-wallet-portfolio/
│
├── index.html                  ← Homepage
├── pages/
│   ├── work.html               ← Full portfolio page
│   ├── info.html               ← About / Info page
│   └── contact.html            ← Contact page
│
├── css/
│   ├── base.css                ← Tokens, reset, shared typography
│   ├── nav.css                 ← Navigation
│   ├── home.css                ← Homepage styles
│   ├── work.css                ← Work page styles
│   ├── info.css                ← Info page styles
│   └── contact.css             ← Contact page styles
│
├── js/
│   └── main.js                 ← All JavaScript (scroll, filter, nav)
│
└── assets/
    ├── fonts/
    │   ├── Vollkorn-Italic.woff2   ← Drop your font files here
    │   └── Vollkorn-Italic.woff
    └── images/
        ├── photography/            ← Full-size photography images
        ├── graphic-design/         ← Full-size design images
        ├── thumbnails/             ← Cropped thumbnails for homepage preview
        └── evan-portrait.jpg       ← Your portrait for the Info page
```

---

## ADDING NEW PHOTOGRAPHY

1. **Add your image file:**
   Place the JPG/PNG into `/assets/images/photography/`
   Name it sequentially: `photo-07.jpg`, `photo-08.jpg`, etc.

2. **Add it to `pages/work.html`:**
   Find the `<!-- ADD MORE PHOTOGRAPHY ITEMS HERE -->` comment
   and copy-paste this block above it:

```html
<a href="#" class="work-item" tabindex="0">
  <div class="work-item__img-wrap">
    <img src="../assets/images/photography/photo-07.jpg" alt="[Describe the photo]" loading="lazy" />
  </div>
  <div class="work-item__meta">
    <span class="work-item__title">Your Title Here</span>
    <span class="work-item__year">2025</span>
  </div>
</a>
```

3. **For the homepage preview:**
   Add a cropped thumbnail to `/assets/images/thumbnails/` and
   update one of the `work-grid--photo` items in `index.html`.

---

## ADDING NEW GRAPHIC DESIGN

Same process as photography but use `/assets/images/graphic-design/`
and find the `<!-- ADD MORE DESIGN ITEMS HERE -->` comment in `work.html`.

---

## ADDING YOUR Vollkorn FONT

1. Export `Vollkorn-Italic.woff2` and `Vollkorn-Italic.woff` from your font tool.
2. Drop both files into `/assets/fonts/`.
3. The font is already wired up in `css/base.css` — no other changes needed.

---

## UPDATING YOUR INFO PAGE

Open `pages/info.html` and fill in these sections:

- **Portrait photo** — Replace `../assets/images/evan-portrait.jpg`
- **Bio** — Edit the `<div class="info-bio">` paragraphs
- **Experience** — Duplicate `.experience-row` blocks for each role
- **Education** — Same pattern

---

## WIRING UP THE CONTACT FORM

The form in `pages/contact.html` needs a backend. Two easy free options:

### Option A: Formspree (recommended)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form and get your endpoint URL (looks like `https://formspree.io/f/xxxxxxxx`)
3. In `pages/contact.html`, update the form tag:
   ```html
   <form class="contact-form" id="contact-form" action="https://formspree.io/f/xxxxxxxx" method="POST">
   ```
4. Remove the `novalidate` attribute and the JavaScript timeout in `js/main.js`

### Option B: Netlify Forms
If deploying on Netlify, add `netlify` attribute to the form:
```html
<form class="contact-form" id="contact-form" netlify>
```

---

## UPDATING SOCIAL LINKS

Search the files for `https://instagram.com/` and `https://linkedin.com/`
and replace with your actual profile URLs. They appear in:
- `index.html` (nav + footer)
- `pages/work.html` (nav + footer)
- `pages/info.html` (nav + footer)
- `pages/contact.html` (nav + contact section + footer)

---

## DEPLOYING TO THE WEB

### Option A: Netlify (recommended — free, drag and drop)
1. Go to [netlify.com](https://netlify.com) and create a free account
2. Drag the entire `evan-wallet-portfolio/` folder onto the Netlify dashboard
3. Done. You get a live URL instantly.
4. To update: drag the folder again, or connect to GitHub (see below)

### Option B: GitHub Pages (free, git-based)
1. Create a GitHub repo
2. Push this folder to it: `git push origin main`
3. In repo Settings → Pages → Source: select `main` branch
4. Your site goes live at `https://yourusername.github.io/repo-name`

### Option C: Vercel (free, fast)
1. Push to GitHub first
2. Import the repo at [vercel.com](https://vercel.com)
3. Auto-deploys on every push

### Recommended git workflow for updates:
```bash
# After adding new work:
git add assets/images/photography/photo-07.jpg
git add pages/work.html
git commit -m "Add photo: [title]"
git push
# → Site auto-deploys if connected to Netlify/Vercel
```

---

## IMAGE TIPS

- **Format:** Use JPG for photos (quality 80–85%), PNG for design work with transparency
- **Size:** Aim for max 1200px wide for thumbnails, 2400px for full-size
- **Naming:** Lowercase, hyphens only — `photo-concert-07.jpg` not `Photo Concert 07.jpg`
- **Optimization:** Run images through [squoosh.app](https://squoosh.app) before uploading to keep load times fast

---

## CUSTOMIZING COLORS / FONTS

All design tokens live in `css/base.css` under `:root { }`.
Change a value there and it updates everywhere:

```css
:root {
  --color-bg:     #000000;   /* page background */
  --color-text:   #ffffff;   /* primary text */
  --color-muted:  #888888;   /* secondary / nav links */
}
```
