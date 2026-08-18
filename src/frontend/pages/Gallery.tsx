import Image from 'next/image';
import {
  useStaggeredReveal,
  HERO_IMAGE,
  SECTION2_IMAGE,
  SECTION3_IMG1,
  SECTION3_IMG2,
  SECTION3_BG,
} from '../shared';
import { useClinic } from '../context/ClinicContext';

const gallery1 = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/gallery-1.webp';
const gallery2 = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/gallery-2.webp';
const gallery3 = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/gallery-3.webp';
const gallery4 = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/gallery-4.webp';

const GALLERY_ITEMS = [
  { src: HERO_IMAGE, label: 'Smile Makeover', featured: true },
  { src: gallery1, label: 'Whitening', featured: false },
  { src: gallery2, label: 'Implants', featured: false },
  { src: SECTION2_IMAGE, label: 'Veneers', featured: false },
  { src: gallery3, label: 'Routine Care', featured: false },
  { src: SECTION3_IMG1, label: 'Implant Procedure', featured: false },
  { src: gallery4, label: 'Orthodontics', featured: false },
  { src: SECTION3_IMG2, label: 'Restorations', featured: false },
  { src: SECTION3_BG, label: 'Patient Smiles', featured: false },
];

export function GalleryPage() {
  const reveal = useStaggeredReveal(11);
  const { clinicData: BUSINESS } = useClinic();

  return (
    <section
      ref={reveal.containerRef}
      className="min-h-screen w-full flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[repeat(4,240px)] gap-1.5 md:gap-2">
        {/* Header Card */}
        <div
          className="md:col-span-3 rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4 min-h-[190px] md:min-h-0"
          style={reveal.getAnimStyle(0)}
        >
          <div>
            <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
              Our work
            </p>
            <h1 className="text-[clamp(3rem,8vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-black">
              Smile
              <br />
              Gallery
            </h1>
          </div>
          <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5 max-w-[240px] md:text-right">
            Real transformations from our {BUSINESS.city.split(',')[0]} clinic — nine smiles and
            counting.
          </p>
        </div>

        {/* Image Cards */}
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={item.label}
            className={`rounded-xl md:rounded-2xl overflow-hidden relative ${
              item.featured
                ? 'md:col-span-2 md:row-span-2 h-72 md:h-auto'
                : 'h-56 md:h-auto'
            }`}
            style={reveal.getAnimStyle(i + 1)}
          >
            <Image
              src={item.src}
              alt={item.label}
              fill
              sizes={item.featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-xl text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {item.label}
            </span>
          </div>
        ))}

        {/* CTA Card */}
        <div
          className="md:col-span-3 rounded-xl md:rounded-2xl bg-black p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-h-[150px] md:min-h-0"
          style={reveal.getAnimStyle(10)}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-7 md:leading-9">
            Want your own
            <br />
            transformation?
          </h2>
          <a
            href="/book"
            className="px-6 py-3.5 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform shrink-0"
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
