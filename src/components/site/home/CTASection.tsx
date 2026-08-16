'use client'

import { ArrowRight, Phone } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function CTASection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const phone = clinicData?.phone || '+91 96573 72836'

  return (
    <section className="py-20 lg:py-24 bg-amber-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
          Ready for a Healthier Smile?
        </h2>
        <p className="text-slate-500 mb-8 text-base leading-relaxed">
          Book your appointment today and experience the difference.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#/book"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/20 px-8 h-12 text-sm transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </div>
      </div>
    </section>
  )
}
