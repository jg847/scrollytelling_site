import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageLayoutFactory } from "@/components/layouts/PageLayoutFactory";
import { getPagesRepo } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getPagesRepo().getAllSlugs();
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!slug?.length) return {};
  const page = await getPagesRepo().getPageBySlug(slug.join("/"));
  return {
    title: page.frontmatter.seo?.title ?? page.frontmatter.title,
    description: page.frontmatter.seo?.description ?? page.frontmatter.summary,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (!slug?.length) notFound();
  const page = await getPagesRepo().getPageBySlug(slug.join("/"));

  return <PageLayoutFactory page={page} />;
}