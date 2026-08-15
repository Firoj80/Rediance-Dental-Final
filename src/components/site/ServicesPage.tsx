'use client'

import { useState } from 'react'
import { ArrowRight, Search, Stethoscope, Syringe, Smile, ScanFace, Sparkles, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore, type ServiceData } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

const SERVICE_ICONS = [Stethoscope, Syringe, Smile, ScanFace, Sparkles, ShieldCheck]

export function ServicesPage() {
  const services = useSiteStore((s) => s.services)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const [search, setSearch] = useState('')
  const { ref, inView } = useInView()

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDescription?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Comprehensive dental treatments tailored to your needs.
          </p>
        </div>
      </section>

      {/* Search & Grid */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {clinicLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : (
            <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service, i) => {
                const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
                return (
                  <ServiceCard key={service.id} service={service} Icon={Icon} index={i} inView={inView} />
                )
              })}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No services found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ServiceCard({
  service,
  Icon,
  index,
  inView,
}: {
  service: ServiceData
  Icon: React.ElementType
  index: number
  inView: boolean
}) {
  return (
    <div
      className={`card-hover bg-white rounded-xl border overflow-hidden transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      <div className="img-zoom">
        {service.image ? (
          <img src={service.image} alt={service.name} className="w-full aspect-[4/3] object-cover" />
        ) : (
          <div className="aspect-[4/3] bg-teal-50 flex items-center justify-center">
            <Icon className="w-12 h-12 text-teal-300" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{service.name}</h3>
          {service.price != null && (
            <span className="text-sm font-medium text-primary">₹{service.price}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {service.shortDescription || 'Professional dental treatment with modern technology.'}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{service.duration} min</span>
          <button
            onClick={() => { window.location.hash = `#/services/${service.slug}` }}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Learn More <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
