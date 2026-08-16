'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube, CheckCircle2, ExternalLink } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore } from '@/lib/store'
import { toGoogleMapsEmbedUrl, isGoogleMapsShortUrl } from '@/lib/utils'

export function ContactPage() {
  const clinicData = useSiteStore((s) => s.clinicData)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)

  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send message')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (clinicLoading) {
    return (
      <div className="pt-20">
        <section className="bg-white border-b border-slate-100 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-3 w-16 mb-3" />
            <Skeleton className="h-9 w-48" />
          </div>
        </section>
        <section className="py-10 lg:py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Skeleton className="h-96 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  const rawMapUrl = clinicData?.googleMapsUrl
  const embedUrl = rawMapUrl ? toGoogleMapsEmbedUrl(rawMapUrl) : null
  const isShortUrl = rawMapUrl ? isGoogleMapsShortUrl(rawMapUrl) : false

  const inputClasses = 'w-full h-11 px-4 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors placeholder:text-slate-400'

  return (
    <div className="pt-20">
      {/* Compact Page Header */}
      <section className="bg-white border-b border-slate-100 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label text-emerald-600 mb-3 block">Contact</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* LEFT — Contact Form */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm mb-6">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', message: '' }) }}
                    className="border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="Your full name"
                        className={inputClasses}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Phone
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="Your phone number"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="Your email address"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        placeholder="How can we help you?"
                        rows={5}
                        className={`${inputClasses} h-auto py-3 resize-none`}
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-lg shadow-amber-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* RIGHT — Contact Info + Map */}
            <div className="space-y-6">
              {/* Info rows */}
              <div className="space-y-4">
                {clinicData?.phone && (
                  <a href={`tel:${clinicData.phone}`} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Phone className="w-4.5 h-4.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-0.5">Phone</p>
                      <p className="text-slate-700 font-medium text-sm group-hover:text-emerald-700 transition-colors">{clinicData.phone}</p>
                    </div>
                  </a>
                )}
                {clinicData?.email && (
                  <a href={`mailto:${clinicData.email}`} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Mail className="w-4.5 h-4.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-0.5">Email</p>
                      <p className="text-slate-700 font-medium text-sm group-hover:text-emerald-700 transition-colors">{clinicData.email}</p>
                    </div>
                  </a>
                )}
                {clinicData?.address && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4.5 h-4.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-0.5">Address</p>
                      <p className="text-slate-700 font-medium text-sm">{clinicData.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-0.5">Working Hours</p>
                    <p className="text-slate-700 font-medium text-sm">Mon – Sat: 10AM – 6PM</p>
                    <p className="text-slate-400 text-xs">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              {(clinicData?.facebook || clinicData?.instagram || clinicData?.youtube) && (
                <div className="flex items-center gap-3 pt-2">
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

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-100 h-[250px] lg:h-[320px]">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Clinic Location"
                  />
                ) : rawMapUrl ? (
                  <a
                    href={rawMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-3 text-center p-6 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                      <MapPin className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 mb-1">View on Google Maps</p>
                      <p className="text-xs text-slate-400">
                        {isShortUrl ? 'Click to open location' : 'Click to open the map'}
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
        </div>
      </section>
    </div>
  )
}