'use client'

import { Award, Clock, HeartPulse, ShieldCheck, Sparkles, BadgeCheck, Users } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const FEATURES = [
  { icon: Award, title: 'Experienced Doctor', description: 'Over a decade of expertise in general dentistry and facial trauma treatment.' },
  { icon: Sparkles, title: 'Modern Equipment', description: 'State-of-the-art digital X-rays and precision instruments for accurate results.' },
  { icon: HeartPulse, title: 'Gentle Care', description: 'Your comfort comes first — we use gentle techniques and take time with every patient.' },
  { icon: ShieldCheck, title: 'Safe & Hygienic', description: 'Hospital-grade sterilization and strict infection control protocols for your safety.' },
  { icon: Clock, title: 'Flexible Hours', description: 'Convenient Monday to Saturday schedule that fits your busy life.' },
  { icon: Users, title: 'Family Friendly', description: 'We welcome patients of all ages and create a comfortable experience for everyone.' },
]

export function WhyChooseUs() {
  const { ref, inView } = useInView()

  return (
    <section className="py-20 lg:py-28 bg-slate-50/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-14 mx-auto text-center">
          <span className="section-label text-emerald-600 mb-3 block">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-5 leading-tight">
            What Makes Us Different
          </h2>
          <p className="text-slate-500 leading-relaxed text-[15px]">
            We combine clinical excellence with genuine compassion to give you the best dental experience in Siwan.
          </p>
        </div>

        {/* Features grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={
                  `bg-white rounded-2xl p-6 border border-slate-100/80 hover:shadow-lg hover:shadow-slate-900/3 transition-all duration-500
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
                }
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
