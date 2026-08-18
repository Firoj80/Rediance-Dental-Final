import Image from 'next/image';
import { useStaggeredReveal } from '../shared';
import { useClinic } from '../context/ClinicContext';
const aboutClinic = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/about-clinic.jpg';
const team1 = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/team-1.jpg';
const team2 = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/team-2.jpg';
const team3 = 'https://ykloolwpxcehzfv0.public.blob.vercel-storage.com/team-3.jpg';

const STATS = [
  { value: '5.0', label: 'Patient Rating' },
  { value: '112+', label: 'Verified Reviews' },
  { value: '6 Days', label: 'Open Every Week' },
  { value: '10+', label: 'Treatments Offered' },
];

const getTeam = (BUSINESS: any) => [
  { img: team2, name: BUSINESS.doctor, role: 'Principal Dentist' },
  { img: team1, name: 'Dr. Priya Sharma', role: 'Orthodontist' },
  { img: team3, name: 'Ritika Kumari', role: 'Dental Hygienist' },
];

export function AboutPage() {
  const reveal = useStaggeredReveal(6);
  const { clinicData: BUSINESS } = useClinic();

  return (
    <section
      ref={reveal.containerRef}
      className="min-h-screen w-full flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
        {/* Header Card */}
        <div
          className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between min-h-[220px]"
          style={reveal.getAnimStyle(0)}
        >
          <p className="text-xs md:text-sm font-semibold text-black">About Us</p>
          <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-bold leading-[0.95] tracking-tight text-black">
            Trusted Dental
            <br />
            Care in {BUSINESS.city}
          </h1>
          <p className="text-xs md:text-sm font-medium text-black max-w-[260px] leading-4 md:leading-5">
            Professional dental services that match the current technologies.
          </p>
        </div>

        {/* Clinic Image Card */}
        <div
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[240px] h-full"
          style={reveal.getAnimStyle(1)}
        >
          <Image
            src={aboutClinic}
            alt="Our modern dental clinic"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-xl rounded-full px-4 py-2 text-white text-xs md:text-sm font-semibold">
            Modern clinic · {BUSINESS.city}
          </span>
        </div>

        {/* Story Card */}
        <div
          className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex flex-col justify-between min-h-[240px]"
          style={reveal.getAnimStyle(2)}
        >
          <div>
            <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
              Our Story
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-black leading-[1.05]">
              Caring for {BUSINESS.city.split(',')[0]}'s smiles
            </h2>
          </div>
          <div className="space-y-2 md:space-y-3 mt-4 md:mt-6">
            <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5">
              Led by {BUSINESS.doctor}, {BUSINESS.fullName} brings advanced dentistry, high-quality equipment and a
              friendly team to {BUSINESS.city}.
            </p>
            <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5">
              From routine check-ups to facial trauma care, every treatment is
              planned around you — comfortable, transparent and built to last.
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div
          className="grid grid-cols-2 gap-1.5 md:gap-2 min-h-[240px]"
          style={reveal.getAnimStyle(3)}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl md:rounded-2xl bg-stone-50 p-4 md:p-5 flex flex-col justify-between"
            >
              <span className="text-4xl md:text-5xl font-bold text-black leading-none">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm font-semibold text-black">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Team Cards */}
        <div
          className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2"
          style={reveal.getAnimStyle(4)}
        >
          {getTeam(BUSINESS).map((member) => (
            <div
              key={member.name}
              className="rounded-xl md:rounded-2xl overflow-hidden bg-stone-50"
            >
              <div className="relative h-44 md:h-56 w-full">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 md:p-5">
                <p className="text-base md:text-xl font-bold text-black">
                  {member.name}
                </p>
                <p className="text-xs md:text-sm font-medium text-neutral-500">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div
          className="md:col-span-2 rounded-xl md:rounded-2xl bg-black p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-h-[150px]"
          style={reveal.getAnimStyle(5)}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-7 md:leading-9">
            Experience the
            <br />
            difference first-hand
          </h2>
          <a
            href="/book"
            className="px-6 py-3.5 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform shrink-0"
          >
            Book a Visit
          </a>
        </div>
      </div>
    </section>
  );
}
