import { NextRequest, NextResponse } from 'next/server';
import { enquiryFormSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/utils/rateLimit';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check (20 requests per minute per IP)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    const rateLimit = checkRateLimit(`enq_${ip}`, { limit: 20, windowMs: 60 * 1000 });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many enquiry submissions. Please wait a moment before trying again.',
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const body = await req.json();
    const parseResult = enquiryFormSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const {
      type,
      fullName,
      email,
      phone,
      companyName,
      designation,
      subject,
      message,
      eventId,
      eventName,
      serviceId,
      serviceName,
      metadata,
      hp_field,
    } = parseResult.data;

    // 3. Honeypot Spam Protection
    if (hp_field && hp_field.length > 0) {
      return NextResponse.json({
        success: true,
        id: `mock-bot-filtered-${Date.now()}`,
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 4. Database Insertion (Supabase with graceful fallback)
    try {
      const supabase = createAdminClient();

      const { data: inserted, error: insertError } = await supabase
        .from('enquiries')
        .insert([
          {
            type,
            full_name: fullName.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            company_name: companyName ? companyName.trim() : null,
            designation: designation ? designation.trim() : null,
            subject: subject.trim(),
            message: message.trim(),
            event_id: eventId || null,
            service_id: serviceId || null,
            status: 'new',
            metadata: {
              ...(metadata || {}),
              eventName: eventName || undefined,
              serviceName: serviceName || undefined,
              ip,
              userAgent: req.headers.get('user-agent') || 'unknown',
            },
          },
        ])
        .select('id')
        .single();

      if (insertError) {
        console.warn('Supabase enquiry insert warning:', insertError.message);
        return NextResponse.json({
          success: true,
          id: `req-${Date.now()}`,
          offlineFallback: true,
        });
      }

      return NextResponse.json({
        success: true,
        id: inserted.id,
      });
    } catch (dbErr: any) {
      console.warn('Supabase enquiry connection note:', dbErr?.message || dbErr);
      return NextResponse.json({
        success: true,
        id: `req-${Date.now()}`,
        offlineFallback: true,
      });
    }
  } catch (err: any) {
    console.error('Enquiry API unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while transmitting your enquiry.' },
      { status: 500 }
    );
  }
}
