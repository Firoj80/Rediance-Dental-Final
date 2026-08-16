'use client'

import { useSiteStore } from '@/lib/store'
import { useInView, useAnimatedCounter } from '@/hooks/use-in-view'
import { Star } from 'lucide-react'

function CountStat({ value, label, suffix = '+' }: { value: number; label: string; suffix?: string }) {
  const { ref, inView } = useInView()
  const count = useAnimatedCounter(value, inView)
  return (
    <div ref={ref} className="text-center py-2">
      <div className="text-2xl sm:text-3xl font-bold text-teal">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-xs sm:text-sm text-subtle mt-1 uppercase tracking-wider font-semibold">{label}</p>
    </div>
  )
}

export function TrustStrip() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const settings = clinicData?.settings?.[0]
  const years = parseInt(settings?.statYears || '10', 10) || 10
  const patients = parseInt(settings?.statPatients || '5000', 10) || 5000
  const rating = parseFloat(settings?.statRating || '4.8')

  return (
    <section className="border-y border-border-subtle bg-surface-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-4 divide-x divide-border-subtle">
          <CountStat value={years} label="Years Experience" />
          <CountStat value={patients} label="Happy Patients" />
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-teal">{rating}</span>
              <Star className="w-5 h-5 text-teal fill-teal" />
            </div>
            <p className="text-xs sm:text-sm text-subtle mt-1 uppercase tracking-wider font-semibold">Patient Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
