'use client'

import { GraduationCap, CalendarPlus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'
import ReactMarkdown from 'react-markdown'

export function AboutPage() {
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
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Learn about our clinic, our mission, and the team behind your dental care.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {clinicLoading ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                {clinicData?.name || 'Radiance Dental Care'}
              </h2>
              {clinicData?.description && (
                <div className="prose-dental mb-10">
                  <ReactMarkdown>{clinicData.description}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Doctor Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={ref}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {/* Doctor image */}
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
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-primary/10 -z-10" />
            </div>

            {/* Doctor info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
                <GraduationCap className="w-4 h-4" />
                Our Doctor
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{doctorName}</h2>
              <p className="text-primary font-medium mb-1">{qualification}</p>
              <p className="text-sm text-muted-foreground mb-6">{experience} Experience</p>

              {bio && (
                <div className="prose-dental mb-6">
                  <ReactMarkdown>{bio}</ReactMarkdown>
                </div>
              )}

              {specializations && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {specializations.split(',').map((spec) => (
                    <Badge key={spec.trim()} variant="secondary">{spec.trim()}</Badge>
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
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-50 mb-4">
                <span className="text-2xl">🦷</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Our Mission</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To provide exceptional dental care that improves the oral health and confidence of every patient we serve.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-50 mb-4">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Our Vision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To be the most trusted dental care provider in Siwan, known for quality, compassion, and innovation.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-50 mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Our Values</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Patient-first approach, continuous learning, transparent communication, and unwavering commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
