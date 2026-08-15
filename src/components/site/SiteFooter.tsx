'use client'

import { Stethoscope, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useSiteStore } from '@/lib/store'

const FOOTER_LINKS = [
  { label: 'Home', hash: '#/' },
  { label: 'About Us', hash: '#/about' },
  { label: 'Services', hash: '#/services' },
  { label: 'Gallery', hash: '#/gallery' },
  { label: 'Testimonials', hash: '#/testimonials' },
  { label: 'Blog', hash: '#/blog' },
  { label: 'Contact', hash: '#/contact' },
]

export function SiteFooter() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const name = clinicData?.name || 'Radiance Dental Care'
  const tagline = clinicData?.tagline || 'Dental Care & Facial Trauma Centre'

  // Navigation is handled by onclick handlers that directly set hash

  return (
    <footer className="bg-foreground text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm leading-tight block">{name}</span>
                <span className="text-[10px] text-white/50 leading-tight block">{tagline}</span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              {clinicData?.description?.substring(0, 120) || 'Providing quality dental care with compassion and expertise.'}
            </p>
            <div className="flex items-center gap-3">
              {clinicData?.facebook && (
                <a href={clinicData.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {clinicData?.instagram && (
                <a href={clinicData.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {clinicData?.youtube && (
                <a href={clinicData.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.hash}>
                  <button
                    onClick={() => { window.location.hash = link.hash }}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {clinicData?.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <a href={`tel:${clinicData.phone}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {clinicData.phone}
                  </a>
                </li>
              )}
              {clinicData?.email && (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <a href={`mailto:${clinicData.email}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {clinicData.email}
                  </a>
                </li>
              )}
              {clinicData?.whatsapp && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-green-400 shrink-0" />
                  <a href={`https://wa.me/${clinicData.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors">
                    WhatsApp
                  </a>
                </li>
              )}
              {clinicData?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span className="text-sm text-white/60">{clinicData.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Working Hours</h3>
            <p className="text-sm text-white/60 mb-1">Monday - Saturday</p>
            <p className="text-sm text-white">10:00 AM - 6:00 PM</p>
            <p className="text-sm text-white/60 mt-2 mb-1">Sunday</p>
            <p className="text-sm text-white">Closed</p>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Designed with care for your dental health.
          </p>
        </div>
      </div>
    </footer>
  )
}
