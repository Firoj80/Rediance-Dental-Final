'use client'

import { ArrowRight, Phone } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function CTASection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const phone = clinicData?.phone || '+91 96573 72836'

  return (
    <section className="relative overflow-hidden bg-slate-950 dark-texture">
      {/* Large background gradient shapes for dramatic effect */}
      <div className="absolute top-[-30%] left-[-10%] w-[700px] h-[700px] bg-emerald-900/30 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-800/20 rounded-full blur-[120px]" />
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-28 lg:py-36 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
          Ready for a{' '}
          <span className="text-amber-400">Healthier Smile</span>?
        </h2>
        <p className="text-white/50 mb-12 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
          Book your appointment today. We&apos;re here to make your visit comfortable, efficient, and stress-free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#/book"
            className="inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-full px-8 h-[54px] text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2.5 text-white/70 hover:text-white font-medium text-sm transition-colors border border-white/20 hover:border-white/40 hover:bg-white/5 rounded-full px-7 h-[54px]"
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </div>
      </div>
    </section>
  )
}
