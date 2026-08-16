'use client'

import { Award, Clock, HeartPulse, ShieldCheck, Sparkles, BadgeCheck, Users, ThumbsUp } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const FEATURES = [
  { icon: Award, title: 'Experienced Doctor', description: 'Years of expertise in dental care and facial trauma treatment.' },
  { icon: Sparkles, title: 'Modern Equipment', description: 'State-of-the-art technology for precise diagnostics and treatments.' },
  { icon: HeartPulse, title: 'Gentle Care', description: 'Your comfort comes first with gentle techniques and compassion.' },
  { icon: ShieldCheck, title: 'Safe & Hygienic', description: 'Strict sterilization and infection control for your safety.' },
  { icon: Clock, title: 'Flexible Hours', description: 'Convenient appointment times that fit your busy schedule.' },
  { icon: BadgeCheck, title: 'Affordable Prices', description: 'Quality care at competitive prices with transparent billing.' },
]

export function WhyChooseUs() {
  const { ref, inView } = useInView()

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="section-label text-emerald-600 mb-3 block">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            What Makes Us Different
          </h2>
          <p className="text-slate-500 leading-relaxed">
            We combine clinical excellence with genuine care to give you the best dental experience.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`
                  bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all duration-300
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
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
