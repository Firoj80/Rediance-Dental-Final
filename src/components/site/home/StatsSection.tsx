'use client'

import { Users, Clock, Stethoscope, Star } from 'lucide-react'
import { useSiteStore } from '@/lib/store'
import { useInView, useAnimatedCounter } from '@/hooks/use-in-view'

function CounterCard({
  icon: Icon,
  value,
  label,
  inView,
}: {
  icon: React.ElementType
  value: number
  label: string
  inView: boolean
}) {
  const count = useAnimatedCounter(value, inView)
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-3">
        <Icon className="w-6 h-6 text-teal-200" />
      </div>
      <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
        {count.toLocaleString()}+
      </div>
      <p className="text-sm text-teal-100/80">{label}</p>
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
    <section className="py-16 lg:py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <CounterCard icon={Clock} value={years} label="Years of Experience" inView={inView} />
          <CounterCard icon={Users} value={patients} label="Happy Patients" inView={inView} />
          <CounterCard icon={Stethoscope} value={servicesCount} label="Services Offered" inView={inView} />
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-3">
              <Star className="w-6 h-6 text-teal-200" />
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
              {rating}/5
            </div>
            <p className="text-sm text-teal-100/80">Patient Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
