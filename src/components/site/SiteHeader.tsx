'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Stethoscope, Menu, Phone, X } from 'lucide-react'
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
    const onScroll = () => setScrolled(window.scrollY > 40)
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => handleNav('#/')}
          >
            <div className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
              scrolled ? 'bg-primary' : 'bg-white/20'
            )}>
              <Stethoscope className={cn('w-5 h-5', scrolled ? 'text-white' : 'text-white')} />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                'font-bold text-sm leading-tight transition-colors',
                scrolled ? 'text-foreground' : 'text-white'
              )}>
                {clinicData?.name || 'Radiance Dental'}
              </span>
              <span className={cn(
                'text-[10px] leading-tight transition-colors',
                scrolled ? 'text-muted-foreground' : 'text-white/70'
              )}>
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
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  scrolled
                    ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA + Phone */}
          <div className="hidden lg:flex items-center gap-3">
            {clinicData?.phone && (
              <a
                href={`tel:${clinicData.phone}`}
                className={cn(
                  'flex items-center gap-1.5 text-sm transition-colors',
                  scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
                )}
              >
                <Phone className="w-4 h-4" />
                {clinicData.phone}
              </a>
            )}
            <Button
              size="sm"
              onClick={() => handleNav('#/book')}
              className="bg-primary hover:bg-primary/90 text-white shadow-sm"
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  'lg:hidden p-2 rounded-md transition-colors',
                  scrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
                )}
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-semibold text-foreground">Menu</span>
                </div>
                <nav className="flex-1 py-4 overflow-y-auto">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.hash}
                      onClick={() => handleNav(link.hash)}
                      className="w-full text-left px-6 py-3 text-foreground/80 hover:text-foreground hover:bg-muted transition-colors text-sm font-medium"
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
                <div className="p-4 border-t">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white"
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
