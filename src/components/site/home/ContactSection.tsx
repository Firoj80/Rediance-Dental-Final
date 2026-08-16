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
      <section className="py-16 lg:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <Skeleton className="h-3 w-16 mx-auto mb-3 bg-white/10" />
          <Skeleton className="h-8 w-44 mx-auto mb-6 bg-white/10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl bg-white/5" />
              ))}
            </div>
            <Skeleton className="h-[360px] rounded-2xl bg-white/5" />
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
      icon: <Phone className="w-4 h-4 text-amber-400" />,
      label: 'Phone',
      value: clinicData.phone,
      href: `tel:${clinicData.phone}`,
    })
  }
  if (clinicData?.email) {
    contactItems.push({
      icon: <Mail className="w-4 h-4 text-amber-400" />,
      label: 'Email',
      value: clinicData.email,
      href: `mailto:${clinicData.email}`,
    })
  }
  if (clinicData?.address) {
    contactItems.push({
      icon: <MapPin className="w-4 h-4 text-amber-400" />,
      label: 'Address',
      value: clinicData.address,
    })
  }
  contactItems.push({
    icon: <Clock className="w-4 h-4 text-amber-400" />,
    label: 'Working Hours',
    value: 'Mon – Sat: 10AM – 6PM · Sunday: Closed',
  })

  return (
    <section className="py-16 lg:py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-10 mx-auto text-center">
          <span className="section-label text-amber-400 mb-3 block">Contact</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Get in Touch
          </h2>
          <p className="text-white/50 leading-relaxed text-[15px]">
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
                    ? { href: item.href, className: 'flex items-center gap-4 group cursor-pointer rounded-2xl p-4 hover:bg-white/5 transition-colors' }
                    : { className: 'flex items-center gap-4 rounded-2xl p-4' })}
                >
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">{item.label}</p>
                    <p className="text-white/80 font-medium text-sm leading-snug group-hover:text-amber-400 transition-colors">{item.value}</p>
                  </div>
                </Wrapper>
              )
            })}

            {/* Social links */}
            {(clinicData?.facebook || clinicData?.instagram || clinicData?.youtube) && (
              <div className="flex items-center gap-2.5 pt-4 pl-4">
                <span className="text-xs text-white/40 font-medium mr-2">Follow us</span>
                {clinicData?.facebook && (
                  <a href={clinicData.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 text-white/40 transition-colors flex items-center justify-center">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {clinicData?.instagram && (
                  <a href={clinicData.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 text-white/40 transition-colors flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {clinicData?.youtube && (
                  <a href={clinicData.youtube} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 text-white/40 transition-colors flex items-center justify-center">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — Google Maps embed */}
          <div className="h-[300px] lg:h-full lg:min-h-[400px] rounded-2xl overflow-hidden border border-white/10">
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
                className="flex flex-col items-center justify-center gap-3 text-center p-8 hover:bg-white/5 transition-colors w-full h-full"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
                <p className="text-sm font-semibold text-white">View on Google Maps</p>
                <ExternalLink className="w-4 h-4 text-white/40" />
              </a>
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-white/10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
