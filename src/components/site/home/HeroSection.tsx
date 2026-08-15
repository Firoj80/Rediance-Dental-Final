'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteStore } from '@/lib/store'

export function HeroSection() {
  const clinicData = useSiteStore((s) => s.clinicData)

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center bg-gradient-to-br from-primary via-teal-700 to-teal-800 overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-teal-600/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span className="text-sm text-teal-100 font-medium">
              Trusted Dental Care in Siwan
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Your Smile,{' '}
            <span className="text-teal-200">Our Passion</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/75 mb-8 leading-relaxed max-w-xl">
            {clinicData?.description?.substring(0, 150) ||
              'Comprehensive dental care with modern technology, gentle treatment, and personalized attention for the whole family.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={() => { window.location.hash = '#/book' }}
              className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => { window.location.hash = '#/services' }}
              className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              View Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
