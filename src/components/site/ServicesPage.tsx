'use client'

import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore, type ServiceData } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'
import { Stethoscope, Sparkles, Shield, Heart, ScanLine, Palette, Clock, Smile } from 'lucide-react'

const SERVICE_ICONS = [Stethoscope, Sparkles, Shield, Heart, ScanLine, Palette, Clock, Smile, Stethoscope]

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
      <section className="page-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <span className="section-label text-emerald-600 mb-3 block">Our Services</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Dental Services
          </h1>
          <p className="text-slate-500 text-[15px]">
            {services.length} treatments available to keep your smile healthy
          </p>
        </div>
      </section>

      {/* Search & Grid */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Search Bar */}
          <div className="max-w-sm mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 rounded-xl border-slate-200 focus:border-emerald-500 bg-slate-50/50 h-11"
              />
            </div>
          </div>

          {clinicLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} inView={inView} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16">
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
  const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length]
  return (
    <a
      href={`#/services/${service.slug}`}
      className={
        `bg-white rounded-2xl border border-slate-100 card-hover overflow-hidden cursor-pointer block transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
      }
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      {/* Image or Icon area */}
      {service.image ? (
        <div className="h-44 rounded-t-2xl overflow-hidden img-zoom">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-emerald-50/50 to-white flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Top row: title + featured badge */}
        <div className="flex items-start justify-between mb-2.5">
          <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
          {service.featured && (
            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ml-2 shrink-0">
              Popular
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 mb-5 leading-relaxed">
          {service.shortDescription || 'Professional dental treatment with modern technology.'}
        </p>

        {/* Learn more */}
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
          Learn More <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  )
}