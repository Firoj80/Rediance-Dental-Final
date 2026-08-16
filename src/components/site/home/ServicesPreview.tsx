'use client'

import { ArrowRight, ChevronRight, Shield, Sparkles, Heart, ScanLine, Palette, Clock, Stethoscope, Smile } from 'lucide-react'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

const SERVICE_ICONS = [Stethoscope, Sparkles, Shield, Heart, ScanLine, Palette, Clock, Smile, Stethoscope]

export function ServicesPreview() {
  const featuredServices = useSiteStore((s) => s.featuredServices)
  const { ref, inView } = useInView()

  return (
    <section className="py-24 lg:py-32 bg-slate-950 dark-texture">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-16 mx-auto text-center">
          <span className="section-label text-amber-400 mb-3 block">Our Services</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Comprehensive Dental Care
          </h2>
          <p className="text-white/50 leading-relaxed text-[15px]">
            From routine checkups to advanced cosmetic procedures, we deliver personalized treatments with a gentle touch.
          </p>
        </div>

        {/* Service Cards Grid — Glassmorphism */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {featuredServices.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
            return (
              <a
                key={service.id}
                href={`#/services/${service.slug}`}
                className={
                  `group relative bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-500
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
                }
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Icon row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:bg-amber-500/25 transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  {service.featured && i < 2 && (
                    <span className="bg-amber-500/15 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/20">
                      Popular
                    </span>
                  )}
                </div>

                {/* Service name */}
                <h3 className="text-lg font-semibold text-white mb-2.5 group-hover:text-amber-300 transition-colors">
                  {service.name}
                </h3>

                {/* Short description */}
                <p className="text-sm text-white/50 leading-relaxed line-clamp-2 mb-6">
                  {service.shortDescription || 'Professional dental treatment with the latest technology and care.'}
                </p>

                {/* Learn more link */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-amber-400/70 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => { window.location.hash = '#/services' }}
            className="inline-flex items-center gap-2.5 text-sm font-medium text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 rounded-full px-6 py-2.5 transition-all"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
