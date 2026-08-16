'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Stethoscope, Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
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
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const clinicData = useSiteStore((s) => s.clinicData)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (hash: string) => {
    setMobileOpen(false)
    window.location.hash = hash
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/90 backdrop-blur-2xl shadow-[0_1px_20px_rgb(0_0_0/0.04)]'
          : 'bg-transparent'
      )}
    >
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
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center shadow-sm shadow-emerald-700/20">
                <Stethoscope className="w-[18px] h-[18px] text-white" />
              </div>
            )}
            {!clinicData?.logo && (
              <div className="flex flex-col">
                <span className={cn(
                  'font-bold text-sm leading-tight tracking-tight transition-colors',
                  scrolled ? 'text-slate-900' : 'text-slate-900'
                )}>
                  {clinicData?.name || 'Radiance Dental'}
                </span>
                <span className="hidden sm:block text-[10px] leading-tight text-slate-400 font-medium">
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
                className={cn(
                  'relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200',
                  scrolled ? 'text-slate-500 hover:text-slate-900' : 'text-slate-600 hover:text-slate-900',
                )}
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
                className={cn(
                  'flex items-center gap-2 text-[13px] font-medium transition-colors',
                  scrolled ? 'text-slate-500 hover:text-emerald-700' : 'text-slate-500 hover:text-emerald-700'
                )}
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{clinicData.phone}</span>
              </a>
            )}
            <Button
              size="sm"
              onClick={() => handleNav('#/book')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-6 font-medium shadow-sm shadow-emerald-700/15 transition-all hover:shadow-md hover:shadow-emerald-700/20"
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  'lg:hidden p-2 rounded-xl transition-colors',
                  scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 bg-white">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
                  <span className="text-sm font-bold text-slate-900 tracking-tight">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <nav className="flex-1 py-2 overflow-y-auto">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.hash}
                      onClick={() => handleNav(link.hash)}
                      className="w-full text-left px-6 py-3 text-sm font-medium text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/60 transition-all duration-150"
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
                <div className="p-5 border-t border-slate-100 space-y-3">
                  {clinicData?.phone && (
                    <a
                      href={`tel:${clinicData.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2.5 text-sm text-slate-600 font-medium"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      {clinicData.phone}
                    </a>
                  )}
                  <Button
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-semibold shadow-sm"
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
