'use client'

import { useSiteStore } from '@/lib/store'
import { useInView, useAnimatedCounter } from '@/hooks/use-in-view'
import { Star } from 'lucide-react'

function CountStat({ value, label, suffix = '+' }: { value: number; label: string; suffix?: string }) {
  const { ref, inView } = useInView()
  const count = useAnimatedCounter(value, inView)
  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl sm:text-3xl font-bold text-white">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-xs sm:text-sm text-white/40 mt-0.5">{label}</p>
    </div>
  )
}

export function TrustStrip() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const settings = clinicData?.settings?.[0]
  const years = parseInt(settings?.statYears || '10', 10) || 10
  const patients = parseInt(settings?.statPatients || '5000', 10) || 5000
  const servicesCount = parseInt(settings?.statServices || '15', 10) || 15
  const rating = parseFloat(settings?.statRating || '4.8')

  return (
    <section className="border-y border-white/10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-white/10">
          <CountStat value={years} label="Years Experience" />
          <CountStat value={patients} label="Happy Patients" />
          <CountStat value={servicesCount} label="Treatments" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-white">{rating}</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-xs sm:text-sm text-white/40 mt-0.5">Patient Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
