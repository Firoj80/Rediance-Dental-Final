'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useHashRouter } from '@/hooks/use-hash-router'
import { useSiteStore } from '@/lib/store'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { MobileCTA } from './MobileCTA'

// Home sections
import { HeroSection } from './home/HeroSection'
import { ClinicIntro } from './home/ClinicIntro'
import { ServicesPreview } from './home/ServicesPreview'
import { WhyChooseUs } from './home/WhyChooseUs'
import { DoctorSection } from './home/DoctorSection'
import { StatsSection } from './home/StatsSection'
import { TestimonialsPreview } from './home/TestimonialsPreview'
import { GalleryPreview } from './home/GalleryPreview'
import { BlogPreview } from './home/BlogPreview'
import { CTASection } from './home/CTASection'
import { ContactSection } from './home/ContactSection'

// Pages
import { AboutPage } from './AboutPage'
import { ServicesPage } from './ServicesPage'
import { ServiceDetailPage } from './ServiceDetailPage'
import { GalleryPage } from './GalleryPage'
import { TestimonialsPage } from './TestimonialsPage'
import { BlogListingPage } from './BlogListingPage'
import { BlogDetailPage } from './BlogDetailPage'
import { ContactPage } from './ContactPage'
import { BookingPage } from './BookingPage'

function HomePage() {
  return (
    <>
      <HeroSection />
      <ClinicIntro />
      <ServicesPreview />
      <WhyChooseUs />
      <DoctorSection />
      <StatsSection />
      <TestimonialsPreview />
      <GalleryPreview />
      <BlogPreview />
      <CTASection />
      <ContactSection />
    </>
  )
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

function PageRenderer({ route, params }: { route: string; params: Record<string, string> }) {
  switch (route) {
    case '/':
      return <HomePage />
    case 'about':
      return <AboutPage />
    case 'services':
      return <ServicesPage />
    case 'service-detail':
      return <ServiceDetailPage slug={params.slug} />
    case 'gallery':
      return <GalleryPage />
    case 'testimonials':
      return <TestimonialsPage />
    case 'blog':
      return <BlogListingPage />
    case 'blog-detail':
      return <BlogDetailPage slug={params.slug} />
    case 'contact':
      return <ContactPage />
    case 'book':
      return <BookingPage />
    default:
      return <HomePage />
  }
}

export function SiteApp() {
  const { route, params } = useHashRouter()
  const {
    setClinicData,
    setServices,
    setTestimonials,
    setGalleryImages,
    setBlogPosts,
    setClinicLoading,
  } = useSiteStore()

  // Initial data fetch
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [clinicRes, servicesRes, testimonialsRes, galleryRes, blogsRes] = await Promise.all([
          fetch('/api/clinic'),
          fetch('/api/services'),
          fetch('/api/testimonials'),
          fetch('/api/gallery'),
          fetch('/api/blogs'),
        ])

        if (clinicRes.ok) {
          const clinicData = await clinicRes.json()
          setClinicData(clinicData)
        }
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json()
          setServices(servicesData)
        }
        if (testimonialsRes.ok) {
          const testimonialsData = await testimonialsRes.json()
          setTestimonials(testimonialsData)
        }
        if (galleryRes.ok) {
          const galleryData = await galleryRes.json()
          setGalleryImages(galleryData)
        }
        if (blogsRes.ok) {
          const blogsData = await blogsRes.json()
          setBlogPosts(blogsData)
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setClinicLoading(false)
      }
    }

    fetchInitialData()
  }, [setClinicData, setServices, setTestimonials, setGalleryImages, setBlogPosts, setClinicLoading])

  // Update document title
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Home',
      about: 'About Us',
      services: 'Our Services',
      gallery: 'Gallery',
      testimonials: 'Testimonials',
      blog: 'Blog',
      contact: 'Contact',
      book: 'Book Appointment',
    }
    document.title = `${titles[route] || 'Home'} | ${useSiteStore.getState().clinicData?.name || 'Radiance Dental Care'}`
  }, [route])

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <AnimatePresence mode="wait">
        <motion.main
          key={route + (params.slug || '')}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="flex-1"
        >
          <PageRenderer route={route} params={params} />
        </motion.main>
      </AnimatePresence>

      <SiteFooter />
      <MobileCTA />

      {/* Spacer for mobile CTA */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
