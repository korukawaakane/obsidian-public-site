import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";
import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist");
const siteTitle = "acane 的学习知识库";
const siteDescription = "数学分析、概率统计、电路基础、大学物理、C++ 与集成电路学习笔记";
const basePath = "/obsidian-public-site/";
const ignoredDirs = new Set([".git", ".github", "node_modules", "dist", "scripts"]);

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})
  .use(markdownItMath)
  .use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink()
  });

function markdownItMath(markdown) {
  markdown.inline.ruler.before("escape", "math_inline", (state, silent) => {
    if (state.src[state.pos] !== "$" || state.src[state.pos + 1] === "$") return false;
    const end = state.src.indexOf("$", state.pos + 1);
    if (end < 0) return false;
    if (!silent) {
      const token = state.push("math_inline", "math", 0);
      token.content = state.src.slice(state.pos + 1, end);
    }
    state.pos = end + 1;
    return true;
  });

  markdown.block.ruler.before("fence", "math_block", (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    if (state.src.slice(start, max).trim() !== "$$") return false;

    let nextLine = startLine + 1;
    let content = "";
    while (nextLine < endLine) {
      const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
      const lineEnd = state.eMarks[nextLine];
      const line = state.src.slice(lineStart, lineEnd);
      if (line.trim() === "$$") {
        if (!silent) {
          const token = state.push("math_block", "math", 0);
          token.block = true;
          token.content = content.trim();
          token.map = [startLine, nextLine + 1];
        }
        state.line = nextLine + 1;
        return true;
      }
      content += `${line}\n`;
      nextLine += 1;
    }
    return false;
  });

  markdown.renderer.rules.math_inline = (tokens, idx) =>
    katex.renderToString(tokens[idx].content, { throwOnError: false });

  markdown.renderer.rules.math_block = (tokens, idx) =>
    `<div class="katex-display">${katex.renderToString(tokens[idx].content, {
      displayMode: true,
      throwOnError: false
    })}</div>\n`;
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const trimMd = (file) => file.replace(/\.md$/i, "");

const toRoute = (relativeFile) => {
  const withoutExt = trimMd(relativeFile).replaceAll("\\", "/");
  if (withoutExt.toLowerCase() === "index") return "index.html";
  if (withoutExt.toLowerCase().endsWith("/index")) {
    return `${withoutExt.slice(0, -"/index".length)}/index.html`;
  }
  return `${withoutExt}/index.html`;
};

const toHref = (relativeFile) =>
  `${basePath}${toRoute(relativeFile).split("/").map(encodeURIComponent).join("/")}`;

const normalizeWikiTarget = (target) => {
  const clean = target.split("#")[0].trim();
  if (!clean) return null;
  const candidates = [
    `${clean}.md`,
    `${clean}/index.md`,
    ...pages.map((page) => page.relative).filter((relative) => path.basename(trimMd(relative)) === clean)
  ];
  return candidates.find((candidate) => pageByRelative.has(candidate.replaceAll("\\", "/"))) ?? null;
};

const preprocessObsidian = (source) =>
  source
    .replace(/!\[\[([^\]]+)\]\]/g, (_, target) => {
      const label = target.split("|").pop().trim();
      return `_${escapeHtml(label)}_`;
    })
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
      const resolved = normalizeWikiTarget(target);
      const text = label?.trim() || target.trim();
      return resolved ? `[${text}](${toHref(resolved)})` : text;
    });

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".github") continue;
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(path.relative(root, full).replaceAll("\\", "/"));
    }
  }
  return files.sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

const pages = (await walk(root)).map((relative) => ({
  relative,
  route: toRoute(relative),
  title: path.basename(trimMd(relative))
}));
const pageByRelative = new Map(pages.map((page) => [page.relative, page]));

const topLevelPages = pages.filter((page) => !page.relative.includes("/"));
const coursePages = pages.filter((page) => page.relative.includes("/"));

const getCourseTitle = (segment) => segment.replace(/^\d{2}-/, "");

