'use client'

import { ArrowRight, ChevronRight, Shield, Sparkles, Heart, ScanLine, Palette, Clock, Stethoscope, Smile } from 'lucide-react'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

const SERVICE_ICONS = [Stethoscope, Sparkles, Shield, Heart, ScanLine, Palette, Clock, Smile, Stethoscope]

export function ServicesPreview() {
  const featuredServices = useSiteStore((s) => s.featuredServices)
  const { ref, inView } = useInView()

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-14">
          <span className="section-label text-emerald-600 mb-3 block">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            Comprehensive Dental Care for Your Whole Family
          </h2>
          <p className="text-slate-500 leading-relaxed text-[15px]">
            From routine checkups to advanced cosmetic procedures, we deliver personalized treatments with a gentle touch.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {featuredServices.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
            return (
              <a
                key={service.id}
                href={`#/services/${service.slug}`}
                className={
                  `group relative bg-white rounded-2xl p-7 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50/50 transition-all duration-500
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
                }
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Icon row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  {service.featured && i < 2 && (
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                {/* Service name */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2.5 group-hover:text-emerald-700 transition-colors">
                  {service.name}
                </h3>

                {/* Short description */}
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-6">
                  {service.shortDescription || 'Professional dental treatment with the latest technology and care.'}
                </p>

                {/* Learn more link */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12">
          <button
            onClick={() => { window.location.hash = '#/services' }}
            className="inline-flex items-center gap-2.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-full px-6 py-2.5 transition-all"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
