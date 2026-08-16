'use client'

import { User, CalendarPlus, Award, Quote } from 'lucide-react'
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
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Photo */}
          <div
            ref={ref}
            className={`transition-all duration-800 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <div className="relative">
              <div className="rounded-3xl overflow-hidden h-[380px] lg:h-[520px] shadow-2xl shadow-slate-900/8">
                {settings?.doctorPhoto ? (
                  <img
                    src={settings.doctorPhoto}
                    alt={doctorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 via-emerald-50/50 to-white flex items-center justify-center">
                    <User className="w-24 h-24 text-slate-200" />
                  </div>
                )}
              </div>
              {/* Experience badge */}
              <div className="absolute -bottom-4 left-6 lg:left-8 bg-white rounded-2xl px-5 py-3 shadow-xl shadow-slate-900/8">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{experience}</p>
                    <p className="text-[11px] text-slate-400">Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Info */}
          <div className={`transition-all duration-800 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {clinicLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-28 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                </div>
                <Skeleton className="h-12 w-52 rounded-full" />
              </div>
            ) : (
              <>
                <span className="section-label text-emerald-600 mb-4 block">Meet Your Dentist</span>

                <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-slate-900 tracking-tight mb-3 leading-tight">
                  {doctorName}
                </h2>

                <p className="text-emerald-700 font-semibold text-sm mb-5">{qualification}</p>

                {bio && (
                  <div className="relative mb-6 pl-4 border-l-2 border-emerald-200">
                    <Quote className="w-5 h-5 text-emerald-200 absolute -left-3 -top-1 bg-white" />
                    <p className="text-slate-500 leading-relaxed text-[15px] italic">{bio}</p>
                  </div>
                )}

                {specializations && (
                  <div className="flex flex-wrap gap-2 mb-10">
                    {specializations.split(',').map((spec) => (
                      <span
                        key={spec.trim()}
                        className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => { window.location.hash = '#/book' }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full px-8 h-12 text-sm transition-all shadow-lg shadow-emerald-700/15 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2.5"
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
