import type { Metadata } from "next";
import { PageLayoutFactory } from "@/components/layouts/PageLayoutFactory";
import { getHomeRepo, getPagesRepo } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomeRepo().getPageBySlug("home");

  return {
    title: page.frontmatter.seo?.title ?? page.frontmatter.title,
    description: page.frontmatter.seo?.description ?? page.frontmatter.summary,
  };
}

export default async function Home() {
  const page = await getHomeRepo().getPageBySlug("home");
  const pages = await getPagesRepo().getAllPages();
  const orderedPages = pages.sort((left, right) => (left.frontmatter.order ?? Number.MAX_SAFE_INTEGER) - (right.frontmatter.order ?? Number.MAX_SAFE_INTEGER));
  const stitchedContent = [
    page.content,
    ...orderedPages.map((zonePage) => {
      const intro = [
        `## ${zonePage.frontmatter.title}`,
        zonePage.frontmatter.summary,
      ].filter(Boolean).join("\n\n");

      return `${intro}\n\n---\n\n${zonePage.content}`;
    }),
  ].join("\n\n---\n\n");

  return <PageLayoutFactory page={{ ...page, content: stitchedContent }} />;
}
