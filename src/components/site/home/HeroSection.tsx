'use client'

import { ArrowRight, Phone } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function HeroSection() {
  const clinicData = useSiteStore((s) => s.clinicData)

  return (
    <section className="relative min-h-[620px] lg:min-h-[680px] overflow-hidden">
      {/* Full background — rich dark emerald */}
      <div className="absolute inset-0 bg-[#064E3B]" />

      {/* Subtle radial light from top-left */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,rgba(16,185,129,0.15),transparent_70%)]" />

      {/* Very fine grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-[620px] lg:min-h-[680px]">
        <div className="py-20 lg:py-24 w-full max-w-2xl animate-fade-up">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[2px] bg-amber-400" />
            <span className="text-amber-300/90 text-xs font-semibold tracking-[0.2em] uppercase">
              {clinicData?.name || 'Radiance Dental Care'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.08] tracking-tight mb-6">
            Your Smile,{' '}
            <span className="text-amber-300">Our Passion</span>
          </h1>

          {/* Description — high contrast */}
          <p className="text-emerald-100/90 text-lg sm:text-xl leading-relaxed max-w-lg mb-10">
            {clinicData?.description?.substring(0, 160) ||
              'Comprehensive dental care with modern technology, gentle treatment, and personalized attention for the whole family.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a
              href="#/book"
              className="inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/25 px-7 h-12 text-sm transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#/services"
              className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/90 hover:bg-white/10 hover:text-white rounded-lg px-7 h-12 text-sm font-medium transition-colors"
            >
              View Services
            </a>
          </div>

          {/* Trust micro-bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-emerald-200/60 text-xs">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{clinicData?.phone || '+91 96573 72836'}</span>
            </div>
            <span className="text-emerald-200/30">|</span>
            <span>Mon – Sat, 10:00 AM – 6:00 PM</span>
          </div>
        </div>
      </div>
    </section>
  )
}