const groupedCourses = new Map();
for (const page of coursePages) {
  const parts = page.relative.split("/");
  const course = parts[0];
  const section = parts.length > 2 ? parts[1] : "课程首页";
  if (!groupedCourses.has(course)) groupedCourses.set(course, new Map());
  const sections = groupedCourses.get(course);
  if (!sections.has(section)) sections.set(section, []);
  sections.get(section).push(page);
}

const getDisplayTitle = (page) => {
  if (!page.relative.endsWith("/index.md")) return page.title;
  const parts = page.relative.split("/");
  if (parts.length === 2) return getCourseTitle(parts[0]);
  return parts.at(-2);
};

const renderPageLink = (page) =>
  `<a class="nav-link" href="${toHref(page.relative)}">${escapeHtml(getDisplayTitle(page))}</a>`;

const nav = [
  `<div class="nav-section"><div class="nav-section-title">总览</div>${topLevelPages.map(renderPageLink).join("\n")}</div>`,
  ...[...groupedCourses.entries()].map(([course, sections]) => {
    const sectionLinks = [...sections.entries()]
      .map(([section, sectionPages]) => {
        const orderedPages = sectionPages.sort((a, b) => {
          const aIndex = a.relative.endsWith("/index.md") ? 0 : 1;
          const bIndex = b.relative.endsWith("/index.md") ? 0 : 1;
          return aIndex - bIndex || a.title.localeCompare(b.title, "zh-Hans-CN");
        });
        return `<details class="nav-subgroup" open>
  <summary>${escapeHtml(section)}</summary>
  <div class="nav-subgroup-links">${orderedPages.map(renderPageLink).join("\n")}</div>
</details>`;
      })
      .join("\n");

    return `<details class="nav-group" open>
  <summary>${escapeHtml(course)} <span>${escapeHtml(getCourseTitle(course))}</span></summary>
  ${sectionLinks}
</details>`;
  })
].join("\n");

