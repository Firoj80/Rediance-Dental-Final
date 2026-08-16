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
    <section className="relative overflow-hidden">
      <div className="relative min-h-[700px] lg:min-h-screen flex items-center">
        {heroImage ? (
          <div>
            <img
              src={heroImage}
              alt="Dental Clinic"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0a111a]/60" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#0a111a]" />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full py-20 lg:py-0">
          <div className="max-w-2xl">
            {/* Top label */}
            <div className="animate-fade-up inline-flex items-center gap-2 mb-6">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-teal">
                Award-Winning Dental Care
              </span>
            </div>

            {/* Main heading */}
            <h1 className="animate-fade-up stagger-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Your Smile Deserves{' '}
              <span className="text-heading">Expert Care</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up stagger-2 text-body text-base sm:text-lg leading-relaxed max-w-lg mb-10 line-clamp-3">
              {clinicData?.description ||
                'Experience gentle, personalized dental care with modern technology. From routine checkups to advanced cosmetic treatments — your comfort is our priority.'}
            </p>

            {/* CTA buttons */}
            <div className="animate-fade-up stagger-3 flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#/book"
                className="inline-flex items-center justify-center gap-2.5 bg-teal hover:bg-teal-dark text-teal-text font-semibold rounded px-8 h-[54px] text-sm transition-all hover:shadow-lg hover:shadow-teal/20 hover:-translate-y-0.5"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2.5 border border-[#8e9196] text-heading hover:bg-surface-variant font-medium rounded px-8 h-[54px] text-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-up stagger-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2.5 text-sm text-body">
                <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center">
                  <Shield className="w-4 h-4 text-teal" />
                </div>
                <span>Safe &amp; Hygienic</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-body">
                <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center">
                  <Clock className="w-4 h-4 text-teal" />
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
