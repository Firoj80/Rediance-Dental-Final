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

  // Bento layout: [0] is tall featured card, [1][2] stacked right, [3][4][5] bottom row
  const featured = FEATURES[0]
  const rightTop = FEATURES[1]
  const rightBottom = FEATURES[2]
  const bottomRow = FEATURES.slice(3)

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — Left Aligned */}
        <div className="mb-12">
          <span className="section-label text-emerald-600 mb-3 block">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            What Makes Us Different
          </h2>
        </div>

        {/* Bento Grid */}
        <div ref={ref}>
          {/* Top row: tall card + 2 stacked cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Tall Featured Card */}
            <div
              className={`
                rounded-2xl border border-slate-100 p-8 lg:p-10 card-hover
                bg-gradient-to-br from-emerald-50 to-white
                transition-all duration-500 flex flex-col justify-between
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: '0ms' }}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                  <featured.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{featured.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{featured.description}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((n) => (
                      <div
                        key={n}
                        className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-[10px] font-bold text-emerald-800">
                          {['SR', 'AK', 'PM'][n]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-emerald-700 font-medium">5,000+ happy patients</span>
                </div>
              </div>
            </div>

            {/* Right: 2 stacked cards */}
            <div className="grid grid-cols-1 gap-5">
              {[rightTop, rightBottom].map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className={`
                      rounded-2xl border border-slate-100 p-6 card-hover bg-white
                      transition-all duration-500
                      ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    `}
                    style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-slate-900 font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom row: 3 equal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {bottomRow.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={`
                    rounded-2xl border border-slate-100 p-6 card-hover bg-white
                    transition-all duration-500
                    ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ transitionDelay: `${(i + 3) * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