const stylesheet = `
:root {
  color-scheme: light;
  --bg: #f7f6f1;
  --panel: #ffffff;
  --ink: #202124;
  --muted: #6d706c;
  --line: #dedbd2;
  --accent: #1f6f5b;
  --accent-strong: #174f43;
  --code: #f0eee8;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans SC", sans-serif;
  line-height: 1.72;
}
a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 3px; }
.shell { display: grid; grid-template-columns: 280px minmax(0, 1fr); min-height: 100vh; }
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: auto;
  border-right: 1px solid var(--line);
  background: #eeece4;
  padding: 28px 20px;
}
.brand { display: block; color: var(--ink); text-decoration: none; font-weight: 750; font-size: 20px; line-height: 1.25; }
.description { margin: 10px 0 24px; color: var(--muted); font-size: 13px; line-height: 1.6; }
.site-search {
  border-top: 1px solid rgba(32, 33, 36, 0.08);
  margin: 0 0 16px;
  padding-top: 14px;
}
.search-title {
  color: var(--accent-strong);
  font-size: 14px;
  font-weight: 750;
  margin: 0 0 8px;
  padding: 0 4px;
}
.site-search .pagefind-ui {
  --pagefind-ui-scale: 0.76;
  --pagefind-ui-primary: var(--accent);
  --pagefind-ui-text: var(--ink);
  --pagefind-ui-background: var(--panel);
  --pagefind-ui-border: rgba(32, 33, 36, 0.14);
  --pagefind-ui-tag: #eeece4;
  --pagefind-ui-border-width: 1px;
  --pagefind-ui-border-radius: 6px;
  --pagefind-ui-image-border-radius: 6px;
  --pagefind-ui-font: "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans SC", sans-serif;
}
.site-search .pagefind-ui__form::before { background-color: var(--muted); opacity: 0.72; }
.site-search .pagefind-ui__search-input {
  box-shadow: none;
  font-weight: 500;
}
.site-search .pagefind-ui__drawer {
  background: #eeece4;
  border: 1px solid rgba(32, 33, 36, 0.08);
  border-radius: 8px;
  margin-top: 8px;
  max-height: 48vh;
  overflow: auto;
  padding: 0 8px;
}
.site-search .pagefind-ui__result {
  border-top: 1px solid rgba(32, 33, 36, 0.1);
  padding: 12px 0;
}
.site-search .pagefind-ui__result-title {
  font-size: 14px;
  line-height: 1.35;
}
.site-search .pagefind-ui__result-excerpt {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.55;
}
.site-search mark {
  background: rgba(31, 111, 91, 0.16);
  color: var(--accent-strong);
  padding: 0 2px;
}
.nav { display: grid; gap: 12px; }
.nav-section,
.nav-group {
  border-top: 1px solid rgba(32, 33, 36, 0.08);
  padding-top: 10px;
}
.nav-section-title,
.nav-group > summary {
  color: var(--accent-strong);
  cursor: pointer;
  font-size: 14px;
  font-weight: 750;
  list-style: none;
  margin: 0 0 4px;
  padding: 6px 4px;
}
.nav-group > summary::-webkit-details-marker,
.nav-subgroup > summary::-webkit-details-marker { display: none; }
.nav-group > summary::before {
  content: "▾";
  display: inline-block;
  margin-right: 6px;
  transition: transform 0.16s ease;
}
.nav-group:not([open]) > summary::before { transform: rotate(-90deg); }
.nav-group > summary span {
  color: var(--muted);
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-left: 20px;
}
.nav-subgroup {
  margin: 4px 0 4px 12px;
}
.nav-subgroup > summary {
  border-radius: 6px;
  color: #3f4944;
  cursor: pointer;
  font-size: 13px;
  font-weight: 650;
  list-style: none;
  padding: 5px 6px;
}
.nav-subgroup > summary::before {
  content: "▸";
  color: var(--muted);
  display: inline-block;
  margin-right: 5px;
  transition: transform 0.16s ease;
}
.nav-subgroup[open] > summary::before { transform: rotate(90deg); }
.nav-subgroup > summary:hover { background: rgba(31, 111, 91, 0.08); }
.nav-subgroup-links {
  border-left: 1px solid rgba(32, 33, 36, 0.1);
  margin-left: 12px;
  padding-left: 8px;
}
.nav-link {
  border-radius: 6px;
  color: var(--ink);
  display: block;
  font-size: 13px;
  line-height: 1.35;
  padding: 6px 8px;
  text-decoration: none;
  overflow-wrap: anywhere;
}
.nav-link:hover { background: rgba(31, 111, 91, 0.1); color: var(--accent-strong); }
.content {
  width: min(920px, calc(100vw - 360px));
  margin: 0 auto;
  padding: 56px 32px 96px;
}
.article-title { font-size: clamp(30px, 4vw, 52px); line-height: 1.12; margin: 0 0 12px; letter-spacing: 0; }
.article-path { color: var(--muted); margin: 0 0 36px; font-size: 14px; overflow-wrap: anywhere; }
.markdown h1, .markdown h2, .markdown h3 { line-height: 1.28; margin: 2em 0 0.65em; }
.markdown h1 { font-size: 34px; }
.markdown h2 { font-size: 26px; border-bottom: 1px solid var(--line); padding-bottom: 8px; }
.markdown h3 { font-size: 21px; }
.markdown p, .markdown ul, .markdown ol, .markdown blockquote, .markdown pre, .markdown table { margin: 1em 0; }
.markdown img { max-width: 100%; height: auto; }
.markdown code { background: var(--code); border-radius: 4px; padding: 0.12em 0.32em; font-size: 0.92em; }
.markdown pre { background: #1f2328; color: #f6f8fa; border-radius: 8px; overflow: auto; padding: 18px; }
.markdown pre code { background: transparent; color: inherit; padding: 0; }
.markdown blockquote { border-left: 4px solid var(--accent); color: #4d514d; padding-left: 16px; }
.markdown table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; }
.markdown th, .markdown td { border: 1px solid var(--line); padding: 8px 10px; }
.markdown th { background: #eeece4; }
.katex-display { overflow-x: auto; overflow-y: hidden; padding: 4px 0; }
@media (max-width: 820px) {
  .shell { display: block; }
  .sidebar { position: static; height: auto; max-height: 42vh; border-right: 0; border-bottom: 1px solid var(--line); padding: 22px 18px; }
  .content { width: 100%; padding: 34px 18px 72px; }
  .article-title { font-size: 32px; }
}
`;

