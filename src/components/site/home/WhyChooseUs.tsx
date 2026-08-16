'use client'

import { CalendarCheck, Search, Sparkles } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const STEPS = [
  {
    icon: CalendarCheck,
    step: '01',
    title: 'Book Your Visit',
    description: 'Schedule your appointment online or call us directly. We offer flexible hours to fit your busy schedule.',
    gradient: 'from-emerald-950 via-emerald-900 to-emerald-800',
  },
  {
    icon: Search,
    step: '02',
    title: 'Get Diagnosed',
    description: 'Our experienced dentist performs a thorough examination using advanced digital imaging for accurate results.',
    gradient: 'from-slate-950 via-emerald-950 to-emerald-900',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'Start Treatment',
    description: 'Receive personalized treatment in a comfortable, modern environment with the latest dental technology.',
    gradient: 'from-emerald-900 via-slate-900 to-emerald-950',
  },
]

export function WhyChooseUs() {
  const { ref, inView } = useInView()

  return (
    <section className="py-16 lg:py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-10 mx-auto text-center">
          <span className="section-label text-amber-400 mb-3 block">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
            Your Journey to a Better Smile
          </h2>
          <p className="text-white/50 leading-relaxed text-[15px]">
            Three simple steps to the dental care you deserve. We make it easy and comfortable from start to finish.
          </p>
        </div>

        {/* Process Cards — 3 tall cards with gradient backgrounds */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.step}
                className={
                  `relative overflow-hidden rounded-2xl min-h-[320px] flex flex-col justify-between p-8 transition-all duration-600
                  bg-gradient-to-br ${step.gradient}
                  hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
                }
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Large step number */}
                <div className="absolute top-6 right-6 text-8xl font-black text-white/[0.06] leading-none select-none">
                  {step.step}
                </div>

                {/* Subtle glow decoration */}
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-[60px]" />

                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-8">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>

                  {/* Step number label */}
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400/60 mb-2">
                    Step {step.step}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/50 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
