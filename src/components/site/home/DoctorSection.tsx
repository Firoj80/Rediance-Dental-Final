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
    <section className="py-24 lg:py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-stretch rounded-3xl overflow-hidden">
          {/* Left — Photo panel */}
          <div
            ref={ref}
            className={`relative transition-all duration-800 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <div className="h-[400px] lg:h-[600px]">
              {settings?.doctorPhoto ? (
                <img
                  src={settings.doctorPhoto}
                  alt={doctorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 flex items-center justify-center">
                  <User className="w-24 h-24 text-white/10" />
                </div>
              )}
              {/* Experience badge */}
              <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-sm font-bold text-white">{experience}</p>
                    <p className="text-[11px] text-white/60">Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Info panel (dark slate) */}
          <div className={`bg-slate-900 p-8 sm:p-10 lg:p-16 flex flex-col justify-center transition-all duration-800 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {clinicLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 bg-white/10" />
                <Skeleton className="h-10 w-72 bg-white/10" />
                <Skeleton className="h-5 w-48 bg-white/10" />
                <Skeleton className="h-6 w-36 bg-white/10" />
                <Skeleton className="h-24 w-full bg-white/10" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-28 rounded-full bg-white/10" />
                  <Skeleton className="h-8 w-32 rounded-full bg-white/10" />
                </div>
                <Skeleton className="h-12 w-52 rounded-full bg-white/10" />
              </div>
            ) : (
              <>
                <span className="section-label text-amber-400 mb-4 block">Meet Your Dentist</span>

                <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-white tracking-tight mb-3 leading-tight">
                  {doctorName}
                </h2>

                <p className="text-amber-400 font-semibold text-sm mb-5">{qualification}</p>

                {bio && (
                  <div className="relative mb-6 pl-4 border-l-2 border-emerald-500/30">
                    <Quote className="w-5 h-5 text-emerald-500/20 absolute -left-3 -top-1 bg-slate-900" />
                    <p className="text-white/60 leading-relaxed text-[15px] italic">{bio}</p>
                  </div>
                )}

                {specializations && (
                  <div className="flex flex-wrap gap-2 mb-10">
                    {specializations.split(',').map((spec) => (
                      <span
                        key={spec.trim()}
                        className="bg-white/10 border border-white/10 text-white/80 text-xs font-semibold px-4 py-2 rounded-full"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => { window.location.hash = '#/book' }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-full px-8 h-12 text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 inline-flex items-center gap-2.5"
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
