import Image from 'next/image';
import { useRef, useCallback } from 'react';
import {
  HERO_IMAGE,
  SECTION2_IMAGE,
  SECTION3_IMG1,
  SECTION3_IMG2,
  SECTION3_BG,
  SERVICE_IMAGES,
  MaskedCard,
  useIsMobile,
  useImageWidth,
  useMaskPositions,
  useStaggeredReveal,
} from '../shared';
import { getLatestPosts } from '../blogData';
import { useClinic } from '../context/ClinicContext';

const featureBars = ['Advanced Dentistry', 'High Quality Equipment', 'Friendly Staff'];

const services = [
  {
    name: 'Dental\nVeneers',
    num: '01',
    img: SERVICE_IMAGES.veneers,
    alt: 'Dentist applying a porcelain veneer to a patient',
  },
  {
    name: 'Dental\nCrowns',
    num: '02',
    img: SERVICE_IMAGES.crowns,
    alt: 'Dentist holding a dental cast for a crown fitting',
  },
  {
    name: 'Teeth\nWhitening',
    num: '03',
    img: SERVICE_IMAGES.whitening,
    alt: 'Dentist matching tooth shade with a whitening guide',
  },
  {
    name: 'Dental\nImplants',
    num: '04',
    img: SERVICE_IMAGES.implants,
    alt: 'Close-up of a dental implant model',
  },
];

// ============ SECTION 1: HERO ============
function Section1() {
  const { clinicData: BUSINESS } = useClinic();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const s1Reveal = useStaggeredReveal(4);
  const isMobile = useIsMobile();
  const imageWidth = useImageWidth(HERO_IMAGE, sectionRef);
  const positions = useMaskPositions(sectionRef, cardRefs);

  const focalX = isMobile ? 0.7 : 0.8;

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  const setSectionRef = useCallback(
    (el: HTMLDivElement | null) => {
      sectionRef.current = el;
      (s1Reveal.containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [s1Reveal.containerRef]
  );

  return (
    <section
      ref={setSectionRef}
      className="h-screen w-full overflow-hidden flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      {featureBars.map((label, i) => (
        <MaskedCard
          key={label}
          bgImage={HERO_IMAGE}
          position={positions[i] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          className="w-full h-14 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative"
          cardRef={setCardRef(i)}
          style={s1Reveal.getAnimStyle(i)}
        >
          <span className="flex items-center justify-center h-full text-black text-lg md:text-3xl font-bold text-center relative z-10">
            {label}
          </span>
        </MaskedCard>
      ))}

      <MaskedCard
        bgImage={HERO_IMAGE}
        position={positions[3] || { x: 0, y: 0, sw: 1, sh: 1 }}
        imageWidth={imageWidth}
        focalX={focalX}
        className="w-full flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden relative"
        cardRef={setCardRef(3)}
        style={s1Reveal.getAnimStyle(3)}
      >
        <div className="absolute top-4 left-4 md:top-7 md:left-7 text-black text-xs md:text-sm font-semibold leading-4 md:leading-5 max-w-[200px] md:max-w-[300px] z-10">
          We wish to provide professional dental services
          <br />
          that match the current technologies
        </div>

        <div className="absolute bottom-5 left-3 md:bottom-8 md:left-4 z-10">
          <span className="block text-black text-xs md:text-sm font-semibold mb-1 md:mb-2">
            Trusted Dentist in {BUSINESS.city}
          </span>
          <h1 className="text-black text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.79] tracking-tight">
            Dental
            <br />
            Care
          </h1>
        </div>

        <span className="absolute bottom-6 right-4 md:bottom-10 md:right-8 text-white text-xs md:text-sm font-semibold z-10">
          Free Consultation
        </span>
      </MaskedCard>
    </section>
  );
}

