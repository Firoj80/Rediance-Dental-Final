'use client'

import { GraduationCap, CalendarPlus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    <section className="py-16 lg:py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Left - Doctor image placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center overflow-hidden">
              {settings?.doctorPhoto ? (
                <img src={settings.doctorPhoto} alt={doctorName} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-white/60 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-16 h-16 text-primary/40" />
                  </div>
                  <p className="text-primary/40 font-medium">Doctor Photo</p>
                </div>
              )}
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-primary/10 -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-primary/5 -z-10" />
          </div>

          {/* Right - Doctor info */}
          <div>
            {clinicLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
                  <GraduationCap className="w-4 h-4" />
                  Meet Our Doctor
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{doctorName}</h2>
                <p className="text-primary font-medium mb-1">{qualification}</p>
                <p className="text-sm text-muted-foreground mb-4">{experience} Experience</p>

                {bio && (
                  <p className="text-muted-foreground leading-relaxed mb-6">{bio}</p>
                )}

                {specializations && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {specializations.split(',').map((spec) => (
                      <Badge key={spec.trim()} variant="secondary" className="text-xs">
                        {spec.trim()}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => { window.location.hash = '#/book' }}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book Appointment
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
