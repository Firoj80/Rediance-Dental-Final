'use client'

import { User, CalendarPlus } from 'lucide-react'
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
      <section className="bg-white border-b border-slate-100 py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label text-emerald-600 mb-3 block">About Us</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            About Radiance Dental Care
          </h1>
          <p className="text-slate-500 text-sm">
            Learn about our clinic, our mission, and the team behind your dental care.
          </p>
        </div>
      </section>

      {/* Clinic Description */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={descRef}
            className={`max-w-3xl mx-auto transition-all duration-700 ${descInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {clinicLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-6">
                  {clinicData?.name || 'Radiance Dental Care'}
                </h2>
                {clinicData?.description && (
                  <div className="prose-dental">
                    <ReactMarkdown>{clinicData.description}</ReactMarkdown>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Doctor Spotlight — same visual language as home DoctorSection */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={doctorRef}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center transition-all duration-700 ${doctorInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            {/* Left - Doctor photo area */}
            <div className={`transition-all duration-700 ${doctorInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
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
            <div className={`transition-all duration-700 delay-200 ${doctorInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
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

                  {/* Specializations as pills */}
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

                  {/* CTA Button — emerald */}
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

      {/* Mission / Vision / Values */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <span className="section-label text-emerald-600 mb-3 block">Our Foundation</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Mission, Vision & Values
            </h2>
          </div>

          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mission */}
            <div
              className={`bg-slate-50 rounded-2xl p-6 border border-slate-100 transition-all duration-500 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0ms' }}
            >
              <span className="text-4xl font-bold text-emerald-700/20 mb-4 block">01</span>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Mission</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To provide exceptional dental care that improves the oral health and confidence of every patient we serve.
              </p>
            </div>

            {/* Vision */}
            <div
              className={`bg-slate-50 rounded-2xl p-6 border border-slate-100 transition-all duration-500 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="text-4xl font-bold text-emerald-700/20 mb-4 block">02</span>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Vision</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To be the most trusted dental care provider in Siwan, known for quality, compassion, and innovation.
              </p>
            </div>

            {/* Values */}
            <div
              className={`bg-slate-50 rounded-2xl p-6 border border-slate-100 transition-all duration-500 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <span className="text-4xl font-bold text-emerald-700/20 mb-4 block">03</span>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Values</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Patient-first approach, continuous learning, transparent communication, and unwavering commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
