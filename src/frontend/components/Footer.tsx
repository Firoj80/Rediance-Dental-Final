'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LocationIcon,
  PhoneIcon,
  StarIcon,
  ClockIcon,
  ChevronDownIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from '../shared';
import { useClinic } from '../context/ClinicContext';

export default function Footer() {
  const { clinicData: BUSINESS } = useClinic();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const menuLinks = {
    services: [
      { label: 'General Dentistry', href: '/services' },
      { label: 'Dental Implants', href: '/services' },
      { label: 'Teeth Whitening', href: '/services' },
      { label: 'Dental Veneers', href: '/services' },
      { label: 'Dental Crowns', href: '/services' },
      { label: 'Orthodontics', href: '/services' },
    ],
    quickLinks: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/about' },
      { label: 'Smile Gallery', href: '/gallery' },
      { label: 'Patient Reviews', href: '/testimonials' },
      { label: 'Blog', href: '/blog' },
      { label: 'Book Appointment', href: '/book' },
      { label: 'Contact Us', href: '/contact' },
    ],
  };

  const hours = BUSINESS.hours;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer className="bg-black text-white">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              Ready for your
              <br />
              best smile?
            </h2>
            <p className="text-sm text-neutral-400 mt-3 md:mt-4">
              Book your appointment today and let us transform your smile.
            </p>
          </div>
          <Link
            href="/book"
            className="px-8 py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform shrink-0"
          >
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {/* Column 1: About */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex flex-col">
              <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none">
                {BUSINESS.name.split(' ')[0]}
              </span>
              <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none -mt-1.5 md:-mt-2">
                {BUSINESS.name.split(' ').slice(1).join(' ')}
              </span>
              <span className="text-[8px] md:text-[9px] font-medium leading-none mt-1.5 md:mt-2 text-neutral-400">
                {BUSINESS.fullName.includes('&') ? BUSINESS.fullName.split('&')[1].trim() : ''} · {BUSINESS.city.split(',')[0]}
              </span>
            </Link>
            <p className="text-sm text-neutral-400 mt-4 md:mt-6 leading-relaxed max-w-xs">
              Led by {BUSINESS.doctor}, {BUSINESS.fullName} provides professional dental and facial trauma care that matches the current technologies — for every patient, every smile.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {[
                { Icon: FacebookIcon, label: 'Facebook' },
                { Icon: InstagramIcon, label: 'Instagram' },
                { Icon: TwitterIcon, label: 'Twitter' },
                { Icon: YoutubeIcon, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="md:block">
            <button
              className="md:hidden flex items-center justify-between w-full text-left"
              onClick={() => toggleSection('services')}
            >
              <span className="text-sm font-bold uppercase tracking-wide">Services</span>
              <span className={`transform transition-transform duration-300 ${expandedSection === 'services' ? 'rotate-180' : ''}`}>
                <ChevronDownIcon />
              </span>
            </button>
            <span className="hidden md:block text-sm font-bold uppercase tracking-wide mb-4">Services</span>
            <ul className={`space-y-2 md:mt-0 mt-3 ${expandedSection === 'services' || expandedSection === null ? '' : 'hidden md:block'}`}>
              {menuLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="md:block">
            <button
              className="md:hidden flex items-center justify-between w-full text-left"
              onClick={() => toggleSection('quicklinks')}
            >
              <span className="text-sm font-bold uppercase tracking-wide">Quick Links</span>
              <span className={`transform transition-transform duration-300 ${expandedSection === 'quicklinks' ? 'rotate-180' : ''}`}>
                <ChevronDownIcon />
              </span>
            </button>
            <span className="hidden md:block text-sm font-bold uppercase tracking-wide mb-4">Quick Links</span>
            <ul className={`space-y-2 md:mt-0 mt-3 ${expandedSection === 'quicklinks' || expandedSection === null ? '' : 'hidden md:block'}`}>
              {menuLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="md:block">
            <button
              className="md:hidden flex items-center justify-between w-full text-left"
              onClick={() => toggleSection('contact')}
            >
              <span className="text-sm font-bold uppercase tracking-wide">Contact</span>
              <span className={`transform transition-transform duration-300 ${expandedSection === 'contact' ? 'rotate-180' : ''}`}>
                <ChevronDownIcon />
              </span>
            </button>
            <span className="hidden md:block text-sm font-bold uppercase tracking-wide mb-4">Contact</span>
            <div className={`space-y-4 md:mt-0 mt-3 ${expandedSection === 'contact' || expandedSection === null ? '' : 'hidden md:block'}`}>
              <div className="flex items-start gap-3">
                <span className="text-neutral-400 mt-0.5"><LocationIcon /></span>
                <div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {BUSINESS.addressLine1}<br />
                    {BUSINESS.addressLine2}<br />
                    {BUSINESS.addressLine3}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-neutral-400"><PhoneIcon /></span>
                <a href={`tel:${BUSINESS.phone}`} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                  {BUSINESS.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-neutral-400"><StarIcon /></span>
                <a href={BUSINESS.mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                  {BUSINESS.rating} · {BUSINESS.reviews} patient reviews
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neutral-400 mt-0.5"><ClockIcon /></span>
                <div className="space-y-1">
                  {hours.map((h, index) => (
                    <div key={`${h.day}-${index}`} className="flex justify-between gap-4 text-sm">
                      <span className="text-neutral-400">{h.day}</span>
                      <span className="text-white">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="flex items-center gap-3 mb-6">
            <LocationIcon />
            <h3 className="text-lg md:text-xl font-bold">Find Us</h3>
          </div>
          <div className="rounded-xl md:rounded-2xl overflow-hidden h-64 md:h-80 lg:h-96 bg-neutral-800">
            <iframe
              title="Dental Health Location"
              src={BUSINESS.mapEmbed}
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4 gap-3">
            <p className="text-xs text-neutral-500">
              {BUSINESS.fullAddress}
            </p>
            <a
              href={BUSINESS.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-neutral-300 transition-colors duration-200"
            >
              Get Directions
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-[-45deg]" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {BUSINESS.fullName} · {BUSINESS.doctor} · {BUSINESS.city}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {[
              { label: 'Privacy Policy', href: '/contact' },
              { label: 'Terms of Service', href: '/contact' },
              { label: 'Accessibility', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-neutral-500 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
