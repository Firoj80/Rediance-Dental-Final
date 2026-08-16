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
        <section className="page-header">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
            <Skeleton className="h-3 w-24 mb-3 mx-auto bg-surface-variant" />
            <Skeleton className="h-8 w-72 mb-2 mx-auto bg-surface-variant" />
          </div>
        </section>
        <section className="py-10 lg:py-14 bg-surface">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 space-y-4">
            <Skeleton className="h-72 rounded-xl bg-surface-variant" />
            <Skeleton className="h-4 w-full bg-surface-variant" />
            <Skeleton className="h-4 w-full bg-surface-variant" />
            <Skeleton className="h-4 w-3/4 bg-surface-variant" />
          </div>
        </section>
      </div>
    )
  }

  if (notFound || !service) {
    return (
      <div className="pt-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-heading mb-2">Service Not Found</h1>
          <p className="text-body mb-6">The service you are looking for does not exist.</p>
          <button
            onClick={() => { window.location.hash = '#/services' }}
            className="bg-teal hover:bg-teal-dark text-teal-text font-semibold rounded px-6 py-2.5 text-sm transition-colors inline-flex items-center gap-2"
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
      <section className="page-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <div className="mb-4">
            <button
              onClick={() => { window.location.hash = '#/services' }}
              className="inline-flex items-center gap-1.5 text-sm text-subtle hover:text-teal transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Services
            </button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading tracking-tight">
            {service.name}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 lg:py-12 bg-surface">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="animate-fade-up">
            {/* Image */}
            {service.image && (
              <div className="rounded-xl overflow-hidden h-64 lg:h-80 mb-8">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Duration info bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-surface-low rounded-xl border border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="text-xs text-subtle uppercase tracking-wide font-medium">Estimated Duration</span>
                <span className="flex items-center gap-1 text-sm text-body font-medium">
                  <Clock className="w-4 h-4 text-subtle" />
                  {service.duration} minutes
                </span>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => { window.location.hash = '#/book' }}
                  className="bg-teal hover:bg-teal-dark text-teal-text font-medium rounded px-6 py-2.5 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Full Description */}
            {service.fullDescription ? (
              <div className="prose-dental mb-10">
                <ReactMarkdown>{service.fullDescription}</ReactMarkdown>
              </div>
            ) : service.shortDescription ? (
              <p className="text-body leading-relaxed text-lg mb-10">{service.shortDescription}</p>
            ) : null}

            {/* Bottom CTA Card */}
            <div className="bg-surface-low rounded-xl p-8 sm:p-10 border border-border-subtle text-center">
              <h3 className="text-xl font-semibold text-heading mb-2">Ready to book?</h3>
              <p className="text-sm text-body mb-8 max-w-md mx-auto">
                Schedule your {service.name.toLowerCase()} appointment today. We look forward to helping you.
              </p>
              <button
                onClick={() => { window.location.hash = '#/book' }}
                className="bg-teal hover:bg-teal-dark text-teal-text font-semibold rounded px-8 h-12 text-sm transition-all inline-flex items-center gap-2.5"
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