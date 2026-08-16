'use client'

import { Star, Quote } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useSiteStore, type TestimonialData } from '@/lib/store'
import { Skeleton } from '@/components/ui/skeleton'

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 mx-1 h-full">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-6">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {testimonial.photo ? (
          <img
            src={testimonial.photo}
            alt={testimonial.patientName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-xs font-bold text-emerald-700">
              {testimonial.patientName.split(' ').map((n) => n[0]).join('').substring(0, 2)}
            </span>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900">{testimonial.patientName}</p>
          <p className="text-xs text-slate-400">{testimonial.service || 'Patient'}</p>
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
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-3 w-20 mx-auto mb-3" />
            <Skeleton className="h-8 w-52 mx-auto" />
          </div>
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
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="section-label text-emerald-600 mb-3 block">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            What Our Patients Say
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Real stories from real patients who trust us with their smiles.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{ align: 'start', loop: testimonials.length > 3 }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {testimonials.slice(0, 6).map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-3 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {testimonials.length > 3 && (
            <>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white border-slate-200 hover:bg-white" />
              <CarouselNext className="hidden md:flex -right-12 bg-white border-slate-200 hover:bg-white" />
            </>
          )}
        </Carousel>

        {/* View all link */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { window.location.hash = '#/testimonials' }}
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Read all reviews →
          </button>
        </div>
      </div>
    </section>
  )
}
