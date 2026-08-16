'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Stethoscope, Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useSiteStore } from '@/lib/store'

const NAV_LINKS = [
  { label: 'Home', hash: '#/' },
  { label: 'About', hash: '#/about' },
  { label: 'Services', hash: '#/services' },
  { label: 'Gallery', hash: '#/gallery' },
  { label: 'Testimonials', hash: '#/testimonials' },
  { label: 'Blog', hash: '#/blog' },
  { label: 'Contact', hash: '#/contact' },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const clinicData = useSiteStore((s) => s.clinicData)

  const handleNav = (hash: string) => {
    setMobileOpen(false)
    window.location.hash = hash
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a111a]/80 backdrop-blur-md transition-all duration-500">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => handleNav('#/')}
          >
            {clinicData?.logo ? (
              <img
                src={clinicData.logo}
                alt={clinicData.name || 'Logo'}
                className="h-9 w-auto max-w-[140px] object-contain"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center">
                <Stethoscope className="w-[18px] h-[18px] text-teal-text" />
              </div>
            )}
            {!clinicData?.logo && (
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight tracking-tight text-heading">
                  {clinicData?.name || 'Radiance Dental'}
                </span>
                <span className="hidden sm:block text-[10px] leading-tight text-subtle font-medium">
                  {clinicData?.tagline || 'Dental Care & Facial Trauma Centre'}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <button
                key={link.hash}
                onClick={() => handleNav(link.hash)}
                className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#c4c6cf] hover:text-teal transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {clinicData?.phone && (
              <a
                href={`tel:${clinicData.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-[13px] font-medium text-teal transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{clinicData.phone}</span>
              </a>
            )}
            <Button
              size="sm"
              onClick={() => handleNav('#/book')}
              className="bg-teal hover:bg-teal-dark text-teal-text rounded px-6 font-medium transition-all"
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 rounded-xl text-[#c4c6cf] hover:text-teal hover:bg-surface-variant transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 bg-surface-low">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 h-16 border-b border-border-subtle">
                  <span className="text-sm font-bold text-heading tracking-tight">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-xl text-subtle hover:text-heading hover:bg-surface-variant transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <nav className="flex-1 py-2 overflow-y-auto">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.hash}
                      onClick={() => handleNav(link.hash)}
                      className="w-full text-left px-6 py-3 text-sm font-medium text-body hover:text-teal hover:bg-surface-variant transition-all duration-150"
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
                <div className="p-5 border-t border-border-subtle space-y-3">
                  {clinicData?.phone && (
                    <a
                      href={`tel:${clinicData.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2.5 text-sm text-teal font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      {clinicData.phone}
                    </a>
                  )}
                  <Button
                    className="w-full bg-teal hover:bg-teal-dark text-teal-text rounded font-semibold"
                    onClick={() => handleNav('#/book')}
                  >
                    Book Appointment
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}