'use client'

import { Award, Clock, HeartPulse, ShieldCheck, Sparkles, BadgeCheck } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const FEATURES = [
  { icon: Award, title: 'Experienced Doctor', description: 'Dr. Shahid Raza brings years of expertise in dental care and facial trauma treatment.' },
  { icon: Sparkles, title: 'Modern Equipment', description: 'State-of-the-art dental technology for precise diagnostics and comfortable treatments.' },
  { icon: HeartPulse, title: 'Gentle Care', description: 'We prioritize your comfort with gentle techniques and a compassionate approach.' },
  { icon: ShieldCheck, title: 'Safe & Hygienic', description: 'Strict sterilization protocols and infection control standards for your safety.' },
  { icon: Clock, title: 'Flexible Hours', description: 'Convenient appointment times that fit your busy schedule.' },
  { icon: BadgeCheck, title: 'Affordable Prices', description: 'Quality dental care at competitive prices with transparent billing.' },
]

export function WhyChooseUs() {
  const { ref, inView } = useInView()

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine expertise, technology, and compassion to deliver the best dental experience.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`text-center transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-50 mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
