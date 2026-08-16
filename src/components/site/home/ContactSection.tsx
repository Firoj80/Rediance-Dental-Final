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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-20 mb-3" />
          <Skeleton className="h-8 w-48 mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-[400px] rounded-2xl" />
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
      icon: <Phone className="w-4.5 h-4.5 text-emerald-600" />,
      label: 'Phone',
      value: clinicData.phone,
      href: `tel:${clinicData.phone}`,
    })
  }

  if (clinicData?.email) {
    contactItems.push({
      icon: <Mail className="w-4.5 h-4.5 text-emerald-600" />,
      label: 'Email',
      value: clinicData.email,
      href: `mailto:${clinicData.email}`,
    })
  }

  if (clinicData?.address) {
    contactItems.push({
      icon: <MapPin className="w-4.5 h-4.5 text-emerald-600" />,
      label: 'Address',
      value: clinicData.address,
    })
  }

  contactItems.push({
    icon: <Clock className="w-4.5 h-4.5 text-emerald-600" />,
    label: 'Working Hours',
    value: 'Mon–Sat: 10AM – 6PM · Sunday: Closed',
  })

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — Left Aligned */}
        <div className="mb-12">
          <span className="section-label text-emerald-600 mb-3 block">Contact</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Get in Touch
          </h2>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 transition-all duration-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* LEFT — Contact information */}
          <div className="space-y-5">
            {contactItems.map((item, i) => {
              const Wrapper = item.href ? 'a' : 'div'
              return (
                <Wrapper
                  key={i}
                  {...(item.href
                    ? {
                        href: item.href,
                        className:
                          'flex items-center gap-4 group cursor-pointer',
                      }
                    : { className: 'flex items-center gap-4' })}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-slate-700 font-medium text-sm group-hover:text-emerald-700 transition-colors">
                      {item.value}
                    </p>
                  </div>
                </Wrapper>
              )
            })}

            {/* Social links */}
            {(clinicData?.facebook || clinicData?.instagram || clinicData?.youtube) && (
              <div className="flex items-center gap-3 pt-4">
                {clinicData?.facebook && (
                  <a
                    href={clinicData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 transition-colors flex items-center justify-center"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {clinicData?.instagram && (
                  <a
                    href={clinicData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 transition-colors flex items-center justify-center"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {clinicData?.youtube && (
                  <a
                    href={clinicData.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 transition-colors flex items-center justify-center"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — Google Maps embed */}
          <div className="h-[250px] lg:h-[400px] rounded-2xl overflow-hidden border border-slate-100">
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
                className="flex flex-col items-center justify-center gap-3 text-center p-6 hover:bg-slate-50 transition-colors w-full h-full"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">View on Google Maps</p>
                  <p className="text-xs text-slate-400">
                    {isShortUrl
                      ? 'Click to open location in Google Maps'
                      : 'Click to open the map'}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-slate-300" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
