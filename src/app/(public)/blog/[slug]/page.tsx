import React from 'react';
import { notFound } from 'next/navigation';
import { Container, Section, Card, Button, Badge } from '@/components/ui';
import { getBlogPostBySlug, getBlogPosts } from '@/services/content.service';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, Clock, Tag, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Article Not Found | MCU Creations',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${post.title} | MCU Creations`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    alternates: {
      canonical: siteConfig.getCanonicalUrl(`/blog/${params.slug}`),
    },
  };
}

export default async function BlogPostReaderPage({ params }: BlogPostPageProps) {
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts.filter((p) => p.slug !== params.slug).slice(0, 2);

  return (
    <div>
      {/* 1. Article Header */}
      <div className="py-12 lg:py-16 bg-dark-950 border-b border-dark-800">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-dark-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Articles</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {post.title}
            </h1>

            {/* Author & Date Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-dark-300 pt-2">
              <div className="flex items-center gap-2">
                {post.authorAvatar && (
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="h-7 w-7 rounded-full object-cover border border-dark-700"
                  />
                )}
                <span className="font-bold text-white">{post.authorName}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-brand-400" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-400" />
                <span>5 Min Read</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Article Content & Sidebar */}
      <Section spacing="md">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Cover Image */}
              {post.coverImage && (
                <div className="rounded-2xl overflow-hidden border border-dark-800 aspect-video bg-dark-950">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Excerpt Lead Paragraph */}
              <p className="text-base sm:text-lg font-medium text-dark-200 leading-relaxed border-l-2 border-brand-500 pl-4 py-1 italic">
                {post.excerpt}
              </p>

              {/* Rich Body Content */}
              <div
                className="prose prose-invert max-w-none text-dark-300 leading-relaxed space-y-5 text-sm sm:text-base [&>h2]:text-white [&>h2]:font-bold [&>h2]:text-2xl [&>h3]:text-white [&>h3]:font-bold [&>h3]:text-lg [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-6 border-t border-dark-800 flex flex-wrap items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-brand-400 shrink-0 mr-1" />
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-dark-900 border border-dark-800 text-dark-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Bio Card */}
              <Card className="p-6 bg-dark-950 border-dark-800">
                <div className="flex items-start gap-4">
                  {post.authorAvatar && (
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="h-12 w-12 rounded-full object-cover border border-dark-700 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <span className="text-xs text-dark-400 uppercase font-mono tracking-wider">
                      Written By
                    </span>
                    <h4 className="text-sm font-bold text-white">{post.authorName}</h4>
                    <p className="text-xs text-dark-300 leading-relaxed">
                      Strategist at MCU Creations covering large-scale expo operations, performance lead generation, and social media reach.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Event Promotion Callout */}
                <Card className="bg-gradient-to-br from-dark-900 to-dark-950 border-brand-500/30 p-6 space-y-4 shadow-lg shadow-brand-500/5">
                  <Badge variant="gold">Upcoming Expo</Badge>
                  <h3 className="text-base font-bold text-white">
                    Experience MCU Creations Live at Our Next Summit
                  </h3>
                  <p className="text-xs text-dark-300 leading-relaxed">
                    Join 10,000+ business owners, franchise brands, and investors in Tamil Nadu.
                  </p>
                  <Link href="/events">
                    <Button variant="primary" size="sm" className="w-full">
                      Explore Upcoming Summits
                    </Button>
                  </Link>
                </Card>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white">Related Reading</h4>
                    <div className="space-y-4">
                      {relatedPosts.map((rPost) => (
                        <Link
                          key={rPost.id}
                          href={`/blog/${rPost.slug}`}
                          className="block rounded-xl border border-dark-800 bg-dark-900/60 p-4 hover:border-brand-500/40 transition-colors group"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                            {rPost.category}
                          </span>
                          <h5 className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors mt-1 line-clamp-2">
                            {rPost.title}
                          </h5>
                          <span className="text-[11px] text-dark-400 mt-2 block">
                            {formatDate(rPost.publishedAt || rPost.createdAt)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