const renderPage = (page, html) => `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)} | ${escapeHtml(siteTitle)}</title>
  <meta name="description" content="${escapeHtml(siteDescription)}">
  <base href="${basePath}">
  <link rel="stylesheet" href="assets/styles.css">
  <link rel="stylesheet" href="assets/katex.min.css">
  <link rel="stylesheet" href="pagefind/pagefind-ui.css">
</head>
<body>
  <div class="shell">
    <aside class="sidebar">
      <a class="brand" href="${basePath}">${escapeHtml(siteTitle)}</a>
      <p class="description">${escapeHtml(siteDescription)}</p>
      <section class="site-search" aria-label="全文搜索">
        <div class="search-title">搜索</div>
        <div id="search"></div>
      </section>
      <nav class="nav" aria-label="笔记目录">
        ${nav}
      </nav>
    </aside>
    <main class="content" data-pagefind-body>
      <h1 class="article-title">${escapeHtml(page.title)}</h1>
      <p class="article-path">${escapeHtml(page.relative)}</p>
      <article class="markdown">${html}</article>
    </main>
  </div>
  <script type="module">
    const normalizeBase = (value) => {
      if (!value) return "/";
      return value.endsWith("/") ? value : value + "/";
    };
    const configuredBase = "${basePath}";
    const documentBase = document.querySelector("base")?.getAttribute("href") || "/";
    const candidateBases = [...new Set([configuredBase, documentBase, "/obsidian-public-site/", "/"])]
      .map(normalizeBase)
      .map((base) => base + "pagefind/");

    async function loadPagefind() {
      let lastError;
      for (const bundlePath of candidateBases) {
        try {
          const module = await import(bundlePath + "pagefind-ui.js");
          return { PagefindUI: module.PagefindUI || window.PagefindUI, bundlePath };
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError;
    }

    window.addEventListener("DOMContentLoaded", async () => {
      const search = document.querySelector("#search");
      try {
        const { PagefindUI, bundlePath } = await loadPagefind();
        new PagefindUI({
          element: "#search",
          bundlePath,
          showImages: false,
          showSubResults: true,
          excerptLength: 32,
          resetStyles: false,
          translations: {
            placeholder: "搜索笔记内容",
            clear_search: "清空",
            load_more: "加载更多",
            search_label: "搜索这个知识库",
            filters_label: "筛选",
            zero_results: "没有找到结果",
            many_results: "[COUNT] 个结果",
            one_result: "[COUNT] 个结果",
            searching: "搜索中..."
          }
        });
      } catch (error) {
        console.error("Pagefind search failed to load", error);
        if (search) search.textContent = "搜索加载失败，请刷新页面";
      }
    });
  </script>
</body>
</html>`;

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(path.join(outDir, "assets"), { recursive: true });
await fs.writeFile(path.join(outDir, ".nojekyll"), "");
await fs.writeFile(path.join(outDir, "assets", "styles.css"), stylesheet.trimStart());
await fs.copyFile(
  path.join(root, "node_modules", "katex", "dist", "katex.min.css"),
  path.join(outDir, "assets", "katex.min.css")
);

for (const page of pages) {
  const source = await fs.readFile(path.join(root, page.relative), "utf8");
  const body = md.render(preprocessObsidian(source));
  const target = path.join(outDir, page.route);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, renderPage(page, body));
}

console.log(`Built ${pages.length} pages to ${path.relative(root, outDir)}`);
