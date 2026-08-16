'use client'

import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'
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

  // Build working hours display from store data
  const enabledDays = workingHours
    .filter((wh) => wh.enabled)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)

  const disabledDays = workingHours
    .filter((wh) => !wh.enabled)
    .map((wh) => DAY_NAMES[wh.dayOfWeek])

  // Fallback if no working hours loaded yet
  const showFallback = enabledDays.length === 0

  return (
    <footer className="bg-slate-900 text-slate-300 border-t-2 border-emerald-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <h3 className="font-semibold text-white text-base tracking-tight">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500">{tagline}</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
              {clinicData?.description?.substring(0, 140) || 'Providing quality dental care with compassion and expertise.'}
            </p>
            <div className="flex items-center gap-2">
              {clinicData?.facebook && (
                <a
                  href={clinicData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {clinicData?.instagram && (
                <a
                  href={clinicData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {clinicData?.youtube && (
                <a
                  href={clinicData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4 tracking-tight">Quick Links</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.hash}>
                  <button
                    onClick={() => { window.location.hash = link.hash }}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-150"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4 tracking-tight">Contact Us</h3>
            <ul className="space-y-3">
              {clinicData?.phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                  <a href={`tel:${clinicData.phone}`} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                    {clinicData.phone}
                  </a>
                </li>
              )}
              {clinicData?.email && (
                <li className="flex items-start gap-2.5">
                  <Mail className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                  <a href={`mailto:${clinicData.email}`} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                    {clinicData.email}
                  </a>
                </li>
              )}
              {clinicData?.whatsapp && (
                <li className="flex items-start gap-2.5">
                  <Phone className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${clinicData.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {clinicData?.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-400 leading-relaxed">{clinicData.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4 tracking-tight">Working Hours</h3>
            {showFallback ? (
              <div className="space-y-1.5">
                <p className="text-sm text-slate-400">Monday – Saturday</p>
                <p className="text-sm text-white font-medium">10:00 AM – 6:00 PM</p>
                <p className="text-sm text-slate-400 mt-2">Sunday</p>
                <p className="text-sm text-slate-500">Closed</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {enabledDays.map((wh) => {
                  const timeStr = wh.sessions
                    .map((s) => `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`)
                    .join(', ')
                  return (
                    <div key={wh.id} className="flex justify-between items-baseline gap-3">
                      <span className="text-sm text-slate-400">{DAY_NAMES[wh.dayOfWeek]}</span>
                      <span className="text-sm text-white font-medium whitespace-nowrap">{timeStr}</span>
                    </div>
                  )
                })}
                {disabledDays.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500">
                      Closed: {disabledDays.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
