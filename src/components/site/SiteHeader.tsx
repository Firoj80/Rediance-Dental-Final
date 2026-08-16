'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Stethoscope, Menu, X } from 'lucide-react'
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
    const onScroll = () => setScrolled(window.scrollY > 20)
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgb(0_0_0/0.06)]'
          : 'bg-white/80 backdrop-blur-md'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
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
                className="h-8 w-auto max-w-[130px] object-contain"
              />
            ) : (
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                'bg-emerald-700'
              )}>
                <Stethoscope className="w-4.5 h-4.5 text-white" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight tracking-tight text-slate-900">
                {clinicData?.name || 'Radiance Dental'}
              </span>
              <span className="hidden sm:block text-[10px] leading-tight tracking-tight text-slate-400">
                {clinicData?.tagline || 'Dental Care & Facial Trauma Centre'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.hash}
                onClick={() => handleNav(link.hash)}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium text-slate-600 transition-colors',
                  'after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-px after:bg-slate-900 after:scale-x-0 after:origin-left after:transition-transform after:duration-200',
                  'hover:text-slate-900 hover:after:scale-x-100'
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => handleNav('#/book')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-5 font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  'lg:hidden p-2 rounded-lg transition-colors',
                  'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0 bg-white">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-900 tracking-tight">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <nav className="flex-1 py-3 overflow-y-auto">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.hash}
                      onClick={() => handleNav(link.hash)}
                      className={cn(
                        'w-full text-left px-5 py-2.5 text-sm font-medium transition-all duration-150',
                        'text-slate-500 hover:text-emerald-700',
                        'border-l-2 border-transparent hover:border-l-emerald-500 hover:bg-emerald-50/50'
                      )}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
                <div className="p-4 border-t border-slate-100">
                  <Button
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-sm"
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
