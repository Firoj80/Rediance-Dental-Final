'use client'

import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowUpRight } from 'lucide-react'
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

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(time: string) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function SiteFooter() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const workingHours = useSiteStore((s) => s.workingHours)
  const name = clinicData?.name || 'Radiance Dental Care'
  const tagline = clinicData?.tagline || 'Dental Care & Facial Trauma Centre'

  const enabledDays = workingHours
    .filter((wh) => wh.enabled)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)

  const disabledDays = workingHours
    .filter((wh) => !wh.enabled)
    .map((wh) => DAY_NAMES[wh.dayOfWeek])

  const showFallback = enabledDays.length === 0

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Accent line */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-400" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5">
              <h3 className="font-bold text-white text-base tracking-tight">{name}</h3>
              <p className="text-xs text-slate-500 mt-1">{tagline}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              {clinicData?.description?.substring(0, 140) || 'Providing quality dental care with compassion and expertise in Siwan, Bihar.'}
            </p>
            <div className="flex items-center gap-2">
              {clinicData?.facebook && (
                <a
                  href={clinicData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-700 flex items-center justify-center text-slate-500 hover:text-white transition-all duration-300"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {clinicData?.instagram && (
                <a
                  href={clinicData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-700 flex items-center justify-center text-slate-500 hover:text-white transition-all duration-300"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {clinicData?.youtube && (
                <a
                  href={clinicData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-700 flex items-center justify-center text-slate-500 hover:text-white transition-all duration-300"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-5 tracking-tight">Quick Links</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.hash}>
                  <button
                    onClick={() => { window.location.hash = link.hash }}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-5 tracking-tight">Contact Us</h3>
            <ul className="space-y-3.5">
              {clinicData?.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                  <a href={`tel:${clinicData.phone}`} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {clinicData.phone}
                  </a>
                </li>
              )}
              {clinicData?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                  <a href={`mailto:${clinicData.email}`} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {clinicData.email}
                  </a>
                </li>
              )}
              {clinicData?.whatsapp && (
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${clinicData.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {clinicData?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-400 leading-relaxed">{clinicData.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-5 tracking-tight">Working Hours</h3>
            {showFallback ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Monday – Saturday</p>
                <p className="text-sm text-white font-medium">10:00 AM – 6:00 PM</p>
                <p className="text-sm text-slate-500 mt-3">Sunday</p>
                <p className="text-sm text-slate-600">Closed</p>
              </div>
            ) : (
              <div className="space-y-2">
                {enabledDays.map((wh) => {
                  const timeStr = wh.sessions
                    .map((s) => `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`)
                    .join(', ')
                  return (
                    <div key={wh.id} className="flex justify-between items-baseline gap-4">
                      <span className="text-sm text-slate-400">{DAY_NAMES[wh.dayOfWeek]}</span>
                      <span className="text-sm text-white font-medium whitespace-nowrap">{timeStr}</span>
                    </div>
                  )
                })}
                {disabledDays.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-slate-700/50">
                    <p className="text-xs text-slate-600">
                      Closed: {disabledDays.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <button
            onClick={() => { window.location.hash = '#/book' }}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-full px-6 py-2.5 transition-colors"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </footer>
  )
}
