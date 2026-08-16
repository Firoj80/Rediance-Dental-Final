'use client'

import { Star, Quote } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useSiteStore, type TestimonialData } from '@/lib/store'
import { Skeleton } from '@/components/ui/skeleton'

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-7 sm:p-8 border border-white/10 mx-1 h-full flex flex-col">
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-emerald-500/20 mb-5 shrink-0" />

      {/* Review text */}
      <p className="text-white/70 text-[15px] leading-relaxed mb-6 flex-1">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`}
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        {testimonial.photo ? (
          <img
            src={testimonial.photo}
            alt={testimonial.patientName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-xs font-bold text-white/70">
              {testimonial.patientName.split(' ').map((n) => n[0]).join('').substring(0, 2)}
            </span>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-white">{testimonial.patientName}</p>
          <p className="text-xs text-white/40">{(testimonial as any).service || 'Patient'}</p>
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
      <section className="py-16 lg:py-20 bg-slate-950 dark-texture">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-8">
            <Skeleton className="h-3 w-20 mx-auto mb-3 bg-white/10" />
            <Skeleton className="h-8 w-52 mx-auto bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl bg-white/5" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  return (
    <section className="py-16 lg:py-20 bg-slate-950 dark-texture">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-10 mx-auto text-center">
          <span className="section-label text-amber-400 mb-3 block">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            What Our Patients Say
          </h2>
          <p className="text-white/50 leading-relaxed text-[15px]">
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
              <CarouselPrevious className="hidden md:flex -left-14 bg-white/10 border-white/10 hover:bg-white/15 hover:border-white/20 text-white shadow-lg shadow-black/20 w-10 h-10" />
              <CarouselNext className="hidden md:flex -right-14 bg-white/10 border-white/10 hover:bg-white/15 hover:border-white/20 text-white shadow-lg shadow-black/20 w-10 h-10" />
            </>
          )}
        </Carousel>

        {/* View all link */}
        <div className="mt-12 text-center">
          <button
            onClick={() => { window.location.hash = '#/testimonials' }}
            className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Read all reviews →
          </button>
        </div>
      </div>
    </section>
  )
}
