'use client'

import { useSiteStore } from '@/lib/store'
import { useInView, useAnimatedCounter } from '@/hooks/use-in-view'

function StatItem({
  value,
  label,
  inView,
  suffix = '+',
  isLast = false,
}: {
  value: number
  label: string
  inView: boolean
  suffix?: string
  isLast?: boolean
}) {
  const count = useAnimatedCounter(value, inView)
  return (
    <div
      className={`
        text-center py-6 lg:py-8 px-4
        ${!isLast ? 'lg:border-r lg:border-emerald-700/40 sm:border-b sm:border-emerald-700/40' : 'sm:border-b-0'}
      `}
    >
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-emerald-300/80 text-xs sm:text-sm uppercase tracking-widest font-medium mt-2">
        {label}
      </p>
    </div>
  )
}

function RatingItem({
  value,
  label,
  inView,
  isLast = false,
}: {
  value: number
  label: string
  inView: boolean
  isLast?: boolean
}) {
  return (
    <div
      className={`
        text-center py-6 lg:py-8 px-4
        ${!isLast ? 'lg:border-r lg:border-emerald-700/40 sm:border-b sm:border-emerald-700/40' : 'sm:border-b-0'}
      `}
    >
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
        {value}/5
      </div>
      <p className="text-emerald-300/80 text-xs sm:text-sm uppercase tracking-widest font-medium mt-2">
        {label}
      </p>
    </div>
  )
}

export function StatsSection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const { ref, inView } = useInView()

  const settings = clinicData?.settings?.[0]
  const years = parseInt(settings?.statYears || '10', 10) || 10
  const patients = parseInt(settings?.statPatients || '5000', 10) || 5000
  const servicesCount = parseInt(settings?.statServices || '15', 10) || 15
  const rating = parseFloat(settings?.statRating || '4.8')

  return (
    <section className="relative">
      {/* Thin amber accent line at top */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

      {/* Dark emerald background */}
      <div className="bg-emerald-900 py-4 lg:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            <StatItem value={years} label="Years of Experience" inView={inView} />
            <StatItem value={patients} label="Happy Patients" inView={inView} />
            <StatItem value={servicesCount} label="Services Offered" inView={inView} />
            <RatingItem value={rating} label="Patient Rating" inView={inView} isLast />
          </div>
        </div>
      </div>
    </section>
  )
}
