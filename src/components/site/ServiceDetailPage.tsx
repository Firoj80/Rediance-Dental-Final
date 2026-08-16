'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, CalendarPlus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import ReactMarkdown from 'react-markdown'

export function ServiceDetailPage({ slug }: { slug: string }) {
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchService() {
      setLoading(true)
      setNotFound(false)
      try {
        const res = await fetch(`/api/services/${slug}`)
        if (!res.ok) {
          setNotFound(true)
          return
        }
        const data = await res.json()
        setService(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [slug])

  if (loading) {
    return (
      <div className="pt-20">
        {/* Compact header skeleton */}
        <section className="bg-white border-b border-slate-100 py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-9 w-72 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </section>
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </section>
      </div>
    )
  }

  if (notFound || !service) {
    return (
      <div className="pt-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Service Not Found</h1>
          <p className="text-slate-500 mb-6">The service you are looking for does not exist.</p>
          <button
            onClick={() => { window.location.hash = '#/services' }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Compact Page Header with breadcrumb */}
      <section className="bg-white border-b border-slate-100 py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <button
            onClick={() => { window.location.hash = '#/services' }}
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Services
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            {service.name}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-up">
            {/* Image */}
            {service.image && (
              <div className="rounded-2xl overflow-hidden h-64 lg:h-80 mb-8 img-zoom">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Meta Row: price + duration + CTA */}
            <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
              {service.price != null && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Price</span>
                  <span className="text-emerald-700 font-semibold text-lg">₹{service.price.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-wide">Duration</span>
                <span className="flex items-center gap-1 text-sm text-slate-600 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {service.duration} minutes
                </span>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => { window.location.hash = '#/book' }}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Full Description */}
            {service.fullDescription ? (
              <div className="prose-dental mb-12">
                <ReactMarkdown>{service.fullDescription}</ReactMarkdown>
              </div>
            ) : service.shortDescription ? (
              <p className="text-slate-500 leading-relaxed text-lg mb-12">{service.shortDescription}</p>
            ) : null}

            {/* Bottom CTA Card */}
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to book?</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Schedule your {service.name.toLowerCase()} appointment today. We look forward to seeing you.
              </p>
              <button
                onClick={() => { window.location.hash = '#/book' }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg px-8 py-3 text-sm transition-colors inline-flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
