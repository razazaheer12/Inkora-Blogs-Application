import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const SITE = {
  name: "Inkora",
  tagline: "A quiet place for loud ideas.",
  description:
    "Inkora is a local-first personal blog for essays on writing, design and the craft of building things.",
};

app.locals.site = SITE;
app.locals.currentYear = new Date().getFullYear();
app.locals.formatDate = formatDate;
app.locals.readingTime = readingTime;
app.locals.excerpt = excerpt;
app.locals.paragraphs = paragraphs;

let idCounter = 0;
const nextId = () => String(++idCounter);

let posts = [
  {
    id: nextId(),
    title: "Why the first draft is allowed to be bad",
    content: `Every writer I know has the same enemy, and it is not the blank page. It is the expectation that the first sentence should arrive fully formed, wearing a suit, knowing exactly where it is going.

The first draft is not a performance. It is a search party. You write badly on purpose so that you can find out what you actually think, because thinking on the page is a different act than thinking in your head. In your head an idea feels complete. Written down, it shows you the holes.

So let the draft be crooked. Let it repeat itself, overexplain, and lose the thread in paragraph four. You are not building the house yet. You are walking the property line with a stick, marking where the walls might go.

Revision is where the craft lives. It is the part that feels like work and reads like ease. Nobody has ever complimented a writer on the version that came out first.`,
    tags: ["writing", "craft"],
    createdAt: "2026-11-02T09:24:00.000Z",
    updatedAt: "2026-11-02T09:24:00.000Z",
  },
  {
    id: nextId(),
    title: "The interface is the argument",
    content: `A design is never neutral. The moment you choose what sits at the top of the screen, you have made a claim about what matters, and the reader will absorb that claim long before they read a word of your copy.

This is why redesigns feel emotional. You are not rearranging furniture, you are renegotiating priorities. Whitespace says "one thing at a time". A dense grid says "compare everything". A serif headline says "slow down and read", and it is not a decoration, it is an instruction delivered at the speed of light.

The useful question is not "does this look good" but "what is this layout asking the person to do, and is that what I meant to ask". When the answer is honest, the styling takes care of itself.

Good typography is not beauty applied afterwards. It is the argument, made visible.`,
    tags: ["design", "typography"],
    createdAt: "2026-11-07T14:05:00.000Z",
    updatedAt: "2026-11-07T14:05:00.000Z",
  },
  {
    id: nextId(),
    title: "Notes on building small, local-first tools",
    content: `There is a particular joy in software that runs on your own machine and asks nothing of you. No account, no dashboard, no monthly email about a plan you never chose. You start it, it is there, you close it, it is gone.

Local-first is not a rejection of the cloud. It is a decision about where the weight sits. A tool that keeps its state in memory and its whole source in one file can be understood in an afternoon, and being understood is a feature. You can trust what you can read.

The trade is honesty about durability. If the process exits, the state exits with it, and the interface should never pretend otherwise. Say it plainly, save often if it matters, and do not build a castle on a foundation you have not poured.

Small is not a stage you graduate from. For a lot of the things worth making, small is the finished form.`,
    tags: ["engineering", "local-first"],
    createdAt: "2026-11-11T18:40:00.000Z",
    updatedAt: "2026-11-11T18:40:00.000Z",
  },
];

function readingTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function excerpt(content, length = 170) {
  const flat = content.replace(/\s+/g, " ").trim();
  if (flat.length <= length) return flat;
  return flat.slice(0, flat.lastIndexOf(" ", length)).replace(/[,.;:]$/, "") + "…";
}

function paragraphs(content) {
  return content
    .split(/\n\s*\n/)
    .map(p => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function parseTags(input) {
  if (!input) return [];
  return [...new Set(
    input
      .split(",")
      .map(tag => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .map(tag => tag.replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-").replace(/^-|-$/g, ""))
      .filter(Boolean)
  )].slice(0, 5);
}

function tagIndex() {
  const counts = new Map();
  posts.forEach(post =>
    post.tags.forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1))
  );
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

function findPost(id) {
  return posts.find(post => post.id === String(id));
}

function notFound(res, message) {
  res.status(404).render("404", { title: "Page not found", message });
}

app.use((req, res, next) => {
  res.locals.path = req.path;
  res.locals.showProgress = false;
  next();
});

app.get("/", (req, res) => {
  const query = (req.query.q || "").trim();
  const activeTag = (req.query.tag || "").trim().toLowerCase();

  let results = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (activeTag) {
    results = results.filter(post => post.tags.includes(activeTag));
  }

  if (query) {
    const needle = query.toLowerCase();
    results = results.filter(post =>
      post.title.toLowerCase().includes(needle) ||
      post.content.toLowerCase().includes(needle) ||
      post.tags.some(tag => tag.includes(needle))
    );
  }

  res.render("index", {
    title: SITE.name,
    posts: results,
    tags: tagIndex(),
    query,
    activeTag,
    totalPosts: posts.length,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: `About — ${SITE.name}`,
    stats: {
      posts: posts.length,
      tags: tagIndex().length,
      words: posts.reduce((sum, post) => sum + post.content.trim().split(/\s+/).length, 0),
    },
  });
});

app.get("/posts/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) return notFound(res, "That post has been unpublished or never existed.");

  res.locals.showProgress = true;

  const others = posts
    .filter(candidate => candidate.id !== post.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sharesTag = candidate => candidate.tags.some(tag => post.tags.includes(tag));

  const related = [
    ...others.filter(sharesTag),
    ...others.filter(candidate => !sharesTag(candidate)),
  ].slice(0, 2);

  res.render("post", { title: `${post.title} — ${SITE.name}`, post, related });
});

app.get("/create", (req, res) => {
  res.render("create", { title: `Write — ${SITE.name}` });
});

app.post("/create", (req, res) => {
  const title = (req.body.title || "").trim();
  const content = (req.body.content || "").trim();
  if (!title || !content) return res.redirect("/create");

  const now = new Date().toISOString();
  const post = {
    id: nextId(),
    title,
    content,
    tags: parseTags(req.body.tags),
    createdAt: now,
    updatedAt: now,
  };
  posts.push(post);
  res.redirect(`/posts/${post.id}`);
});

app.get("/edit/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) return notFound(res, "That post has been unpublished or never existed.");
  res.render("edit", { title: `Edit — ${SITE.name}`, post });
});

app.post("/edit/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) return notFound(res, "That post has been unpublished or never existed.");

  const title = (req.body.title || "").trim();
  const content = (req.body.content || "").trim();
  if (!title || !content) return res.redirect(`/edit/${post.id}`);

  post.title = title;
  post.content = content;
  post.tags = parseTags(req.body.tags);
  post.updatedAt = new Date().toISOString();
  res.redirect(`/posts/${post.id}`);
});

app.post("/delete/:id", (req, res) => {
  posts = posts.filter(post => post.id !== String(req.params.id));
  res.redirect("/");
});

app.use((req, res) => {
  notFound(res, "The page you were looking for is not on this shelf.");
});

app.listen(port, () => {
  console.log(`${SITE.name} is running at http://localhost:${port}`);
});
