import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { basePath, url } from "@/lib/site-config";

export const metadata = {
  title: "Image library · Scrolly",
  description:
    "Every image available under public/images/, with the path you paste into your page or markdown.",
};

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
]);

type ImageEntry = {
  /** Path under public/, always starting with a leading slash. Paste this into src="" or markdown. */
  publicPath: string;
  /** Bytes on disk. */
  size: number;
  /** Just the filename. */
  name: string;
};

type ImageGroup = {
  /** Directory under public/images, e.g. "media/modules/generated". Empty string for the root. */
  dir: string;
  entries: ImageEntry[];
};

function walkImages(root: string): ImageGroup[] {
  const groups = new Map<string, ImageEntry[]>();

  function walk(absDir: string) {
    const items = fs.readdirSync(absDir, { withFileTypes: true });
    for (const item of items) {
      const abs = path.join(absDir, item.name);
      if (item.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!item.isFile()) continue;
      const ext = path.extname(item.name).toLowerCase();
      if (!IMAGE_EXT.has(ext)) continue;
      const relFromRoot = path.relative(root, abs); // e.g. "media/modules/generated/foo.webp"
      const dir = path.dirname(relFromRoot);
      const key = dir === "." ? "" : dir;
      const publicPath =
        "/images/" + relFromRoot.split(path.sep).join("/");
      const size = fs.statSync(abs).size;
      const list = groups.get(key) ?? [];
      list.push({ publicPath, size, name: item.name });
      groups.set(key, list);
    }
  }

  walk(root);

  return [...groups.entries()]
    .map(([dir, entries]) => ({
      dir,
      entries: entries.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.dir.localeCompare(b.dir));
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageLibraryPage() {
  const root = path.join(process.cwd(), "public", "images");
  const groups = walkImages(root);
  const totalCount = groups.reduce((n, g) => n + g.entries.length, 0);
  const totalBytes = groups.reduce(
    (n, g) => n + g.entries.reduce((s, e) => s + e.size, 0),
    0,
  );

  return (
    <main
      style={{
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "3rem 1.5rem 6rem",
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        lineHeight: 1.55,
        color: "#111",
      }}
    >
      <p style={{ margin: 0 }}>
        <Link href="/">&larr; Home</Link>
      </p>

      <h1 style={{ fontSize: "2rem", marginTop: "1rem", marginBottom: "0.25rem" }}>
        Image library
      </h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        {totalCount} images &middot; {formatBytes(totalBytes)} &middot; sourced
        from <code>public/images/</code>.
      </p>

      <section
        style={{
          background: "#f5f5f5",
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          padding: "1rem 1.25rem",
          marginTop: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginTop: 0, marginBottom: "0.5rem" }}>
          How to use these images
        </h2>
        <p style={{ marginTop: 0 }}>
          All images live under <code>public/images/</code>, which Next.js
          serves statically. Reference them by the <strong>public path</strong>
          {" "}shown below each image (e.g. <code>/images/historical/easter_1900_no_cars.jpg</code>).
        </p>
        <p style={{ marginBottom: 0 }}>
          In JSX, use <code>&lt;Image src=&quot;/images/...&quot; /&gt;</code> or{" "}
          <code>&lt;img src=&quot;/images/...&quot; /&gt;</code>. In markdown,
          use <code>![alt](/images/...)</code>. Next.js automatically prepends
          the GitHub Pages base path at build time, so you do <em>not</em> add
          it yourself.
          {basePath ? (
            <>
              {" "}Current build base path: <code>{basePath}</code>.
            </>
          ) : null}
        </p>
      </section>

      {groups.map((group) => (
        <section key={group.dir || "(root)"} style={{ marginTop: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              borderBottom: "1px solid #e5e5e5",
              paddingBottom: "0.25rem",
            }}
          >
            <code>/images/{group.dir ? group.dir + "/" : ""}</code>{" "}
            <span style={{ color: "#777", fontWeight: 400, fontSize: "0.95rem" }}>
              ({group.entries.length})
            </span>
          </h2>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {group.entries.map((entry) => {
              const href = url(entry.publicPath);
              return (
                <li
                  key={entry.publicPath}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      aspectRatio: "4 / 3",
                      background:
                        "repeating-conic-gradient(#f3f3f3 0% 25%, #fafafa 0% 50%) 50% / 20px 20px",
                    }}
                  >
                    {/* Plain <img> so the build-time basePath prefix above is used verbatim for static export. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={href}
                      alt={entry.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </a>
                  <div style={{ padding: "0.625rem 0.75rem", fontSize: "0.85rem" }}>
                    <div
                      style={{
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                        fontSize: "0.78rem",
                        wordBreak: "break-all",
                        color: "#222",
                      }}
                    >
                      {entry.publicPath}
                    </div>
                    <div style={{ color: "#777", marginTop: "0.25rem" }}>
                      {formatBytes(entry.size)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
