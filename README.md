# Portfolio — Rojesh Pradhananga

A dark luxury editorial portfolio built with **React + Vite**.

## ✦ Features

- Smooth scroll-triggered reveal animations (IntersectionObserver)
- Slow cinematic image entrance in the hero (clip-path animation)
- Image parallax on scroll
- Custom gold cursor with smooth ring lag
- Responsive — works beautifully on mobile
- Navbar that transitions on scroll
- Contact form (ready to wire to Formspree / EmailJS)

---

## ✦ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Add your photo
# Drop your photo as:
#   src/assets/profile.jpg
# The hero will automatically use it.
# (PNG / WebP also work — just update the src in Hero.jsx)

# 3. Start dev server
npm run dev

# 4. Build for production
npm run build
```

---

## ✦ Folder Structure

```
portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── profile.jpg        ← YOUR PHOTO HERE
│   ├── components/
│   │   ├── Cursor.jsx          Custom animated cursor
│   │   ├── Cursor.module.css
│   │   ├── Navbar.jsx          Sticky nav with scroll effect
│   │   ├── Navbar.module.css
│   │   ├── Hero.jsx            Full-screen hero with your image
│   │   ├── Hero.module.css
│   │   ├── About.jsx           About section with stats
│   │   ├── About.module.css
│   │   ├── Work.jsx            Project cards grid
│   │   ├── Work.module.css
│   │   ├── Services.jsx        Services grid
│   │   ├── Services.module.css
│   │   ├── Testimonial.jsx     Client quotes
│   │   ├── Testimonial.module.css
│   │   ├── Contact.jsx         Contact form
│   │   ├── Contact.module.css
│   │   ├── Footer.jsx
│   │   └── Footer.module.css
│   ├── hooks/
│   │   └── useReveal.js        Scroll reveal hook
│   ├── App.jsx
│   ├── index.css               Global styles & CSS variables
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## ✦ Customisation

### Personal Info
Edit text content directly in each component file.

### Your Photo
Place at `src/assets/profile.jpg`. The hero uses a cinematic slow reveal:
- Clip-path animation sweeps in from right
- Then image slowly de-saturates from B&W to color
- Parallax effect on scroll

### Colors
All design tokens live in `src/index.css` under `:root {}`:
```css
--gold: #c9a84c;
--ink: #0d0d0d;
--paper: #f5f0e8;
```

### Projects
Edit the `projects` array in `src/components/Work.jsx`.

### Contact Form
The form in `Contact.jsx` fires `handleSubmit`. Wire it to:
- **Formspree**: `fetch('https://formspree.io/f/YOUR_ID', ...)`
- **EmailJS**: `emailjs.send(...)`
- Your own backend endpoint

---

## ✦ Tech Stack

- React 18
- Vite 5
- CSS Modules
- Google Fonts (Cormorant Garamond + DM Mono)
- IntersectionObserver (no GSAP dependency needed)
