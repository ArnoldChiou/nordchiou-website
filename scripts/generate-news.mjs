// 每週 AI 新聞週報草稿：抓取 RSS → Claude 挑選並撰寫摘要 → 輸出 Markdown
// 用法：node scripts/generate-news.mjs [--draft] [--dry-run] [--days=7]
//   --draft    輸出到 content/news/drafts/（本機預覽用）
//   --dry-run  只抓新聞並列出候選清單，不呼叫 Claude
//   --force    同一週的週報已存在時仍重新產生
// 認證：有 ANTHROPIC_API_KEY 就走 API（按量計費）；否則改用 Claude Code 的 claude -p（使用訂閱額度）
import Anthropic from "@anthropic-ai/sdk";
import { XMLParser } from "fast-xml-parser";
import { appendFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const DRAFT = args.includes("--draft");
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const DAYS = Number(args.find((arg) => arg.startsWith("--days="))?.split("=")[1] ?? 7);
if (!Number.isInteger(DAYS) || DAYS < 1 || DAYS > 31) throw new Error("--days 必須是 1–31 的整數");
const MAX_ITEMS = 8;
const MAX_PER_SOURCE = 15;
const MODEL = "claude-opus-5";

const root = process.cwd();
const newsDir = join(root, "content", "news");
const sources = JSON.parse(await readFile(join(root, "scripts", "news-sources.json"), "utf8"));
const since = Date.now() - DAYS * 24 * 60 * 60 * 1000;

const stripHtml = (text = "") =>
  String(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#8217;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

// iThome 等來源的日期沒有時區，視為台灣時間
function parseDate(value) {
  if (!value) return NaN;
  const text = String(value).trim();
  const direct = Date.parse(text);
  if (!Number.isNaN(direct) && /[zZ]|[+-]\d{2}:?\d{2}|GMT|UT/.test(text)) return direct;
  const local = Date.parse(`${text.replace(/\s+/, "T").replace(/\s+/g, "")}+08:00`);
  return Number.isNaN(local) ? direct : local;
}

// 只接受 http(s) 網址，並把 Markdown 會誤判的括號與空白編碼
function safeUrl(value) {
  try {
    const url = new URL(String(value ?? "").trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.href.replace(/\(/g, "%28").replace(/\)/g, "%29");
  } catch {
    return "";
  }
}

function canonical(link) {
  try {
    const url = new URL(link);
    return `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return link;
  }
}

const text = (value) => (typeof value === "object" && value !== null ? (value["#text"] ?? "") : (value ?? ""));

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; nordchiou-news-bot/1.0; +https://nordchiou.com)" }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function parseFeed(source, body) {
  const doc = xml.parse(body);
  const list = doc.rss?.channel?.item ?? doc.feed?.entry ?? doc["rdf:RDF"]?.item ?? [];
  return (Array.isArray(list) ? list : [list]).map((item) => {
    const links = Array.isArray(item.link) ? item.link : [item.link];
    const alternate = links.find((l) => typeof l === "object" && l["@_href"] && (!l["@_rel"] || l["@_rel"] === "alternate"));
    const link = alternate?.["@_href"] ?? links.map((l) => (typeof l === "object" ? (l["@_href"] ?? text(l)) : l)).find(Boolean);
    return {
      source: source.name,
      title: stripHtml(text(item.title)),
      link: safeUrl(link),
      date: parseDate(item.pubDate ?? item.published ?? item.updated ?? item["dc:date"]),
      snippet: stripHtml(text(item.description ?? item.summary ?? item["content:encoded"] ?? item.content)).slice(0, 400),
    };
  });
}

// Anthropic 沒有 RSS，從新聞列表頁擷取標題與日期
function parseAnthropicHtml(source, body) {
  const seen = new Set();
  const items = [];
  for (const match of body.matchAll(/<a[^>]+href="(\/news\/[a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    if (seen.has(match[1])) continue;
    seen.add(match[1]);
    const label = stripHtml(match[2]);
    const dateText = label.match(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)?.[0];
    const title = label.replace(dateText ?? "", "").replace(/^(Announcements|Product|Policy|Research|Societal Impacts)\s+|\s+(Announcements|Product|Policy|Research|Societal Impacts)\s+/g, " ").trim();
    items.push({ source: source.name, title, link: safeUrl(new URL(match[1], source.url).href), date: dateText ? Date.parse(`${dateText} 12:00 UTC`) : NaN, snippet: "" });
  }
  return items;
}

// 已經出現在過去週報裡的連結不再重複收錄
async function usedLinks() {
  const links = new Set();
  for (const dir of [newsDir, join(newsDir, "drafts")]) {
    let files = [];
    try {
      files = await readdir(dir);
    } catch {
      continue;
    }
    for (const file of files.filter((name) => name.endsWith(".md"))) {
      const body = await readFile(join(dir, file), "utf8");
      for (const match of body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) links.add(canonical(match[1]));
    }
  }
  return links;
}

async function collectCandidates() {
  const used = await usedLinks();
  const results = await Promise.allSettled(
    sources.map(async (source) => {
      const body = await fetchText(source.url);
      const items = source.type === "anthropic-html" ? parseAnthropicHtml(source, body) : parseFeed(source, body);
      return items
        .filter((item) => item.title && item.link && item.date >= since && !used.has(canonical(item.link)))
        .sort((a, b) => b.date - a.date)
        .slice(0, MAX_PER_SOURCE);
    }),
  );
  const candidates = [];
  results.forEach((result, index) => {
    const name = sources[index].name;
    if (result.status === "fulfilled") {
      console.log(`✓ ${name}：${result.value.length} 則`);
      candidates.push(...result.value);
    } else {
      console.warn(`✗ ${name}：${result.reason?.message ?? result.reason}`);
    }
  });
  // 不同來源轉載同一網址時只保留一則
  const seen = new Set();
  return candidates
    .filter((item) => {
      const key = canonical(item.link);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item, id) => ({ id, ...item }));
}

// 以台灣時間計算 ISO 週次
function weekInfo(now = new Date()) {
  const taipei = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const day = taipei.getUTCDay() || 7;
  const thursday = new Date(Date.UTC(taipei.getUTCFullYear(), taipei.getUTCMonth(), taipei.getUTCDate() + 4 - day));
  const year = thursday.getUTCFullYear();
  const week = Math.ceil(((thursday - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7);
  const today = taipei.toISOString().slice(0, 10);
  const from = new Date(taipei.getTime() - DAYS * 86400000).toISOString().slice(0, 10);
  return { year, week, today, from };
}

const CATEGORIES = ["模型與產品", "企業應用", "開源與工具", "政策與法規", "產業動態"];

const SCHEMA = {
  type: "object",
  properties: {
    description: { type: "string", description: "本期週報的 SEO 描述，80–120 字，點出本週最重要的 2–3 個重點" },
    intro: { type: "string", description: "開場導讀，150–250 字，說明本週整體趨勢與企業該關注的地方" },
    tags: { type: "array", items: { type: "string" }, description: "3–5 個主題標籤" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer", description: "候選新聞的 id" },
          category: { type: "string", enum: CATEGORIES },
          headline: { type: "string", description: "繁體中文標題，25 字以內，直接說重點" },
          summary: { type: "string", description: "重點摘要，100–180 字，只寫原文提供的事實" },
          takeaway: { type: "string", description: "對台灣企業導入 AI 的意義，60–120 字，具體可行動" },
        },
        required: ["id", "category", "headline", "summary", "takeaway"],
        additionalProperties: false,
      },
    },
  },
  required: ["description", "intro", "tags", "items"],
  additionalProperties: false,
};

const SYSTEM = `你是「諾秋工作室」AI 新聞週報的編輯。諾秋工作室是協助台灣中小企業導入 AI（知識庫問答、AI Agent 流程自動化、AI 客服）的技術工作室，讀者是企業主、營運主管與 IT 負責人。

你的任務：從候選新聞中挑出 5–8 則對台灣企業導入 AI 最有參考價值的新聞，用繁體中文（台灣用語）撰寫週報內容。

挑選原則：
- 優先：企業可實際使用的新模型與產品能力、價格與授權變化、企業導入案例、資安與法規、台灣在地動態。
- 排除：純學術研究、融資與人事八卦、消費娛樂、與 AI 無關的新聞、同一事件的重複報導（只留資訊最完整的一則）。
- 盡量涵蓋不同類別與來源，至少包含一則台灣或中文來源的新聞（若有合適的）。

寫作原則：
- 只根據候選資料中的標題與摘要撰寫，不要補充資料中沒有的數字、日期、價格或引述；資訊不足時寫得保守一點。
- 摘要寫事實，「對企業的意義」寫你的專業判斷，兩者不要混在一起。
- 語氣專業、直接、不誇大，不使用「震撼」「顛覆」之類的形容詞。
- 依重要性由高到低排序。`;

function userPrompt(candidates) {
  const payload = candidates.map(({ id, source, title, link, date, snippet }) => ({ id, source, title, date: new Date(date).toISOString().slice(0, 10), snippet, domain: new URL(link).hostname }));
  return `以下是過去 ${DAYS} 天的候選新聞（JSON）：\n\n${JSON.stringify(payload)}`;
}

async function writeDigestWithApi(candidates) {
  const client = new Anthropic();
  const message = await client.beta.messages
    .stream({
      model: MODEL,
      max_tokens: 64000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      system: SYSTEM,
      messages: [{ role: "user", content: userPrompt(candidates) }],
    })
    .finalMessage();

  if (message.stop_reason === "refusal") throw new Error(`Claude 拒絕處理：${message.stop_details?.explanation ?? "未提供原因"}`);
  if (message.stop_reason === "max_tokens") throw new Error("輸出超過 max_tokens，內容不完整");
  const json = message.content.find((block) => block.type === "text")?.text;
  if (!json) throw new Error("Claude 沒有回傳內容");
  console.log(`Claude API 用量：輸入 ${message.usage.input_tokens}、輸出 ${message.usage.output_tokens} tokens（${message.model}）`);
  return JSON.parse(json);
}

// 不開放任何工具、不載入 hooks 與 MCP，只做純文字生成
async function writeDigestWithClaudeCode(candidates) {
  const cliArgs = ["-p", "--output-format", "json", "--json-schema", JSON.stringify(SCHEMA), "--system-prompt", SYSTEM, "--model", "opus", "--effort", "medium", "--tools", "", "--strict-mcp-config", "--no-session-persistence", "--settings", JSON.stringify({ disableAllHooks: true })];
  const output = await new Promise((resolve, reject) => {
    const child = spawn("claude", cliArgs, { stdio: ["pipe", "pipe", "inherit"] });
    let stdout = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.on("error", (error) => reject(error.code === "ENOENT" ? new Error("找不到 claude 指令：請安裝 Claude Code，或設定 ANTHROPIC_API_KEY 改走 API") : error));
    child.on("close", (code) => (code === 0 ? resolve(stdout) : reject(new Error(`claude -p 結束代碼 ${code}：${stdout.slice(0, 500)}`))));
    child.stdin.end(userPrompt(candidates));
  });
  const result = JSON.parse(output);
  if (result.is_error || !result.structured_output) throw new Error(`Claude Code 未回傳結構化結果：${String(result.result ?? result.subtype ?? "").slice(0, 500)}`);
  console.log(`Claude Code（訂閱額度）用量：輸入 ${result.usage?.input_tokens ?? "?"}、輸出 ${result.usage?.output_tokens ?? "?"} tokens`);
  return result.structured_output;
}

const writeDigest = (candidates) => (process.env.ANTHROPIC_API_KEY ? writeDigestWithApi(candidates) : writeDigestWithClaudeCode(candidates));

const quote = (value) => JSON.stringify(value);
const plain = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[\\`*_{}[\]()<>#|!~]/g, (char) => `\\${char}`);
const paragraphs = (value) =>
  String(value ?? "")
    .split(/\n\s*\n/)
    .map(plain)
    .filter(Boolean)
    .join("\n\n");

function toMarkdown(digest, candidates, info) {
  const byId = new Map(candidates.map((item) => [item.id, item]));
  // 連結、來源與日期一律取自原始資料，不採用模型輸出
  const ids = new Set();
  const items = digest.items
    .filter((item) => {
      if (!byId.has(item.id) || ids.has(item.id)) return false;
      ids.add(item.id);
      return true;
    })
    .slice(0, MAX_ITEMS);
  if (items.length < 3) throw new Error(`有效新聞只有 ${items.length} 則，不產生週報`);
  const [, fm, fd] = info.from.split("-");
  const [, tm, td] = info.today.split("-");
  const title = `AI 新聞週報｜${info.year} 年第 ${info.week} 週（${Number(fm)}/${Number(fd)}–${Number(tm)}/${Number(td)}）`;
  const sections = items.map((item, index) => {
    const origin = byId.get(item.id);
    const date = new Date(origin.date).toISOString().slice(0, 10);
    return [`## ${index + 1}. ${plain(item.headline)}`, "", `**${plain(item.category)}**｜來源：[${plain(origin.source)}](${origin.link})｜${date}`, "", plain(item.summary), "", `> **對企業的意義**：${plain(item.takeaway)}`].join("\n");
  });
  return {
    title,
    count: items.length,
    body: [
      "---",
      `title: ${quote(title)}`,
      `description: ${quote(plain(digest.description).replace(/\\/g, ""))}`,
      `date: ${quote(info.today)}`,
      `tags: [${["AI 新聞", ...digest.tags].slice(0, 6).map((tag) => quote(String(tag).replace(/\s+/g, " ").trim())).join(", ")}]`,
      "---",
      "",
      paragraphs(digest.intro),
      "",
      sections.join("\n\n"),
      "",
      "---",
      "",
      "本週報由 AI 協助整理摘要，經諾秋工作室人工審核後發布；各則內容以原文為準，請點選來源連結閱讀完整報導。",
      "",
    ].join("\n"),
  };
}

const info = weekInfo();
const slug = `${info.year}-w${String(info.week).padStart(2, "0")}`;
const published = join(newsDir, `${slug}.md`);
if (!DRY_RUN && !FORCE && existsSync(published)) {
  console.log(`${slug} 已發布，略過（要重新產生請加 --force）`);
  process.exit(0);
}
const candidates = await collectCandidates();
console.log(`共 ${candidates.length} 則候選新聞（${info.from} 起）`);

if (DRY_RUN) {
  for (const item of candidates) console.log(`- [${item.source}] ${new Date(item.date).toISOString().slice(0, 10)} ${item.title}`);
  process.exit(0);
}
if (candidates.length < 5) {
  console.error("候選新聞太少，本週不產生週報");
  process.exit(1);
}

const digest = await writeDigest(candidates);
const { title, count, body } = toMarkdown(digest, candidates, info);
const dir = DRAFT ? join(newsDir, "drafts") : newsDir;
await mkdir(dir, { recursive: true });
const file = join(dir, `${slug}.md`);
await writeFile(file, body, "utf8");
console.log(`已輸出 ${count} 則新聞：${file}`);

// 提供給 GitHub Actions 建立 PR 使用
if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `slug=${slug}\ntitle=${title}\ncount=${count}\n`);
}
