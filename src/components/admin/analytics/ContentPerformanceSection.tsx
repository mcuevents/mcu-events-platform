'use client';

import React from 'react';
import { ContentAnalytics } from '@/types/analytics';
import { FileText, Briefcase, Eye, MessageSquare } from 'lucide-react';

interface ContentPerformanceSectionProps {
  data: ContentAnalytics;
}

export const ContentPerformanceSection: React.FC<ContentPerformanceSectionProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Top Blog Posts */}
      <div className="p-5 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-400" />
            Top Insight Articles & Readership
          </h3>
          <p className="text-xs text-dark-400">High-performing articles driving visitor engagement.</p>
        </div>

        <div className="space-y-2 pt-2">
          {data.topBlogPosts.length === 0 ? (
            <div className="p-6 text-center text-xs text-dark-500 italic bg-dark-950/40 rounded-xl">
              No blog performance data available.
            </div>
          ) : (
            data.topBlogPosts.map((post) => (
              <div
                key={post.id}
                className="p-3 bg-dark-950 rounded-xl border border-dark-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="font-bold text-white block truncate">{post.title}</span>
                  <span className="text-[10px] text-brand-400 uppercase tracking-wider font-bold">
                    {post.category.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-dark-300 font-mono shrink-0">
                  <Eye className="h-3.5 w-3.5 text-dark-500" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Top Services Inquiries */}
      <div className="p-5 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-brand-400" />
            Service Capabilities Demand
          </h3>
          <p className="text-xs text-dark-400">Visitor interest by service offering category.</p>
        </div>

        <div className="space-y-2 pt-2">
          {data.topServices.length === 0 ? (
            <div className="p-6 text-center text-xs text-dark-500 italic bg-dark-950/40 rounded-xl">
              No service demand records available.
            </div>
          ) : (
            data.topServices.map((service) => (
              <div
                key={service.id}
                className="p-3 bg-dark-950 rounded-xl border border-dark-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="font-bold text-white block truncate">{service.title}</span>
                  <span className="text-[10px] text-brand-400 uppercase tracking-wider font-bold">
                    {service.category.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-dark-300 font-mono shrink-0">
                  <MessageSquare className="h-3.5 w-3.5 text-dark-500" />
                  <span>{service.enquiriesCount} inquiries</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
