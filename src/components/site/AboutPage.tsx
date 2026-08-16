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
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <span className="section-label text-emerald-600 mb-3 block">About Us</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            About {clinicData?.name || 'Radiance Dental Care'}
          </h1>
          <p className="text-slate-500 text-[15px]">
            Our story, our mission, and the care we provide every day.
          </p>
        </div>
      </section>

      {/* Clinic Description */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div
            ref={descRef}
            className={`max-w-3xl mx-auto transition-all duration-700 ${descInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            {clinicLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="prose-dental">
                {clinicData?.description ? (
                  <ReactMarkdown>{clinicData.description}</ReactMarkdown>
                ) : (
                  <p className="text-slate-500 leading-relaxed text-[15px]">
                    {clinicData?.name || 'Radiance Dental Care'} is a leading dental care provider in Siwan, Bihar, offering comprehensive dental treatments with modern technology and compassionate care.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Doctor Spotlight */}
      <section className="py-14 lg:py-20 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div
            ref={doctorRef}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-800 ${doctorInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Left — Photo */}
            <div className={`transition-all duration-800 ${doctorInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="rounded-3xl overflow-hidden h-[320px] lg:h-[480px] shadow-2xl shadow-slate-900/8">
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
            </div>

            {/* Right — Info */}
            <div className={`transition-all duration-800 delay-200 ${doctorInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
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
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-12 w-52 rounded-full" />
                </div>
              ) : (
                <>
                  <span className="section-label text-emerald-600 mb-4 block">Meet Your Dentist</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3 leading-tight">
                    {doctorName}
                  </h2>
                  <p className="text-emerald-700 font-semibold text-sm mb-4">{qualification}</p>
                  <span className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                    {experience} Experience
                  </span>

                  {bio && (
                    <div className="relative mb-6 pl-4 border-l-2 border-emerald-200">
                      <Quote className="w-5 h-5 text-emerald-200 absolute -left-3 -top-1 bg-slate-50/80" />
                      <p className="text-slate-500 leading-relaxed text-[15px] italic">{bio}</p>
                    </div>
                  )}

                  {specializations && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {specializations.split(',').map((spec) => (
                        <span
                          key={spec.trim()}
                          className="bg-white text-slate-600 text-xs font-semibold px-4 py-2 rounded-full border border-slate-100"
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

      {/* Mission / Vision / Values */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <span className="section-label text-emerald-600 mb-3 block">Our Foundation</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Mission, Vision &amp; Values
            </h2>
          </div>

          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`bg-slate-50 rounded-2xl p-8 border border-slate-100/80 transition-all duration-600 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Mission</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To provide exceptional dental care that improves the oral health and confidence of every patient we serve in Siwan and beyond.
              </p>
            </div>

            <div
              className={`bg-slate-50 rounded-2xl p-8 border border-slate-100/80 transition-all duration-600 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '120ms' }}
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Vision</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To be the most trusted dental care provider in the region, known for quality, compassion, and innovation in every treatment.
              </p>
            </div>

            <div
              className={`bg-slate-50 rounded-2xl p-8 border border-slate-100/80 transition-all duration-600 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '240ms' }}
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Values</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Patient-first approach, continuous learning, transparent communication, and unwavering commitment to clinical excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}