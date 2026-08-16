'use client'

import { ArrowRight, Phone, Star, Shield, Clock } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function HeroSection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const phone = clinicData?.phone || '+91 96573 72836'
  const settings = clinicData?.settings?.[0]
  const statYears = settings?.statYears || '10+'
  const statRating = settings?.statRating || '4.8'
  const heroImage = settings?.heroImage

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative min-h-[600px] lg:min-h-[680px]">
        {heroImage ? (
          <div>
            <img
              src={heroImage}
              alt="Dental Clinic"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/20" />
          </div>
        ) : (
          <div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent" />
            <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-emerald-600/20 blur-3xl" />
            <div className="absolute bottom-10 left-[5%] w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-3xl" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-32 lg:pt-40 pb-16 lg:pb-24">
          <div className="max-w-2xl">
            <div className="animate-fade-up inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 mb-8">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-white/90">
                {statRating}/5 Rating · Trusted by thousands in Siwan
              </span>
            </div>

            <h1 className="animate-fade-up stagger-1 text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-6">
              Your Smile Deserves{' '}
              <span className="text-amber-300">Expert Care</span>
            </h1>

            <p className="animate-fade-up stagger-2 text-white/75 text-base sm:text-lg leading-relaxed max-w-lg mb-10 line-clamp-3">
              {clinicData?.description ||
                'Experience gentle, personalized dental care with modern technology. From routine checkups to advanced cosmetic treatments — your comfort is our priority.'}
            </p>

            <div className="animate-fade-up stagger-3 flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href="#/book"
                className="inline-flex items-center justify-center gap-2.5 bg-white text-emerald-800 font-semibold rounded-full px-8 h-[52px] text-sm transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full px-8 h-[52px] text-sm font-medium transition-all"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            </div>

            <div className="animate-fade-up stagger-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2.5 text-sm text-white/70">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-300" />
                </div>
                <span>Safe &amp; Hygienic</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/70">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-emerald-300" />
                </div>
                <span>Mon – Sat, 10AM – 6PM</span>
              </div>
            </div>
          </div>
        </div>

        {heroImage ? null : (
          <div>
            <div className="hidden lg:block absolute right-[8%] top-[35%]">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/10 p-5 animate-float w-[180px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{statRating}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.round(Number(statRating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Patient Rating</p>
              </div>
            </div>

            <div className="hidden lg:block absolute right-[18%] bottom-[25%]">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/10 p-4 animate-float stagger-2 w-[160px]">
                <p className="text-3xl font-bold text-emerald-700 mb-0.5">{statYears}</p>
                <p className="text-xs text-slate-500">Years of Experience</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
