'use client'

import { ArrowRight, Phone } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function CTASection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const phone = clinicData?.phone || '+91 96573 72836'

  return (
    <section className="relative overflow-hidden bg-surface-lowest">
      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
          Ready for a{' '}
          <span className="text-teal">Healthier Smile</span>?
        </h2>
        <p className="text-body mb-8 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
          Book your appointment today. We&apos;re here to make your visit comfortable, efficient, and stress-free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#/book"
            className="inline-flex items-center gap-2.5 bg-teal hover:bg-teal-dark text-teal-text font-semibold rounded px-8 h-[54px] text-sm transition-all hover:shadow-lg hover:shadow-teal/20 hover:-translate-y-0.5"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2.5 text-heading hover:text-white font-medium text-sm transition-colors border border-[#8e9196] hover:bg-surface-variant rounded px-7 h-[54px]"
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </div>
      </div>
    </section>
  )
}
