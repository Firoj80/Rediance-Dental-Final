'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-16 lg:py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
          <Sparkles className="w-4 h-4 text-teal-200" />
          <span className="text-sm text-teal-100">Start your journey today</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready for a Healthier Smile?
        </h2>
        <p className="text-white/75 mb-8 max-w-xl mx-auto text-lg">
          Schedule your appointment today and experience the difference quality dental care can make.
        </p>
        <Button
          size="lg"
          onClick={() => { window.location.hash = '#/book' }}
          className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold"
        >
          Book Appointment
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  )
}
