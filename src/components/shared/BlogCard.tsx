import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight, User } from 'lucide-react';

export interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Card hoverEffect className="overflow-hidden flex flex-col h-full group">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-dark-900">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-dark-800 text-dark-500">
            <Calendar className="h-10 w-10" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="gold">{post.category}</Badge>
        </div>
      </div>

      <CardHeader className="flex-1">
        <div className="flex items-center gap-3 text-xs text-dark-400 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-brand-400" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-dark-400" />
            <span>{post.authorName}</span>
          </div>
        </div>

        <CardTitle className="text-lg line-clamp-2 group-hover:text-brand-400 transition-colors">
          {post.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 mt-2 text-xs leading-relaxed">
          {post.excerpt}
        </CardDescription>
      </CardHeader>

      <CardFooter className="pt-0">
        <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors">
          <span>Read Full Article</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
};
