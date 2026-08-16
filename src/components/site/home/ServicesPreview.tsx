'use client'

import { ArrowRight } from 'lucide-react'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function ServicesPreview() {
  const featuredServices = useSiteStore((s) => s.featuredServices)
  const { ref, inView } = useInView()

  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="section-label text-emerald-600 mb-3 block">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Comprehensive Dental Care
          </h2>
          <p className="text-slate-500 max-w-xl leading-relaxed mx-auto">
            From routine checkups to advanced cosmetic procedures, we deliver personalized treatments
            using the latest dental technology.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredServices.map((service, i) => (
            <div
              key={service.id}
              className={`
                bg-white rounded-2xl p-6 border border-slate-100 card-hover
                transition-all duration-500
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Top row: numbered dot + featured badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {service.featured && i < 2 && (
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>

              {/* Service name */}
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                {service.name}
              </h3>

              {/* Short description */}
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                {service.shortDescription || 'Professional dental treatment with the latest technology and care.'}
              </p>

              {/* Bottom row: price + learn more */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                {service.price != null && service.price > 0 ? (
                  <span className="text-emerald-700 font-semibold text-sm">
                    ₹{service.price.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold text-sm">
                    {service.duration} min
                  </span>
                )}
                <button
                  onClick={() => { window.location.hash = `#/services/${service.slug}` }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors"
                >
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { window.location.hash = '#/services' }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors inline-flex items-center gap-2"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
