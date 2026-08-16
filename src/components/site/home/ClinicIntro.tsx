'use client'

import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function ClinicIntro() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const settings = clinicData?.settings?.[0]
  const { ref, inView } = useInView()

  const statYears = settings?.statYears || '10+'
  const statPatients = settings?.statPatients || '5000+'

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div
            ref={ref}
            className={`text-left transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="flex gap-5 mb-6">
              {/* Emerald accent bar */}
              <div className="w-1 h-16 bg-emerald-500 rounded-full shrink-0" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                  Welcome to {clinicData?.name || 'Radiance Dental Care'}
                </h2>
                <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
                  {clinicData?.description ||
                    'We are dedicated to providing exceptional dental care in a comfortable and welcoming environment. Our state-of-the-art facility and experienced team ensure you receive the highest quality treatment.'}
                </p>
              </div>
            </div>

            <a
              href="#/about"
              className="inline-block text-primary hover:underline text-sm font-medium transition-colors"
            >
              Learn more about us →
            </a>

            {/* Trust indicators row */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <span>{statYears} Years Experience</span>
                <span className="text-slate-200 hidden sm:inline">|</span>
                <span>{statPatients} Patients</span>
                <span className="text-slate-200 hidden sm:inline">|</span>
                <span>Modern Equipment</span>
                <span className="text-slate-200 hidden sm:inline">|</span>
                <span>Family Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
