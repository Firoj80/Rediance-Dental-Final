'use client'

import { Stethoscope, ClipboardList, HeartHandshake } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const STEPS = [
  {
    icon: Stethoscope,
    step: '01',
    title: 'Diagnosis',
    description: 'Our experienced dentist performs a thorough examination using advanced digital imaging for accurate, comprehensive results.',
  },
  {
    icon: ClipboardList,
    step: '02',
    title: 'Planning',
    description: 'We create a personalized treatment plan tailored to your needs, explaining every option so you can make informed decisions.',
  },
  {
    icon: HeartHandshake,
    step: '03',
    title: 'Support',
    description: 'Receive ongoing care and follow-up support in a comfortable, modern environment with the latest dental technology.',
  },
]

export function WhyChooseUs() {
  const { ref, inView } = useInView()

  return (
    <section className="py-16 lg:py-20 bg-surface-lowest">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-10 mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-heading tracking-tight mb-4 leading-tight uppercase">
            Why Us <span className="text-teal">|</span> Our Approach
          </h2>
          <p className="text-body leading-relaxed text-[15px]">
            Three simple steps to the dental care you deserve. We make it easy and comfortable from start to finish.
          </p>
        </div>

        {/* Steps — Centered with circle icons */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-8 max-w-4xl mx-auto">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.step}
                className={`text-center transition-all duration-500 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Circle icon */}
                <div className="w-16 h-16 rounded-full bg-surface-variant text-teal flex items-center justify-center border border-border-subtle mx-auto mb-6">
                  <Icon className="w-7 h-7" />
                </div>

                {/* Step number */}
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-teal mb-2 block">
                  Step {step.step}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-heading mb-3 leading-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
