'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, CalendarPlus, IndianRupee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useInView } from '@/hooks/use-in-view'
import ReactMarkdown from 'react-markdown'

export function ServiceDetailPage({ slug }: { slug: string }) {
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { ref, inView } = useInView()

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
        <section className="bg-primary py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
        </section>
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Skeleton className="h-64 rounded-xl" />
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">The service you are looking for does not exist.</p>
          <Button variant="outline" onClick={() => { window.location.hash = '#/services' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => { window.location.hash = '#/services' }}
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Services
          </button>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">{service.name}</h1>
          <div className="flex items-center justify-center gap-4 text-white/70">
            <span className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4" />
              {service.duration} minutes
            </span>
            {service.price != null && (
              <span className="flex items-center gap-1 text-sm">
                <IndianRupee className="w-4 h-4" />
                {service.price}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={ref}
            className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {/* Image */}
            {service.image && (
              <div className="rounded-xl overflow-hidden mb-10">
                <img src={service.image} alt={service.name} className="w-full aspect-[16/9] object-cover" />
              </div>
            )}

            {/* Description */}
            {service.fullDescription && (
              <div className="prose-dental mb-10">
                <ReactMarkdown>{service.fullDescription}</ReactMarkdown>
              </div>
            )}

            {service.shortDescription && !service.fullDescription && (
              <p className="text-muted-foreground leading-relaxed text-lg mb-10">{service.shortDescription}</p>
            )}

            <Separator className="my-8" />

            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold text-foreground">{service.duration} minutes</p>
              </div>
              {service.price != null && (
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <IndianRupee className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Starting Price</p>
                  <p className="font-semibold text-foreground">₹{service.price}</p>
                </div>
              )}
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Badge variant="secondary" className="mb-2">Status</Badge>
                <p className="font-semibold text-foreground">Available</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => { window.location.hash = '#/book' }}
                className="bg-primary hover:bg-primary/90 text-white shadow-md"
              >
                <CalendarPlus className="w-4 h-4" />
                Book This Service
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
