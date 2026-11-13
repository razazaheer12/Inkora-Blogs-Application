# 🖋️ Inkora — Blogs Application

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=white" alt="EJS" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Frontend-V2-a8452b?style=for-the-badge" alt="Frontend V2" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <strong>Inkora</strong> is a local-first personal blog built with <strong>Node.js</strong>, <strong>Express 5</strong> and <strong>EJS 5</strong>.
  <br />
  Frontend minimal UI with a full editorial-magazine design system:
  <br />
  warm ink-on-paper palette, Fraunces display type, dark mode, search, topics and dedicated post pages.
</p>

## 🚀 Live Demo

Check out : [Inkora Blog Application](https://inkora-blogs.vercel.app/)

---

## ✨ What is new in Frontend V2

### Design
- 🎨 **Editorial design system** — every colour, radius, shadow and font is a CSS custom property in one token block, so the whole look can be re-themed from a single place
- 🌗 **Dark & light themes** — a real re-token of the palette (not an inversion), persisted to `localStorage`, seeded from `prefers-color-scheme` before first paint so there is no flash
- 🔤 **Three-family type system** — Fraunces for display headings (with optical sizing and the WONK axis enabled), Newsreader for long-form body copy at a 68-character measure, Inter for interface chrome
- 📰 **Magazine details** — drop cap on the opening paragraph, numbered feed entries, kicker rules, a fleuron ornament, and a faint paper grain over the whole page
- 📱 **Responsive down to 360px** — collapsing drawer navigation, single-column feed, and fluid `clamp()` type throughout
- ♿ **Accessible** — skip link, `aria-current` on the active nav item, `aria-pressed` on topic filters, visible focus rings, labelled controls and a full `prefers-reduced-motion` guard

### Features
- 📄 **Dedicated post pages** (`/posts/:id`) with byline, word count, reading time and revision stamp
- 🧭 **Reading progress bar** that tracks scroll position while reading an entry
- 🔍 **Full-text search** across titles, bodies and topics — press `/` anywhere to jump to the search field
- 🏷️ **Topics & tag rail** — filter the feed by topic with live post counts
- 🔗 **Related entries** — tag-matched first, most recent as a fallback
- 📝 **Better editor** — large serif title field, topic input, live word/reading-time counter, and a separated danger zone on the edit page
- 🫙 **Honest empty states** — distinct messaging for "nothing published yet" versus "nothing matches that search"
- 🚧 **Custom 404 page** for unknown routes and deleted posts
- 🌱 **Seeded content** — three sample essays so the journal is never blank on first run

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime (ES modules) |
| **Express 5** | Routing, middleware and static serving |
| **EJS 5** | Server-side templating with shared partials |
| **body-parser** | Parsing URL-encoded form submissions |
| **CSS3** | Hand-written design system — custom properties, grid, `color-mix()`, container-free fluid type |
| **Vanilla JS** | Theme toggle, drawer nav, reading progress, editor counters — zero dependencies |

---

## 📁 Project Structure

```
Inkora-Blogs-Application/
├── index.js                 # Server, routes, post model and template helpers
├── package.json             # Metadata, scripts and dependencies
├── package-lock.json        # Dependency lock file
├── .gitignore               # node_modules, env files, editor/OS cruft
├── public/
│   ├── styles.css           # Inkora V2 design system (tokens → components → responsive)
│   ├── app.js               # Progressive enhancement, no dependencies
│   └── favicon.svg          # Ink-drop brand mark
└── views/
    ├── index.ejs            # Home — hero, search, tag rail and feed
    ├── post.ejs             # Post detail — drop cap, actions, related entries
    ├── create.ejs           # Compose a new entry
    ├── edit.ejs             # Revise an entry + danger zone
    ├── about.ejs            # About the journal with live stats and colophon
    ├── 404.ejs              # Not found
    └── partials/
        ├── header.ejs       # <head>, theme bootstrap, masthead and navigation
        └── footer.ejs       # Colophon footer and script tag
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher (`node --watch` is used by the dev script)
- A code editor like [VS Code](https://code.visualstudio.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/razazaheer12/Inkora-Blogs-Application.git
   cd Inkora-Blogs-Application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```
   Or with auto-restart on file changes:
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```
   The port can be overridden with `PORT=4000 npm start`.

---

## 🌐 Application Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Home — hero, search, tag rail and the post feed |
| `GET` | `/?q=term` | Search titles, bodies and topics |
| `GET` | `/?tag=topic` | Filter the feed by topic |
| `GET` | `/posts/:id` | Read a single entry |
| `GET` | `/about` | About the journal, live stats and colophon |
| `GET` | `/create` | Compose form |
| `POST` | `/create` | Publish a new entry, then redirect to it |
| `GET` | `/edit/:id` | Revision form |
| `POST` | `/edit/:id` | Save changes and stamp the revision date |
| `POST` | `/delete/:id` | Delete an entry, then redirect home |
| `*` | anything else | Custom 404 page |

---

## 🎯 Key Highlights

- **In-memory storage, stated honestly** — posts live in a plain array; the compose page says so, and the three seeded essays return after a restart. No database to configure.
- **Template helpers over view logic** — `readingTime()`, `excerpt()`, `paragraphs()` and `formatDate()` are registered as EJS locals, so the views stay declarative.
- **Escaped by default** — every piece of user content is rendered with `<%= %>`, so titles, bodies and topics cannot inject markup. Topic input is additionally normalised to lowercase slugs and capped at five.
- **Graceful failure paths** — unknown or deleted post IDs render the 404 page with a real status code, and empty form submissions redirect back rather than crashing on `undefined`.
- **No build step** — plain CSS and plain JavaScript served straight from `public/`. What is in the repository is what runs.

---

## 🧪 Manual Test Plan

1. `npm start`, then open <http://localhost:3000> — three seeded entries appear, the newest as a large featured entry.
2. Click the theme toggle in the masthead, then reload. The choice persists with no flash of the wrong theme.
3. Press `/` on the home page — focus jumps to search. Type `draft` and submit; only the matching entry remains. Clear the search with the `×` button.
4. Click a topic chip (for example `design`) — the feed filters and the chip shows as pressed. Click `all` to reset.
5. Open any entry. Scroll: the progress rule at the very top fills. Check the drop cap, the word count and the related entries at the bottom.
6. Click **New post**, fill the title, topics (`writing, craft`) and body. Watch the live word counter. Publish — you land on the new entry's page.
7. Click **Edit**, change the body, save. The entry now shows a `revised` date in its metadata.
8. Click **Delete** — a confirmation dialog appears first. The entry disappears from the feed, and its old URL now returns the 404 page.
9. Resize the window below 760px — the nav collapses into a drawer; open and close it, then press `Escape`.
10. Visit <http://localhost:3000/does-not-exist> — the custom 404 page renders.

---

## 📸 Screenshots

> _Inkora V2 screenshots coming soon — run the project locally to see the editorial UI._

### V1 interface (archive)

<img width="947" height="407" alt="V1 home page" src="https://github.com/user-attachments/assets/77cc9fc7-c47b-43a0-9e81-a24130427dba" />

> 1. Home page with post listings
> <img width="949" height="407" alt="V1 home listings" src="https://github.com/user-attachments/assets/2b35673e-b58b-431f-b0e2-f9fbb37161de" />
> 2. Create post form
> <img width="950" height="411" alt="V1 create form" src="https://github.com/user-attachments/assets/7acb7bc2-fd05-485d-aaf5-f36a6c223b64" />
> 3. Edit post form
<img width="950" height="412" alt="V1 edit form" src="https://github.com/user-attachments/assets/7cfd79df-239b-40c1-8686-6b9279198c46" />

---

## 🔮 Future Enhancements

- [ ] Persist posts to a JSON file or MongoDB so they survive restarts
- [ ] Add user authentication & sessions
- [x] Implement post categories and tags
- [ ] Add a rich-text or Markdown editor with live preview
- [ ] Deploy Frontend V2 to Vercel / Render / Railway
- [ ] Add pagination for large post collections
- [x] Dark mode toggle
- [ ] RSS feed and per-post canonical URLs / Open Graph images
- [ ] Draft state and scheduled publishing

---

## 🤝 Contributing

Contributions are always welcome! If you have ideas for improvements or find any issues, feel free to:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**. See the [package.json](package.json) for more details.

---

## 👨‍💻 Author

Built with ❤️ by **Raza**  
📧 GitHub: [@razazaheer12](https://github.com/razazaheer12)

---

<p align="center">
  ⭐ Star this repo if you found it helpful!
</p>
