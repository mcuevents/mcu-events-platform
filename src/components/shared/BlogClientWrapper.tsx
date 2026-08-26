'use client';

import React, { useState } from 'react';
import { BlogPost } from '@/types/cms';
import { Container, Section, Button } from '@/components/ui';
import { BlogCard } from '@/components/shared/BlogCard';
import { Search, ArrowRight, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface BlogClientWrapperProps {
  posts: BlogPost[];
}

export function BlogClientWrapper({ posts }: BlogClientWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts[0];
  const regularPosts = filteredPosts;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) setSubscribed(true);
  };

  return (
    <div>
      {/* 1. Hero */}
      <div className="py-12 lg:py-16 bg-dark-950 border-b border-dark-800">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
              MCU Insights & Knowledge
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">
              Event Management & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">Growth Marketing</span>
            </h1>
            <p className="text-base sm:text-lg text-dark-300 leading-relaxed">
              Read actionable guides on exhibitor ROI, social media viral tactics, tier-2 city expo expansions, and B2B delegate conversion funnels.
            </p>
          </div>
        </Container>
      </div>

      {/* 2. Main Blog Section */}
      <Section spacing="md">
        <Container space-y-10>
          {/* Featured Article Banner */}
          {featuredPost && !searchQuery && selectedCategory === 'All' && (
            <div className="rounded-3xl overflow-hidden border border-dark-800 bg-gradient-to-r from-dark-900 to-dark-950 grid grid-cols-1 lg:grid-cols-12 gap-0 group">
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    Featured Masterclass • {featuredPost.category}
                  </span>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-brand-400 transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-dark-300 leading-relaxed max-w-xl">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-dark-800">
                  <div className="flex items-center gap-3">
                    {featuredPost.authorAvatar && (
                      <img
                        src={featuredPost.authorAvatar}
                        alt={featuredPost.authorName}
                        className="h-9 w-9 rounded-full object-cover border border-dark-700"
                      />
                    )}
                    <div>
                      <span className="text-xs font-bold text-white block">{featuredPost.authorName}</span>
                      <span className="text-[11px] text-dark-400">5 min read</span>
                    </div>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Read Full Guide
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-auto relative overflow-hidden bg-dark-950">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          )}

          {/* Search & Categories Filter Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900/80 border border-dark-800">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as string)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      active
                        ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                        : 'bg-dark-950/60 text-dark-300 hover:text-white border border-dark-800 hover:border-dark-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search articles by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-950 border border-dark-800 text-xs text-white placeholder-dark-400 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Newsletter Box */}
          <div className="rounded-3xl bg-gradient-to-br from-dark-900 via-dark-900 to-dark-950 border border-dark-800 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-xs font-bold uppercase text-brand-400 font-mono tracking-wider">
                Weekly Industry Digest
              </span>
              <h3 className="text-2xl font-bold text-white">
                Get Expo Playbooks & Event Insights
              </h3>
              <p className="text-xs sm:text-sm text-dark-300">
                Join 2,500+ event marketers, franchise founders, and exhibitors receiving our bi-weekly insights.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-3 text-brand-400 bg-brand-500/10 border border-brand-500/30 px-5 py-3 rounded-xl">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold">You are subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
                <input
                  type="email"
                  placeholder="Enter your work email..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-dark-950 border border-dark-800 text-xs text-white placeholder-dark-400 focus:outline-none focus:border-brand-500 w-full sm:w-64"
                  required
                />
                <Button type="submit" variant="primary" rightIcon={<Send className="h-4 w-4" />}>
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
