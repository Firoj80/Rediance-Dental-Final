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
        <section className="page-header">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <Skeleton className="h-3 w-16 mb-3 bg-surface-variant" />
            <Skeleton className="h-8 w-40 bg-surface-variant" />
          </div>
        </section>
        <section className="py-10 lg:py-14 bg-surface">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Skeleton className="h-[500px] rounded-xl bg-surface-variant" />
              <Skeleton className="h-[500px] rounded-xl bg-surface-variant" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  const rawMapUrl = clinicData?.googleMapsUrl
  const embedUrl = rawMapUrl ? toGoogleMapsEmbedUrl(rawMapUrl) : null
  const isShortUrl = rawMapUrl ? isGoogleMapsShortUrl(rawMapUrl) : false

  const inputClasses = 'w-full h-11 px-4 text-sm rounded-xl border border-border-subtle bg-surface focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 transition-colors text-foreground placeholder:text-subtle'

  return (
    <div className="pt-20">
      {/* Compact Page Header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <span className="section-label text-teal mb-3 block">Contact</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading tracking-tight">
            Contact Us
          </h1>
          <p className="text-body text-[15px] mt-2">
            We'd love to hear from you. Send us a message anytime.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 lg:py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* LEFT — Contact Form */}
            <div className="bg-surface-low rounded-xl border border-border-subtle p-7 sm:p-9">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-xl bg-teal/10 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8 text-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-heading mb-2">Message Sent!</h3>
                  <p className="text-body text-sm mb-8">Thank you for reaching out. We'll get back to you soon.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', message: '' }) }}
                    className="text-sm font-medium text-teal hover:text-teal-dark transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-heading mb-2">Send Us a Message</h2>
                  <p className="text-sm text-body mb-7">Fill out the form below and we'll respond promptly.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-body mb-1.5">
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
                        <label htmlFor="phone" className="block text-sm font-medium text-body mb-1.5">
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
                        <label htmlFor="email" className="block text-sm font-medium text-body mb-1.5">
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
                      <label htmlFor="message" className="block text-sm font-medium text-body mb-1.5">
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
                      className="w-full h-12 bg-teal hover:bg-teal-dark text-teal-text font-semibold rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
              <div className="space-y-1">
                {clinicData?.phone && (
                  <a href={`tel:${clinicData.phone}`} className="flex items-center gap-4 group cursor-pointer rounded-xl p-4 hover:bg-surface-variant transition-colors bg-surface-low border border-border-subtle">
                    <div className="w-11 h-11 rounded-xl bg-surface-variant flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-teal" />
                    </div>
                    <div>
                      <p className="text-[11px] text-subtle uppercase tracking-wider font-semibold mb-0.5">Phone</p>
                      <p className="text-body font-medium text-sm group-hover:text-teal transition-colors">{clinicData.phone}</p>
                    </div>
                  </a>
                )}
                {clinicData?.email && (
                  <a href={`mailto:${clinicData.email}`} className="flex items-center gap-4 group cursor-pointer rounded-xl p-4 hover:bg-surface-variant transition-colors bg-surface-low border border-border-subtle">
                    <div className="w-11 h-11 rounded-xl bg-surface-variant flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-teal" />
                    </div>
                    <div>
                      <p className="text-[11px] text-subtle uppercase tracking-wider font-semibold mb-0.5">Email</p>
                      <p className="text-body font-medium text-sm group-hover:text-teal transition-colors">{clinicData.email}</p>
                    </div>
                  </a>
                )}
                {clinicData?.address && (
                  <div className="flex items-center gap-4 rounded-xl p-4 bg-surface-low border border-border-subtle">
                    <div className="w-11 h-11 rounded-xl bg-surface-variant flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-teal" />
                    </div>
                    <div>
                      <p className="text-[11px] text-subtle uppercase tracking-wider font-semibold mb-0.5">Address</p>
                      <p className="text-body font-medium text-sm leading-relaxed">{clinicData.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 rounded-xl p-4 bg-surface-low border border-border-subtle">
                  <div className="w-11 h-11 rounded-xl bg-surface-variant flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-[11px] text-subtle uppercase tracking-wider font-semibold mb-0.5">Working Hours</p>
                    <p className="text-body font-medium text-sm">Mon – Sat: 10AM – 6PM</p>
                    <p className="text-subtle text-xs">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              {(clinicData?.facebook || clinicData?.instagram || clinicData?.youtube) && (
                <div className="flex items-center gap-2.5 pl-4">
                  <span className="text-xs text-subtle font-medium mr-2">Follow us</span>
                  {clinicData?.facebook && (
                    <a
                      href={clinicData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-surface-variant hover:bg-teal hover:text-teal-text text-subtle transition-colors flex items-center justify-center"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {clinicData?.instagram && (
                    <a
                      href={clinicData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-surface-variant hover:bg-teal hover:text-teal-text text-subtle transition-colors flex items-center justify-center"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {clinicData?.youtube && (
                    <a
                      href={clinicData.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-surface-variant hover:bg-teal hover:text-teal-text text-subtle transition-colors flex items-center justify-center"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-border-subtle h-[260px] lg:h-[340px]">
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
                    className="w-full h-full bg-surface-low flex flex-col items-center justify-center gap-3 text-center p-8 hover:bg-surface-high transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-surface-variant flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-heading mb-1">View on Google Maps</p>
                      <p className="text-xs text-subtle">
                        {isShortUrl ? 'Click to open location' : 'Click to open the map'}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-subtle" />
                  </a>
                ) : (
                  <div className="w-full h-full bg-surface-low flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-surface-variant" />
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