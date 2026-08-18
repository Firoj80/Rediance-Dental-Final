import { useState, useEffect, useRef, useCallback } from 'react';

// ============ IMAGE CONSTANTS ============
export const HERO_IMAGE = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/hero-image.webp';

export const SECTION2_IMAGE = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/section2-image.webp';

export const SECTION3_IMG1 = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/section3-img1.webp';

export const SECTION3_IMG2 = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/section3-img2.webp';

export const SECTION3_BG = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/section3-bg.webp';

// ============ NAV LINKS ============
export const NAV_LINKS = [
  { label: 'Home', path: '/', href: '/' },
  { label: 'Services', path: '/services', href: '/services' },
  { label: 'About', path: '/about', href: '/about' },
  { label: 'Gallery', path: '/gallery', href: '/gallery' },
  { label: 'Reviews', path: '/testimonials', href: '/testimonials' },
  { label: 'Blog', path: '/blog', href: '/blog' },
  { label: 'Contact', path: '/contact', href: '/contact' },
];

// ============ BUSINESS DETAILS ============
export const BUSINESS = {
  name: 'Radiance Dental Care',
  fullName: 'Radiance Dental Care & Facial Trauma Centre',
  doctor: 'Dr. Shahid Raza',
  city: 'Siwan, Bihar',
  addressLine1: 'In front of Circus Maidan',
  addressLine2: 'Fatehpur Bypass Rd, Aashi Colony Road',
  addressLine3: 'Babhnauli, Siwan, Bihar 841226',
  fullAddress:
    'In front of Circus Maidan, Fatehpur Bypass Rd, Babhnauli, Siwan, Bihar 841226',
  rating: '5.0',
  reviews: 112,
  hours: [
    { day: 'Monday – Saturday', time: '10:00 AM – 6:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
  phone: '+919162387713',
  phoneDisplay: '+91 91623 87713',
  mapsLink: 'https://maps.app.goo.gl/qZ7BG6i356EroRhf8',
  mapEmbed: 'https://www.google.com/maps?q=26.2264052,84.3656046&z=16&output=embed',
};

// ============ SERVICE IMAGES ============
export const SERVICE_IMAGES = {
  veneers:
    'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/service-veneers.jpg',
  crowns:
    'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/service-crowns.jpg',
  whitening:
    'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/service-whitening.jpg',
  implants:
    'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/service-implants.jpg',
  orthodontics:
    'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/service-orthodontics.jpg',
  rootCanal:
    'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/service-rootcanal.jpg',
  trauma:
    'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/service-trauma.jpg',
  gums:
    'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/service-gums.jpg',
};

// ============ TYPES ============
export interface MaskPosition {
  x: number;
  y: number;
  sw: number;
  sh: number;
}

export interface MaskedCardProps {
  bgImage: string;
  position: MaskPosition;
  imageWidth: number;
  focalX: number;
  className: string;
  children: React.ReactNode;
  cardRef: (el: HTMLDivElement | null) => void;
  style?: React.CSSProperties;
}

// ============ HOOKS ============
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export function useImageWidth(
  imageUrl: string,
  sectionRef: React.RefObject<HTMLDivElement | null>
): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const img = new Image();
    let observer: ResizeObserver | null = null;

    img.onload = () => {
      const update = () => {
        const section = sectionRef.current;
        if (section && img.naturalHeight > 0) {
          setWidth(img.naturalWidth * (section.clientHeight / img.naturalHeight));
        }
      };
      update();

      observer = new ResizeObserver(update);
      if (sectionRef.current) observer.observe(sectionRef.current);
    };
    img.src = imageUrl;

    return () => observer?.disconnect();
  }, [imageUrl]);

  return width;
}

export function useMaskPositions(
  sectionRef: React.RefObject<HTMLDivElement | null>,
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
): MaskPosition[] {
  const [positions, setPositions] = useState<MaskPosition[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let observer: ResizeObserver | null = null;

    const update = () => {
      const sectionRect = section.getBoundingClientRect();
      const newPositions: MaskPosition[] = [];
      const validCards = cardRefs.current.filter(Boolean);

      if (validCards.length === 0) return;

      for (const card of validCards) {
        const cardRect = card!.getBoundingClientRect();
        newPositions.push({
          x: cardRect.left - sectionRect.left,
          y: cardRect.top - sectionRect.top,
          sw: sectionRect.width,
          sh: sectionRect.height,
        });
      }

      if (newPositions.length > 0) {
        setPositions(newPositions);
      }
    };

    requestAnimationFrame(() => {
      update();
      observer = new ResizeObserver(update);
      observer.observe(section);
    });

    return () => observer?.disconnect();
  }, []);

  return positions;
}

export function useStaggeredReveal(_count: number, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const getAnimStyle = useCallback(
    (index: number) => ({
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
    }),
    [visible]
  );

  return { containerRef, getAnimStyle };
}

// ============ MASKED CARD ============
export function MaskedCard({
  bgImage,
  position,
  imageWidth,
  focalX,
  className,
  children,
  cardRef,
  style,
}: MaskedCardProps) {
  const overflow = imageWidth > position.sw ? imageWidth - position.sw : 0;
  const focalOffset = overflow * focalX;

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: `auto ${position.sh}px`,
        backgroundPosition: `-${position.x + focalOffset}px -${position.y}px`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  );
}

// ============ SVG ICONS ============
export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`rotate-[-45deg] ${className}`}
    >
      <path
        d="M1 7h12m0 0L8 2m5 5L8 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MailIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LocationIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClockIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FacebookIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function TwitterIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function YoutubeIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="10 8 16 12 10 16" fill="currentColor" />
    </svg>
  );
}

export function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
