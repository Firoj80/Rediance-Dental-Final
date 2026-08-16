'use client'

import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore, type ServiceData } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

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
      {/* Compact Page Header */}
      <section className="bg-white border-b border-slate-100 py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label text-emerald-600 mb-3 block">Our Services</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Dental Services
          </h1>
          <p className="text-slate-500 text-sm">
            {services.length} treatments available
          </p>
        </div>
      </section>

      {/* Search & Grid */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="max-w-md mb-10 mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          {clinicLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} inView={inView} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400 text-sm">No services found matching your search.</p>
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
  index,
  inView,
}: {
  service: ServiceData
  index: number
  inView: boolean
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 card-hover transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      {/* Image if available */}
      {service.image && (
        <div className="h-40 rounded-t-2xl overflow-hidden img-zoom">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-6">
        {/* Top row: title + featured badge */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
          {service.featured && (
            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-2 shrink-0">
              Popular
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {service.shortDescription || 'Professional dental treatment with modern technology.'}
        </p>

        {/* Bottom row: price/duration + learn more */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-3">
            {service.price != null && service.price > 0 ? (
              <span className="text-emerald-700 font-semibold text-sm">
                ₹{service.price.toLocaleString('en-IN')}
              </span>
            ) : null}
            <span className="text-xs text-slate-400">{service.duration} min</span>
          </div>
          <button
            onClick={() => { window.location.hash = `#/services/${service.slug}` }}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors"
          >
            Learn More <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
