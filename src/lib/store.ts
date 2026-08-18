import { create } from 'zustand'

export interface ClinicData {
  id: string
  name: string
  tagline: string | null
  description: string | null
  logo: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  address: string | null
  googleMapsUrl: string | null
  facebook: string | null
  instagram: string | null
  youtube: string | null
  settings: {
    id: string
    doctorName: string | null
    doctorQualification: string | null
    doctorExperience: string | null
    doctorBio: string | null
    doctorPhoto: string | null
    doctorSpecializations: string | null
    defaultSlotDuration: number
    bookingAdvanceDays: number
    statYears: string | null
    statPatients: string | null
    statServices: string | null
    statRating: string | null
    heroImage: string | null
    homeSeoTitle: string | null
    homeSeoDescription: string | null
  }[]
}

export interface ServiceData {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  fullDescription: string | null
  image: string | null
  price: number | null
  duration: number
  featured: boolean
  active: boolean
  displayOrder: number
}

export interface TestimonialData {
  id: string
  patientName: string
  review: string
  rating: number
  photo: string | null
  published: boolean
  displayOrder: number
}

export interface GalleryImageData {
  id: string
  title: string | null
  image: string
  category: string | null
  displayOrder: number
  visible: boolean
}

export interface BlogPostData {
  id: string
  title: string
  slug: string
  featuredImage: string | null
  content: string | null
  category: string | null
  tags: string | null
  author: string | null
  published: boolean
  publishedAt: string | null
}

export interface WorkingHourData {
  id: string
  dayOfWeek: number
  enabled: boolean
  sessions: { id: string; startTime: string; endTime: string }[]
}

interface SiteStore {
  currentRoute: string
  routeParams: Record<string, string>
  clinicData: ClinicData | null
  services: ServiceData[]
  featuredServices: ServiceData[]
  testimonials: TestimonialData[]
  galleryImages: GalleryImageData[]
  blogPosts: BlogPostData[]
  workingHours: WorkingHourData[]
  blockedDates: string[]
  loading: boolean
  clinicLoading: boolean

  setRoute: (route: string, params?: Record<string, string>) => void
  setClinicData: (data: ClinicData) => void
  setServices: (data: ServiceData[]) => void
  setTestimonials: (data: TestimonialData[]) => void
  setGalleryImages: (data: GalleryImageData[]) => void
  setBlogPosts: (data: BlogPostData[]) => void
  setWorkingHours: (data: WorkingHourData[]) => void
  setBlockedDates: (dates: string[]) => void
  setLoading: (loading: boolean) => void
  setClinicLoading: (loading: boolean) => void
}

export const useSiteStore = create<SiteStore>((set) => ({
  currentRoute: '/',
  routeParams: {},
  clinicData: null,
  services: [],
  featuredServices: [],
  testimonials: [],
  galleryImages: [],
  blogPosts: [],
  workingHours: [],
  blockedDates: [],
  loading: false,
  clinicLoading: true,

  setRoute: (route, params = {}) => set({ currentRoute: route, routeParams: params }),
  setClinicData: (data) =>
    set({
      clinicData: data,
      featuredServices: [],
    }),
  setServices: (data) =>
    set((state) => ({
      services: data,
      featuredServices: data.filter((s) => s.featured).slice(0, 6),
    })),
  setTestimonials: (data) => set({ testimonials: data }),
  setGalleryImages: (data) => set({ galleryImages: data }),
  setBlogPosts: (data) => set({ blogPosts: data }),
  setWorkingHours: (data) => set({ workingHours: data }),
  setBlockedDates: (dates) => set({ blockedDates: dates }),
  setLoading: (loading) => set({ loading }),
  setClinicLoading: (loading) => set({ clinicLoading: loading }),
}))
