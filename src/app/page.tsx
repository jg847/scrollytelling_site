import type { Metadata } from "next";
import { Heading } from "@/components/ui/Heading";
import { getHomeRepo } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomeRepo().getPageBySlug("home");

  return {
    title: page.frontmatter.seo?.title ?? page.frontmatter.title,
    description: page.frontmatter.seo?.description ?? page.frontmatter.summary,
  };
}

export default async function Home() {
  const page = await getHomeRepo().getPageBySlug("home");

  return (
    <main>
      <Heading level={1}>{page.frontmatter.title}</Heading>
      <pre>{page.content}</pre>
    </main>
  );
}