// ============ SECTION 2: SMILE GALLERY ============
function Section2() {
  const { clinicData: BUSINESS } = useClinic();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const s2Reveal = useStaggeredReveal(4);
  const isMobile = useIsMobile();
  const imageWidth = useImageWidth(SECTION2_IMAGE, sectionRef);
  const positions = useMaskPositions(sectionRef, cardRefs);

  const focalX = isMobile ? 0.65 : 0.8;

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  const setSectionRef = useCallback(
    (el: HTMLDivElement | null) => {
      sectionRef.current = el;
      (s2Reveal.containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [s2Reveal.containerRef]
  );

  return (
    <section
      ref={setSectionRef}
      className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">
        {/* Card 0 - Smile Gallery */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[0] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          cardRef={setCardRef(0)}
          style={s2Reveal.getAnimStyle(0)}
        >
          <span className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-2xl md:text-3xl font-bold z-10">
            Smile Gallery
          </span>
          <span className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white md:text-black text-xs md:text-sm font-semibold z-10">
            Our cosmetic dental work
          </span>
        </MaskedCard>

        {/* Card 1 - Top Right (spans 2 rows on desktop) */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[1] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          className="md:row-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          cardRef={setCardRef(1)}
          style={s2Reveal.getAnimStyle(1)}
        >
          <span className="absolute bottom-16 left-5 md:bottom-20 md:left-7 text-white text-xs md:text-sm font-semibold leading-4 md:leading-5 z-10">
            If you want a gorgeous smile,
            <br />
            call us to ask about a smile makeover.
          </span>
          <a
            href={`tel:${BUSINESS.phone}`}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold z-10 hover:scale-105 transition-transform"
          >
            Call Us
          </a>
        </MaskedCard>

        {/* Card 2 - Smile makeover */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[2] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          cardRef={setCardRef(2)}
          style={s2Reveal.getAnimStyle(2)}
        >
          <span className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] z-10">
            Smile
            <br />
            makeover
          </span>
        </MaskedCard>

        {/* Card 3 - Services (full width on desktop) */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[3] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          className="col-span-1 md:col-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          cardRef={setCardRef(3)}
          style={s2Reveal.getAnimStyle(3)}
        >
          <div className="absolute inset-0 z-10 flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2 p-2 md:p-3">
            {services.map((svc, i) => (
              <div
                key={i}
                className="group flex-1 min-w-[calc(50%-4px)] md:min-w-0 rounded-xl md:rounded-2xl overflow-hidden relative"
              >
                {/* Real service photo */}
                <Image
                  src={svc.img}
                  alt={svc.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                {/* Legibility gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                <div className="relative z-10 h-full p-3 md:p-5 flex flex-col justify-between">
                  <h3 className="text-xl md:text-4xl font-bold leading-[1.05] whitespace-pre-line text-white">
                    {svc.name}
                  </h3>
                  <div className="self-end w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-xs md:text-sm font-semibold text-white">
                    {svc.num}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MaskedCard>
      </div>
    </section>
  );
}

// ============ SECTION 3: IMPLANT DENTISTRY ============
function Section3() {
  const s3Reveal = useStaggeredReveal(4);

  return (
    <section
      ref={s3Reveal.containerRef}
      className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-1.5 md:gap-2">
          {/* 1. Heading Card */}
          <div
            className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0"
            style={s3Reveal.getAnimStyle(0)}
          >
            <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-black">
              Implant
              <br />
              Dentistry
            </h2>
            <p className="text-xs md:text-sm font-semibold text-black">
              Restore Missing Teeth
            </p>
          </div>

          {/* 2. Two Image Cards */}
          <div
            className="flex gap-1.5 md:gap-2 flex-1 min-h-[140px] md:min-h-0"
            style={s3Reveal.getAnimStyle(1)}
          >
            <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
              <Image
                src={SECTION3_IMG1}
                alt="Dental implant procedure"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
              <Image
                src={SECTION3_IMG2}
                alt="Dental restoration"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* 3. Consultation Card */}
          <div
            className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0"
            style={s3Reveal.getAnimStyle(2)}
          >
            <div>
              <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
                Consultation
              </p>
              <h3 className="text-xl md:text-3xl font-bold text-black leading-6 md:leading-8">
                Dental
                <br />
                Restoration
                <br />
                Services
              </h3>
            </div>
            <a
              href="/book"
              className="px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform"
            >
              Book Online
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[350px] md:min-h-0"
          style={s3Reveal.getAnimStyle(3)}
        >
          <Image
            src={SECTION3_BG}
            alt="Smiling patient"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 flex gap-1.5 md:gap-2">
            {/* Overlay Card 1 - White */}
            <div className="flex-1 bg-white rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-end h-36 md:h-52">
              <h4 className="text-lg md:text-2xl font-bold text-black leading-5 md:leading-7">
                The Process
                <br />
                of Installing
                <br />
                Implants
              </h4>
            </div>

            {/* Overlay Card 2 - Glass */}
            <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-end h-36 md:h-52">
              <h4 className="text-lg md:text-2xl font-bold text-white leading-5 md:leading-7">
                Caring
                <br />
                for Dental
                <br />
                Implants
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ SECTION 4: LATEST BLOG ============
function Section4() {
  const { clinicData: BUSINESS } = useClinic();
  const reveal = useStaggeredReveal(5);
  const posts = getLatestPosts(BUSINESS).slice(0, 3);

  return (
    <section
      ref={reveal.containerRef}
      className="w-full flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-8 md:pb-12 gap-1.5 md:gap-2"
    >
      {/* Section header */}
      <div
        className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4 min-h-[170px]"
        style={reveal.getAnimStyle(0)}
      >
        <div>
          <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
            From the clinic
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-black">
            Latest
            <br />
            Blogs
          </h2>
        </div>
        <a
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200 shrink-0"
        >
          View All Posts
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 7h12m0 0L8 2m5 5L8 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* Blog cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2">
        {posts.map((post, i) => (
          <a
            key={post.id}
            href={`/blog`}
            className="group rounded-xl md:rounded-2xl overflow-hidden relative min-h-[300px] md:min-h-[340px] flex flex-col"
            style={reveal.getAnimStyle(i + 1)}
          >
            <div className="relative h-44 md:h-52 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </div>
            <div className="flex-1 bg-stone-50 p-4 md:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black leading-6 md:leading-7 mt-2 md:mt-3 group-hover:underline">
                  {post.title}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black">
                  Read
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1">
                    <path
                      d="M1 7h12m0 0L8 2m5 5L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </>
  );
}
