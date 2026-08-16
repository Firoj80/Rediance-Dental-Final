'use client'

import { ArrowRight, Phone, Shield, Clock } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function HeroSection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const phone = clinicData?.phone || '+91 96573 72836'
  const clinicName = clinicData?.name || 'Radiance Dental Care'
  const settings = clinicData?.settings?.[0]
  const heroImage = settings?.heroImage

  return (
    <section className="relative overflow-hidden bg-slate-950 dark-texture">
      <div className="relative min-h-[700px] lg:min-h-[85vh]">
        {heroImage ? (
          <div>
            <img
              src={heroImage}
              alt="Dental Clinic"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900" />
            <div className="absolute top-[10%] right-[10%] w-[700px] h-[700px] rounded-full bg-emerald-700/10 blur-[140px]" />
            <div className="absolute bottom-0 left-[0%] w-[500px] h-[500px] rounded-full bg-amber-600/6 blur-[120px]" />
            <div className="absolute top-[50%] left-[30%] w-[300px] h-[300px] rounded-full bg-emerald-400/8 blur-[80px]" />
            <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-br from-white/2 to-transparent rotate-12" />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-full flex items-end pb-16 lg:pb-24 pt-32 lg:pt-40">
          <div className="max-w-2xl">
            <div className="animate-fade-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 mb-6">
              <span className="text-xs font-medium text-white/80">
                Welcome to {clinicName}
              </span>
            </div>

            <h1 className="animate-fade-up stagger-1 text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-5">
              Your Smile Deserves{' '}
              <span className="text-amber-400">Expert Care</span>
            </h1>

            <p className="animate-fade-up stagger-2 text-white/70 text-base sm:text-lg leading-relaxed max-w-lg mb-10 line-clamp-3">
              {clinicData?.description ||
                'Experience gentle, personalized dental care with modern technology. From routine checkups to advanced cosmetic treatments — your comfort is our priority.'}
            </p>

            <div className="animate-fade-up stagger-3 flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href="#/book"
                className="inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-full px-8 h-[54px] text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full px-8 h-[54px] text-sm font-medium transition-all"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            </div>

            <div className="animate-fade-up stagger-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Safe &amp; Hygienic</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Mon – Sat, 10AM – 6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
