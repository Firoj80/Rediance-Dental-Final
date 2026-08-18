import { StarIcon, useStaggeredReveal } from '../shared';
import { useClinic } from '../context/ClinicContext';

const getReviews = (BUSINESS: any) => [
  {
    name: 'Shahil',
    date: 'April 2025',
    treatment: 'Facial Trauma Care',
    text: `${BUSINESS.fullName}, led by ${BUSINESS.doctor}, is an outstanding facility. The accurate diagnosis and excellent treatment I received were remarkable. Their good supervision ensured a speedy recovery, and I appreciated the quick service without compromising on cleanliness — sterilised equipment and a hygienic environment made me feel safe.`,
    featured: true,
  },
  {
    name: 'Anjali Kumari',
    date: 'March 2025',
    treatment: 'Root Canal Therapy',
    text: `I was terrified of the root canal, but ${BUSINESS.doctor} explained every step. Completely painless and finished in one sitting.`,
  },
  {
    name: 'Mohammad Faiz',
    date: 'February 2025',
    treatment: 'Dental Implants',
    text: 'Got two implants done here. The results look completely natural and the follow-up care was excellent.',
  },
  {
    name: 'Priya Singh',
    date: 'January 2025',
    treatment: 'Teeth Whitening',
    text: 'Visible difference after just one session. The clinic is spotless and the staff are genuinely friendly.',
  },
  {
    name: 'Rakesh Yadav',
    date: 'December 2024',
    treatment: 'Dental Crowns',
    text: `Best dental clinic in ${BUSINESS.city.split(',')[0]}. Fair pricing, modern equipment and no unnecessary treatments pushed on you.`,
  },
  {
    name: 'Nusrat Jahan',
    date: 'November 2024',
    treatment: 'Orthodontics',
    text: `My aligner treatment is going perfectly. ${BUSINESS.doctor} tracks the progress carefully at every appointment.`,
  },
  {
    name: 'Amit Gupta',
    date: 'October 2024',
    treatment: 'Emergency Visit',
    text: 'Came in after a road accident with a facial injury. They treated me immediately with real professionalism.',
  },
];

function Stars({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} />
      ))}
    </div>
  );
}

export function TestimonialsPage() {
  const { clinicData: BUSINESS } = useClinic();
  const reveal = useStaggeredReveal(10);

  return (
    <section
      ref={reveal.containerRef}
      className="min-h-screen w-full flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2">
        {/* Header Card */}
        <div
          className="md:col-span-2 rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between gap-4 min-h-[220px]"
          style={reveal.getAnimStyle(0)}
        >
          <p className="text-xs md:text-sm font-semibold text-black">
            What our patients say
          </p>
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight text-black">
            Patient
            <br />
            Reviews
          </h1>
          <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5 max-w-[320px]">
            Rated {BUSINESS.rating} out of 5 by {BUSINESS.reviews}+ verified
            patients across {BUSINESS.city}.
          </p>
        </div>

        {/* Rating Summary Card */}
        <div
          className="rounded-xl md:rounded-2xl bg-black p-5 md:p-7 flex flex-col justify-between min-h-[220px]"
          style={reveal.getAnimStyle(1)}
        >
          <div>
            <span className="block text-6xl md:text-7xl font-bold text-white leading-none">
              {BUSINESS.rating}
            </span>
            <Stars className="text-white mt-3" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {BUSINESS.reviews}+ verified reviews
            </p>
            <a
              href={BUSINESS.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors duration-200 underline"
            >
              Read them on Google Maps
            </a>
          </div>
        </div>

        {/* Review Cards */}
        {getReviews(BUSINESS).map((review, i) => (
          <div
            key={review.name}
            className={`rounded-xl md:rounded-2xl p-5 md:p-7 flex flex-col justify-between min-h-[220px] ${
              review.featured
                ? 'md:col-span-2 bg-zinc-200'
                : 'bg-stone-50'
            }`}
            style={reveal.getAnimStyle(i + 2)}
          >
            <div>
              <Stars className="text-black" />
              <p
                className={`mt-4 font-medium text-black leading-5 md:leading-6 ${
                  review.featured
                    ? 'text-sm md:text-lg'
                    : 'text-xs md:text-sm'
                }`}
              >
                "{review.text}"
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-black/10 flex items-end justify-between gap-3">
              <div>
                <p className="text-base md:text-xl font-bold text-black leading-tight">
                  {review.name}
                </p>
                <p className="text-xs font-medium text-neutral-500 mt-0.5">
                  {review.treatment} · {review.date}
                </p>
              </div>
              <span className="w-9 h-9 md:w-11 md:h-11 shrink-0 rounded-full bg-black text-white flex items-center justify-center text-sm md:text-base font-bold">
                {review.name.charAt(0)}
              </span>
            </div>
          </div>
        ))}

        {/* CTA Card */}
        <div
          className="md:col-span-3 rounded-xl md:rounded-2xl bg-black p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-h-[150px]"
          style={reveal.getAnimStyle(9)}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-7 md:leading-9">
              Ready to join them?
            </h2>
            <p className="text-sm text-neutral-400 mt-1.5 md:mt-2">
              Book your visit with {BUSINESS.doctor} today.
            </p>
          </div>
          <a
            href="/book"
            className="px-6 py-3.5 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform shrink-0"
          >
            Book Appointment
          </a>
        </div>
      </div>
    </section>
  );
}
