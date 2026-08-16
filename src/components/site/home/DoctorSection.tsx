'use client'

import { User, CalendarPlus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function DoctorSection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref, inView } = useInView()

  const settings = clinicData?.settings?.[0]
  const doctorName = settings?.doctorName || clinicData?.name || 'Dr. Shahid Raza'
  const qualification = settings?.doctorQualification || 'BDS, MDS'
  const experience = settings?.doctorExperience || '10+ Years'
  const bio = settings?.doctorBio
  const specializations = settings?.doctorSpecializations

  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Left - Doctor photo area */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="rounded-3xl overflow-hidden h-[280px] lg:h-[480px]">
              {settings?.doctorPhoto ? (
                <img
                  src={settings.doctorPhoto}
                  alt={doctorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-emerald-500 to-amber-500 flex items-center justify-center">
                  <User className="w-24 h-24 text-white/30" />
                </div>
              )}
            </div>
          </div>

          {/* Right - Doctor info */}
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
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
                <Skeleton className="h-10 w-44 rounded-lg" />
              </div>
            ) : (
              <>
                {/* Label */}
                <span className="section-label text-emerald-600 mb-4 block">
                  Meet Your Dentist
                </span>

                {/* Doctor name */}
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                  {doctorName}
                </h2>

                {/* Qualification */}
                <p className="text-emerald-700 font-medium text-sm mb-3">
                  {qualification}
                </p>

                {/* Experience badge */}
                <span className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-5">
                  {experience} Experience
                </span>

                {/* Bio */}
                {bio && (
                  <p className="text-slate-500 leading-relaxed mt-0 mb-6">{bio}</p>
                )}

                {/* Specializations */}
                {specializations && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {specializations.split(',').map((spec) => (
                      <span
                        key={spec.trim()}
                        className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => { window.location.hash = '#/book' }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors inline-flex items-center gap-2"
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
