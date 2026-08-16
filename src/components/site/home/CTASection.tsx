'use client'

import { ArrowRight, Phone } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function CTASection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const phone = clinicData?.phone || '+91 96573 72836'

  return (
    <section className="relative overflow-hidden bg-emerald-700">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)',
        backgroundSize: '24px 24px',
      }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/50 rounded-full -translate-y-1/2 translate-x-1/3" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
          Ready for a Healthier Smile?
        </h2>
        <p className="text-emerald-100 mb-8 text-base leading-relaxed max-w-md mx-auto">
          Book your appointment today. We&apos;re here to make your visit comfortable and stress-free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#/book"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold rounded-xl px-7 h-12 text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </div>
      </div>
    </section>
  )
}
