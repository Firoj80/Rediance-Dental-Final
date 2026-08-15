'use client'

import { Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function ClinicIntro() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const { ref, inView } = useInView()

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`max-w-3xl mx-auto text-center transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 mb-6">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Welcome to {clinicData?.name || 'Radiance Dental Care'}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            {clinicData?.description ||
              'We are dedicated to providing exceptional dental care in a comfortable and welcoming environment. Our state-of-the-art facility and experienced team ensure you receive the highest quality treatment.'}
          </p>
          <Button variant="outline" onClick={() => { window.location.hash = '#/about' }}>
            Learn More About Us
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
