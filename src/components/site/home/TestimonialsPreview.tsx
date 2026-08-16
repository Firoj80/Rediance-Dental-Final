'use client'

import { Star } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useSiteStore, type TestimonialData } from '@/lib/store'
import { Skeleton } from '@/components/ui/skeleton'

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  const initials = testimonial.patientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)

  return (
    <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 relative mx-1">
      {/* Decorative quote mark */}
      <span className="absolute top-4 left-6 text-emerald-200 text-6xl font-serif leading-none select-none">
        &ldquo;
      </span>

      {/* Review text */}
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed relative z-10 pl-2 mb-6">
        {testimonial.review}
      </p>

      {/* Bottom row: avatar + name + stars */}
      <div className="flex items-center gap-3 relative z-10">
        {testimonial.photo ? (
          <img
            src={testimonial.photo}
            alt={testimonial.patientName}
            className="rounded-full w-10 h-10 object-cover"
          />
        ) : (
          <div className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
            {initials}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900">{testimonial.patientName}</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < testimonial.rating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsPreview() {
  const testimonials = useSiteStore((s) => s.testimonials)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)

  if (clinicLoading) {
    return (
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-28 mb-3" />
          <Skeleton className="h-8 w-64 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <span className="section-label text-emerald-600 mb-3 block">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            What Our Patients Say
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{ align: 'start', loop: testimonials.length > 3 }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.slice(0, 6).map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {testimonials.length > 3 && (
            <>
              <CarouselPrevious className="hidden md:flex -left-4 h-8 w-8 rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-500" />
              <CarouselNext className="hidden md:flex -right-4 h-8 w-8 rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-500" />
            </>
          )}
        </Carousel>

        {/* View All link */}
        <div className="text-center mt-10">
          <button
            onClick={() => { window.location.hash = '#/testimonials' }}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
          >
            View All Testimonials
            <span className="text-base leading-none">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  )
}
