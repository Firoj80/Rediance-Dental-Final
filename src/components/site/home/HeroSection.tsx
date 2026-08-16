'use client'

import { ArrowRight, Phone, Star, Shield, Clock } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function HeroSection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const phone = clinicData?.phone || '+91 96573 72836'

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white to-amber-50/40" />
      
      {/* Subtle decorative shape */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <div className="animate-fade-up">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-emerald-200/60 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-medium text-slate-600">Trusted by 5,000+ patients in Siwan</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 leading-[1.1] tracking-tight mb-5">
              Your Smile Deserves{' '}
              <span className="text-emerald-700">Expert Care</span>
            </h1>

            {/* Description */}
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
              {clinicData?.description?.substring(0, 180) ||
                'Experience gentle, personalized dental care with modern technology. From routine checkups to advanced cosmetic treatments — your comfort is our priority.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href="#/book"
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl px-7 h-12 text-sm transition-all shadow-lg shadow-emerald-700/20 hover:shadow-xl hover:shadow-emerald-700/25 hover:-translate-y-0.5"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 rounded-xl px-7 h-12 text-sm font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            </div>

            {/* Quick trust indicators */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Safe & Hygienic</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Mon – Sat, 10AM – 6PM</span>
              </div>
            </div>
          </div>

          {/* Right — Image / Visual */}
          <div className="animate-fade-up stagger-2 hidden lg:block">
            <div className="relative">
              {/* Main image container */}
              <div className="rounded-3xl overflow-hidden h-[440px] xl:h-[500px] shadow-2xl shadow-slate-900/10">
                {clinicData?.settings?.[0]?.heroImage ? (
                  <img
                    src={clinicData.settings[0].heroImage}
                    alt="Dental Care"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-700/20">
                        <span className="text-3xl">🦷</span>
                      </div>
                      <p className="text-emerald-700/60 text-sm font-medium">Radiance Dental Care</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating card — Rating */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl shadow-slate-900/8 p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">4.8 / 5.0</p>
                    <p className="text-xs text-slate-400">Patient Rating</p>
                  </div>
                </div>
              </div>

              {/* Floating card — Experience */}
              <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-xl shadow-slate-900/8 p-3 animate-float stagger-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <span className="text-emerald-700 text-xs font-bold">10+</span>
                  </div>
                  <span className="text-xs font-medium text-slate-600">Years Exp.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
