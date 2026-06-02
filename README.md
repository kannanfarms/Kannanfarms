# Kannan Farms — React Application

Premium React.js e-commerce application for Kannan Farms natural products.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3 | UI framework |
| **Vite** | 5.3 | Build tool & dev server |
| **React Router** | 6 | Client-side routing (clean URLs) |
| **Framer Motion** | 11 | Animations & 3D tilt effects |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **react-helmet-async** | 2.0 | SEO meta tags & Open Graph |

---

## Project Structure

```
kannan-farms/
├── public/
│   ├── assets/              ← Place all PNG images here
│   │   ├── Logowoback.png
│   │   ├── Banana 1.png … Banana 4.png
│   │   └── Moringa 1.png … Moinga 4.png
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       ← Sticky header with scroll transitions + mobile drawer
│   │   ├── Footer.jsx       ← Full footer with trust strip
│   │   ├── Hero.jsx         ← Animated hero with blob backgrounds
│   │   ├── ProductCard.jsx  ← 3D tilt card with Framer Motion
│   │   ├── StatsBar.jsx     ← Animated counters
│   │   ├── Reveal.jsx       ← Scroll-reveal wrapper
│   │   ├── SEOHead.jsx      ← Helmet SEO + JSON-LD structured data
│   │   └── ScrollToTop.jsx  ← Reset scroll on navigation
│   │
│   ├── pages/
│   │   ├── Home.jsx         ← Full homepage
│   │   ├── ProductDetail.jsx← Gallery + add-to-cart + rich content
│   │   ├── Cart.jsx         ← Cart management with localStorage
│   │   └── NotFound.jsx     ← 404 page
│   │
│   ├── data/
│   │   └── products.js      ← Single source of truth for all product data
│   │
│   ├── hooks/
│   │   ├── useScrollY.js    ← Scroll position & direction tracking
│   │   └── useInView.js     ← IntersectionObserver hook for reveal effects
│   │
│   ├── App.jsx              ← Router + layout wrapper
│   ├── main.jsx             ← ReactDOM entry
│   └── index.css            ← Tailwind + global CSS variables
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Copy your images
```bash
# From your KannanFarms-main folder:
cp "KannanFarms-main/Banana 1.png"    public/assets/
cp "KannanFarms-main/Banana 2.png"    public/assets/
cp "KannanFarms-main/Banana 3.png"    public/assets/
cp "KannanFarms-main/Banana 4.png"    public/assets/
cp "KannanFarms-main/Moringa 1.png"   public/assets/
cp "KannanFarms-main/Moringa 2.png"   public/assets/
cp "KannanFarms-main/Moringa 3.png"   public/assets/
cp "KannanFarms-main/Moinga 4.png"    public/assets/
cp "KannanFarms-main/Logowoback.png"  public/assets/
cp "KannanFarms-main/favicon.ico"     public/
```

### 3. Start development server
```bash
npm run dev
# Opens at http://localhost:3000
```

### 4. Build for production
```bash
npm run build
# Output in /dist — deploy to Netlify, Vercel, or any static host
```

---

## URL Routes (Clean — No .html)

| URL | Page |
|---|---|
| `/` | Homepage |
| `/product/banana-powder` | Banana Powder detail page |
| `/product/moringa-powder` | Moringa Powder detail page |
| `/cart` | Shopping cart |
| `/banana.html` | 301 redirect → `/product/banana-powder` |
| `/moringa.html` | 301 redirect → `/product/moringa-powder` |
| `/cart.html` | 301 redirect → `/cart` |
| `/index.html` | 301 redirect → `/` |

---

## Key Features

### 🎨 Premium UI
- **Playfair Display** (headings) + **DM Sans** (body) — luxury typography pairing
- Color palette: Dark Green `#0F5C32`, Vivid Green `#22A85C`, Off-White `#F7FDF4`
- Responsive across 320px mobile → 1920px ultra-wide
- Custom scrollbar, noise texture overlays, gradient mesh blobs

### ✨ Animations
- **3D tilt effect** on product cards using Framer Motion `useMotionValue` + springs
- **Glare overlay** that follows cursor on product cards
- **Hero blobs** pulsing with staggered Framer Motion animations
- **Scroll-reveal** — all sections fade up on scroll via `whileInView`
- **Navbar** hides on scroll-down, reveals on scroll-up with spring transition
- **Gallery fade** — `AnimatePresence` on product images for silky transitions
- **Counter animations** — smooth number counting on stats entry

### 🔍 SEO Infrastructure
- `react-helmet-async` — injects per-page `<title>`, `<meta>`, Open Graph tags
- **JSON-LD structured data** (`schema.org/Product`) on all product pages
- Canonical URLs, Twitter Card, og:image on every route
- Rich product descriptions with keywords for Google indexing

### 🛒 Cart
- Persistent via `localStorage` with custom event bus (`kf_cart_update`)
- Cart badge auto-updates in Navbar
- Quantity controls with animated state changes

---

## Deployment (Netlify / Vercel)

Add a rewrite rule so React Router handles all paths:

**Netlify** — `public/_redirects`:
```
/*  /index.html  200
```

**Vercel** — `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Adding New Products

Edit `src/data/products.js` — add a new object to the `PRODUCTS` array with the same shape as existing entries. The product card, detail page, SEO, and structured data all derive from this single source automatically.

---

© 2024 Kannan Farms. All rights reserved.
