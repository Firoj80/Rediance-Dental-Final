'use client'

import { User, CalendarPlus, Quote, Target, Eye, Heart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'
import ReactMarkdown from 'react-markdown'

export function AboutPage() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref: descRef, inView: descInView } = useInView()
  const { ref: doctorRef, inView: doctorInView } = useInView()
  const { ref: valuesRef, inView: valuesInView } = useInView()

  const settings = clinicData?.settings?.[0]
  const doctorName = settings?.doctorName || 'Dr. Shahid Raza'
  const qualification = settings?.doctorQualification || 'BDS, MDS'
  const experience = settings?.doctorExperience || '10+ Years'
  const bio = settings?.doctorBio
  const specializations = settings?.doctorSpecializations

  return (
    <div className="pt-20">
      {/* Compact Page Header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <span className="section-label text-teal mb-3 block">About Us</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading tracking-tight mb-2">
            About {clinicData?.name || 'Radiance Dental Care'}
          </h1>
          <p className="text-body text-[15px]">
            Our story, our mission, and the care we provide every day.
          </p>
        </div>
      </section>

      {/* Clinic Description */}
      <section className="py-10 lg:py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div
            ref={descRef}
            className={`max-w-3xl mx-auto transition-all duration-700 ${descInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            {clinicLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64 bg-surface-variant" />
                <Skeleton className="h-4 w-full bg-surface-variant" />
                <Skeleton className="h-4 w-full bg-surface-variant" />
                <Skeleton className="h-4 w-3/4 bg-surface-variant" />
              </div>
            ) : (
              <div className="prose-dental">
                {clinicData?.description ? (
                  <ReactMarkdown>{clinicData.description}</ReactMarkdown>
                ) : (
                  <p className="text-body leading-relaxed text-[15px]">
                    {clinicData?.name || 'Radiance Dental Care'} is a leading dental care provider in Siwan, Bihar, offering comprehensive dental treatments with modern technology and compassionate care.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Doctor Spotlight */}
      <section className="py-10 lg:py-14 bg-surface-lowest">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div
            ref={doctorRef}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-800 ${doctorInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Left — Photo */}
            <div className={`transition-all duration-800 ${doctorInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="rounded-3xl overflow-hidden h-[320px] lg:h-[480px] border border-border-subtle">
                {settings?.doctorPhoto ? (
                  <img
                    src={settings.doctorPhoto}
                    alt={doctorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-low flex items-center justify-center">
                    <User className="w-24 h-24 text-surface-variant" />
                  </div>
                )}
              </div>
            </div>

            {/* Right — Info */}
            <div className={`transition-all duration-800 delay-200 ${doctorInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              {clinicLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-32 bg-surface-variant" />
                  <Skeleton className="h-10 w-72 bg-surface-variant" />
                  <Skeleton className="h-5 w-48 bg-surface-variant" />
                  <Skeleton className="h-6 w-36 bg-surface-variant" />
                  <Skeleton className="h-24 w-full bg-surface-variant" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-28 rounded-full bg-surface-variant" />
                    <Skeleton className="h-8 w-32 rounded-full bg-surface-variant" />
                    <Skeleton className="h-8 w-24 rounded-full bg-surface-variant" />
                  </div>
                  <Skeleton className="h-12 w-52 rounded bg-surface-variant" />
                </div>
              ) : (
                <>
                  <span className="section-label text-teal mb-4 block">Meet Your Dentist</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-heading tracking-tight mb-3 leading-tight">
                    {doctorName}
                  </h2>
                  <p className="text-teal font-semibold text-sm mb-4">{qualification}</p>
                  <span className="inline-block bg-surface-variant text-teal text-xs font-semibold px-3 py-1.5 rounded mb-5">
                    {experience} Experience
                  </span>

                  {bio && (
                    <div className="relative mb-6 pl-4 border-l-2 border-teal/30">
                      <Quote className="w-5 h-5 text-teal/30 absolute -left-3 -top-1 bg-surface-lowest" />
                      <p className="text-body leading-relaxed text-[15px] italic">{bio}</p>
                    </div>
                  )}

                  {specializations && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {specializations.split(',').map((spec) => (
                        <span
                          key={spec.trim()}
                          className="bg-surface-variant text-body text-xs font-semibold px-4 py-2 rounded border border-border-subtle"
                        >
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => { window.location.hash = '#/book' }}
                    className="bg-teal hover:bg-teal-dark text-teal-text font-semibold rounded px-8 h-12 text-sm transition-all inline-flex items-center gap-2.5"
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

      {/* Mission / Vision / Values */}
      <section className="py-10 lg:py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-10 text-center">
            <span className="section-label text-teal mb-3 block">Our Foundation</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-heading tracking-tight leading-tight">
              Mission, Vision &amp; Values
            </h2>
          </div>

          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`bg-surface-low rounded-xl p-8 border border-border-subtle transition-all duration-600 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="w-11 h-11 rounded-xl bg-surface-variant text-teal flex items-center justify-center mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">Our Mission</h3>
              <p className="text-sm text-body leading-relaxed">
                To provide exceptional dental care that improves the oral health and confidence of every patient we serve in Siwan and beyond.
              </p>
            </div>

            <div
              className={`bg-surface-low rounded-xl p-8 border border-border-subtle transition-all duration-600 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '120ms' }}
            >
              <div className="w-11 h-11 rounded-xl bg-surface-variant text-teal flex items-center justify-center mb-5">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">Our Vision</h3>
              <p className="text-sm text-body leading-relaxed">
                To be the most trusted dental care provider in the region, known for quality, compassion, and innovation in every treatment.
              </p>
            </div>

            <div
              className={`bg-surface-low rounded-xl p-8 border border-border-subtle transition-all duration-600 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '240ms' }}
            >
              <div className="w-11 h-11 rounded-xl bg-surface-variant text-teal flex items-center justify-center mb-5">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">Our Values</h3>
              <p className="text-sm text-body leading-relaxed">
                Patient-first approach, continuous learning, transparent communication, and unwavering commitment to clinical excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}