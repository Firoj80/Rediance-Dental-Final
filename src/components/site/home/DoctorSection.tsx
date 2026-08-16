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
    <section className="py-16 lg:py-20 bg-surface-dim">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-10 mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-heading tracking-tight mb-4 leading-tight uppercase">
            The Experts Behind Your Oral Health
          </h2>
          <p className="text-body leading-relaxed text-[15px]">
            Meet the professionals dedicated to your dental health and beautiful smile.
          </p>
        </div>

        {/* Doctor Card */}
        <div
          ref={ref}
          className={`max-w-lg mx-auto bg-surface-low rounded-xl border border-border-subtle overflow-hidden transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {clinicLoading ? (
            <div className="space-y-4 p-8">
              <Skeleton className="h-4 w-32 bg-surface-variant" />
              <Skeleton className="h-10 w-72 bg-surface-variant" />
              <Skeleton className="h-5 w-48 bg-surface-variant" />
              <Skeleton className="h-24 w-full bg-surface-variant" />
            </div>
          ) : (
            <>
              {/* Photo */}
              <div className="h-64 sm:h-72">
                {settings?.doctorPhoto ? (
                  <img
                    src={settings.doctorPhoto}
                    alt={doctorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                    <User className="w-20 h-20 text-subtle/40" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 sm:p-8">
                <span className="section-label text-teal mb-2 block">Meet Your Dentist</span>

                <h3 className="text-2xl font-bold text-heading tracking-tight mb-2 leading-tight">
                  {doctorName}
                </h3>

                <p className="text-teal font-semibold text-sm uppercase tracking-wider mb-4">{qualification}</p>

                {bio && (
                  <div className="relative mb-5 pl-4 border-l-2 border-teal/30">
                    <Quote className="w-4 h-4 text-teal/20 absolute -left-2.5 -top-0.5 bg-surface-low" />
                    <p className="text-muted-foreground leading-relaxed text-[15px] italic">{bio}</p>
                  </div>
                )}

                {specializations && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {specializations.split(',').map((spec) => (
                      <span
                        key={spec.trim()}
                        className="bg-surface-variant border border-border-subtle text-body text-xs font-semibold px-4 py-2 rounded"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal" />
                    <span className="text-sm text-body">{experience}</span>
                  </div>
                </div>

                <button
                  onClick={() => { window.location.hash = '#/book' }}
                  className="inline-flex items-center gap-2.5 bg-teal hover:bg-teal-dark text-teal-text font-semibold rounded px-8 h-12 text-sm transition-all hover:shadow-lg hover:shadow-teal/20 hover:-translate-y-0.5"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book Appointment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
