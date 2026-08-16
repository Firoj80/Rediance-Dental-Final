'use client'

import { ArrowRight, ChevronRight, Stethoscope, Sparkles, Shield, Heart, ScanLine, Palette, Clock, Smile } from 'lucide-react'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

const SERVICE_ICONS = [Stethoscope, Sparkles, Shield, Heart, ScanLine, Palette, Clock, Smile, Stethoscope]

export function ServicesPreview() {
  const featuredServices = useSiteStore((s) => s.featuredServices)
  const { ref, inView } = useInView()

  return (
    <section className="py-16 lg:py-20 bg-surface-dim">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-10 mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-heading tracking-tight mb-4 leading-tight uppercase">
            Experience a New Standard of Care
          </h2>
          <p className="text-body leading-relaxed text-[15px]">
            From routine checkups to advanced cosmetic procedures, we deliver personalized treatments with a gentle touch.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
            return (
              <a
                key={service.id}
                href={`#/services/${service.slug}`}
                className={
                  `group bg-surface-low rounded-xl border border-border-subtle overflow-hidden card-hover
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
                }
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Image placeholder or service image */}
                <div className="h-48 bg-surface-variant flex items-center justify-center overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-surface-dim/50 flex items-center justify-center border border-border-subtle">
                    <Icon className="w-7 h-7 text-teal" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-heading group-hover:text-teal transition-colors">
                      {service.name}
                    </h3>
                    {service.featured && i < 2 && (
                      <span className="bg-teal/10 text-teal text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded border border-teal/20">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {service.shortDescription || 'Professional dental treatment with the latest technology and care.'}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm font-medium text-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => { window.location.hash = '#/services' }}
            className="inline-flex items-center gap-2.5 text-sm font-medium text-teal hover:text-teal-dark border border-teal/30 hover:border-teal/50 hover:bg-teal/10 rounded px-6 py-2.5 transition-all"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
