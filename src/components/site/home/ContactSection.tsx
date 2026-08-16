'use client'

import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore } from '@/lib/store'
import { toGoogleMapsEmbedUrl, isGoogleMapsShortUrl } from '@/lib/utils'

export function ContactSection() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)

  if (clinicLoading) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mx-auto mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </section>
    )
  }

  const rawMapUrl = clinicData?.googleMapsUrl
  const embedUrl = rawMapUrl ? toGoogleMapsEmbedUrl(rawMapUrl) : null
  const isShortUrl = rawMapUrl ? isGoogleMapsShortUrl(rawMapUrl) : false
  const hasMap = !!rawMapUrl

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;re here to help you with any questions or to schedule an appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clinicData?.phone && (
                <a href={`tel:${clinicData.phone}`} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{clinicData.phone}</p>
                  </div>
                </a>
              )}
              {clinicData?.email && (
                <a href={`mailto:${clinicData.email}`} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{clinicData.email}</p>
                  </div>
                </a>
              )}
              {clinicData?.address && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Address</p>
                    <p className="text-sm font-medium text-foreground">{clinicData.address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Working Hours</p>
                  <p className="text-sm font-medium text-foreground">Mon-Sat: 10AM - 6PM</p>
                  <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            {(clinicData?.facebook || clinicData?.instagram || clinicData?.youtube) && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm text-muted-foreground">Follow us:</span>
                {clinicData?.facebook && (
                  <a href={clinicData.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {clinicData?.instagram && (
                  <a href={clinicData.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {clinicData?.youtube && (
                  <a href={clinicData.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="aspect-[4/3] rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full rounded-xl border-0"
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
                className="flex flex-col items-center justify-center gap-3 text-center p-6 hover:bg-muted/80 transition-colors rounded-xl w-full h-full"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">View on Google Maps</p>
                  <p className="text-xs text-muted-foreground">
                    {isShortUrl ? 'Click to open location in Google Maps' : 'Click to open the map'}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            ) : (
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground/50">Google Maps</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
