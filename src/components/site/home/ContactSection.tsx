'use client'

import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore } from '@/lib/store'
import { toGoogleMapsEmbedUrl, isGoogleMapsShortUrl } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'

export function ContactSection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref, inView } = useInView()

  if (clinicLoading) {
    return (
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <Skeleton className="h-3 w-16 mx-auto mb-3" />
          <Skeleton className="h-8 w-44 mx-auto mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-[360px] rounded-2xl" />
          </div>
        </div>
      </section>
    )
  }

  const rawMapUrl = clinicData?.googleMapsUrl
  const embedUrl = rawMapUrl ? toGoogleMapsEmbedUrl(rawMapUrl) : null
  const isShortUrl = rawMapUrl ? isGoogleMapsShortUrl(rawMapUrl) : false
  const hasMap = !!rawMapUrl

  const contactItems: { icon: React.ReactNode; label: string; value: string; href?: string }[] = []

  if (clinicData?.phone) {
    contactItems.push({
      icon: <Phone className="w-4 h-4 text-emerald-600" />,
      label: 'Phone',
      value: clinicData.phone,
      href: `tel:${clinicData.phone}`,
    })
  }
  if (clinicData?.email) {
    contactItems.push({
      icon: <Mail className="w-4 h-4 text-emerald-600" />,
      label: 'Email',
      value: clinicData.email,
      href: `mailto:${clinicData.email}`,
    })
  }
  if (clinicData?.address) {
    contactItems.push({
      icon: <MapPin className="w-4 h-4 text-emerald-600" />,
      label: 'Address',
      value: clinicData.address,
    })
  }
  contactItems.push({
    icon: <Clock className="w-4 h-4 text-emerald-600" />,
    label: 'Working Hours',
    value: 'Mon – Sat: 10AM – 6PM · Sunday: Closed',
  })

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-14 mx-auto text-center">
          <span className="section-label text-emerald-600 mb-3 block">Contact</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            Get in Touch
          </h2>
          <p className="text-slate-500 leading-relaxed text-[15px]">
            We&apos;d love to hear from you. Reach out anytime.
          </p>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* LEFT — Contact information */}
          <div className="space-y-3">
            {contactItems.map((item, i) => {
              const Wrapper = item.href ? 'a' : 'div'
              return (
                <Wrapper
                  key={i}
                  {...(item.href
                    ? { href: item.href, className: 'flex items-center gap-4 group cursor-pointer rounded-2xl p-4 hover:bg-slate-50 transition-colors' }
                    : { className: 'flex items-center gap-4 rounded-2xl p-4' })}
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">{item.label}</p>
                    <p className="text-slate-700 font-medium text-sm leading-snug group-hover:text-emerald-700 transition-colors">{item.value}</p>
                  </div>
                </Wrapper>
              )
            })}

            {/* Social links */}
            {(clinicData?.facebook || clinicData?.instagram || clinicData?.youtube) && (
              <div className="flex items-center gap-2.5 pt-4 pl-4">
                <span className="text-xs text-slate-400 font-medium mr-2">Follow us</span>
                {clinicData?.facebook && (
                  <a href={clinicData.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 transition-colors flex items-center justify-center">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {clinicData?.instagram && (
                  <a href={clinicData.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 transition-colors flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {clinicData?.youtube && (
                  <a href={clinicData.youtube} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 transition-colors flex items-center justify-center">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — Google Maps embed */}
          <div className="h-[300px] lg:h-full lg:min-h-[400px] rounded-2xl overflow-hidden border border-slate-100">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
              />
            ) : hasMap ? (
              <a
                href={rawMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-3 text-center p-8 hover:bg-slate-50 transition-colors w-full h-full"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-slate-900">View on Google Maps</p>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-slate-200" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
