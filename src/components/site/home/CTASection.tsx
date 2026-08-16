'use client'

import { ArrowRight, Phone } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function CTASection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const phone = clinicData?.phone || '+91 96573 72836'

  return (
    <section className="relative overflow-hidden bg-emerald-800">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      {/* Decorative gradient shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-700/40 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 py-20 lg:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
          Ready for a Healthier Smile?
        </h2>
        <p className="text-emerald-100/80 mb-10 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
          Book your appointment today. We&apos;re here to make your visit comfortable, efficient, and stress-free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#/book"
            className="inline-flex items-center gap-2.5 bg-white text-emerald-800 font-semibold rounded-full px-8 h-[52px] text-sm transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2.5 text-white/70 hover:text-white font-medium text-sm transition-colors border border-white/20 hover:border-white/40 rounded-full px-7 h-[52px]"
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </div>
      </div>
    </section>
  )
}
