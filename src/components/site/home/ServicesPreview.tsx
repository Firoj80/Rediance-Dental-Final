'use client'

import { ArrowRight, ChevronRight, Shield, Sparkles, Heart, ScanLine, Palette, Clock, Stethoscope } from 'lucide-react'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

const SERVICE_ICONS = [Stethoscope, Sparkles, Shield, Heart, ScanLine, Palette, Clock, Stethoscope, Sparkles]

export function ServicesPreview() {
  const featuredServices = useSiteStore((s) => s.featuredServices)
  const { ref, inView } = useInView()

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="section-label text-emerald-600 mb-3 block">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Comprehensive Dental Care
          </h2>
          <p className="text-slate-500 leading-relaxed">
            From routine checkups to advanced cosmetic procedures, we deliver personalized treatments for the whole family.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredServices.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
            return (
              <a
                key={service.id}
                href={`#/services/${service.slug}`}
                className={
                  `group bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                }
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {/* Icon + badge row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  {service.featured && i < 2 && (
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                {/* Service name */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {service.name}
                </h3>

                {/* Short description */}
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-5">
                  {service.shortDescription || 'Professional dental treatment with the latest technology.'}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-sm">
                    {service.price != null && service.price > 0 ? (
                      <span className="text-emerald-700 font-semibold">
                        ₹{service.price.toLocaleString('en-IN')}
                      </span>
                    ) : null}
                    <span className="text-xs text-slate-400">{service.duration} min</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </a>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { window.location.hash = '#/services' }}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl px-6 py-2.5 transition-all"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
