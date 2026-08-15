'use client'

import { ArrowRight, Stethoscope, Syringe, Smile, ScanFace, Sparkles, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

const SERVICE_ICONS = [Stethoscope, Syringe, Smile, ScanFace, Sparkles, ShieldCheck]

export function ServicesPreview() {
  const featuredServices = useSiteStore((s) => s.featuredServices)
  const { ref, inView } = useInView()

  return (
    <section className="py-16 lg:py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive dental care tailored to your needs, from routine checkups to advanced treatments.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
            return (
              <div
                key={service.id}
                className={`card-hover bg-white rounded-xl border overflow-hidden transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="img-zoom">
                  <div className="aspect-[4/3] bg-teal-50 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-teal-300" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {service.shortDescription || 'Professional dental treatment with the latest technology.'}
                  </p>
                  <button
                    onClick={() => { window.location.hash = `#/services/${service.slug}` }}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" onClick={() => { window.location.hash = '#/services' }}>
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
