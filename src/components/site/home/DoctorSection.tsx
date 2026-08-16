'use client'

import { User, CalendarPlus, Award } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function DoctorSection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref, inView } = useInView()

  const settings = clinicData?.settings?.[0]
  const doctorName = settings?.doctorName || 'Dr. Shahid Raza'
  const qualification = settings?.doctorQualification || 'BDS, MDS'
  const experience = settings?.doctorExperience || '10+ Years'
  const bio = settings?.doctorBio
  const specializations = settings?.doctorSpecializations

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Left — Photo */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden h-[340px] lg:h-[460px] shadow-xl shadow-slate-900/8">
                {settings?.doctorPhoto ? (
                  <img
                    src={settings.doctorPhoto}
                    alt={doctorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-emerald-50 to-white flex items-center justify-center">
                    <User className="w-20 h-20 text-emerald-200" />
                  </div>
                )}
              </div>
              {/* Experience badge overlay */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-900">{experience}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Info */}
          <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {clinicLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                </div>
                <Skeleton className="h-10 w-44 rounded-xl" />
              </div>
            ) : (
              <>
                <span className="section-label text-emerald-600 mb-4 block">Meet Your Dentist</span>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                  {doctorName}
                </h2>

                <p className="text-emerald-700 font-medium text-sm mb-4">{qualification}</p>

                {bio && (
                  <p className="text-slate-500 leading-relaxed mb-6">{bio}</p>
                )}

                {specializations && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {specializations.split(',').map((spec) => (
                      <span
                        key={spec.trim()}
                        className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => { window.location.hash = '#/book' }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl px-6 py-3 text-sm transition-all shadow-lg shadow-emerald-700/15 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book Appointment
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
