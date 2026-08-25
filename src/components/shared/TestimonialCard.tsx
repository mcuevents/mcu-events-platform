import React from 'react';
import { Testimonial } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Quote, Star } from 'lucide-react';

export interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card hoverEffect className="flex flex-col justify-between h-full p-6 relative">
      <Quote className="h-8 w-8 text-brand-500/20 absolute top-4 right-4 pointer-events-none" />

      <CardContent className="p-0 space-y-4">
        {testimonial.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-brand-400 text-brand-400" />
            ))}
          </div>
        )}

        <p className="text-sm text-dark-200 leading-relaxed italic">
          "{testimonial.content}"
        </p>
      </CardContent>

      <div className="mt-6 pt-4 border-t border-dark-800 flex items-center gap-3">
        {testimonial.avatarUrl ? (
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.clientName}
            className="h-10 w-10 rounded-full object-cover border border-brand-500/30"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 font-bold text-brand-400 text-sm border border-brand-500/20">
            {testimonial.clientName.charAt(0)}
          </div>
        )}
        <div>
          <h5 className="text-sm font-bold text-white">{testimonial.clientName}</h5>
          <p className="text-xs text-dark-400">
            {testimonial.clientTitle} {testimonial.companyName ? `• ${testimonial.companyName}` : ''}
          </p>
        </div>
      </div>
    </Card>
  );
};
