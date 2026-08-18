import { useState } from 'react';
import {
  useStaggeredReveal,
  LocationIcon,
  PhoneIcon,
  StarIcon,
  ClockIcon,
} from '../shared';
import { useClinic } from '../context/ClinicContext';

const SERVICE_OPTIONS = [
  'General Checkup',
  'Dental Veneers',
  'Dental Crowns',
  'Teeth Whitening',
  'Dental Implants',
  'Orthodontics',
  'Emergency',
];


const inputClass =
  'w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors duration-200';

export function ContactPage() {
  const reveal = useStaggeredReveal(5);
  const { clinicData: BUSINESS } = useClinic();
  const HOURS = BUSINESS.hours;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: SERVICE_OPTIONS[0],
    message: '',
  });

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <section
      ref={reveal.containerRef}
      className="min-h-screen w-full flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
        {/* Header Card */}
        <div
          className="md:col-span-2 rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4 min-h-[190px]"
          style={reveal.getAnimStyle(0)}
        >
          <div>
            <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
              Get in touch
            </p>
            <h1 className="text-[clamp(3rem,8vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-black">
              Contact
              <br />
              Us
            </h1>
          </div>
          <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5 max-w-[240px] md:text-right">
            Book an appointment, ask a question or drop by — we'd love to hear
            from you.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 min-h-[400px]"
          style={reveal.getAnimStyle(1)}
        >
          {submitted ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-full border border-black flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-black">
                Thank you{form.name ? `, ${form.name}` : ''}!
              </h3>
              <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5 max-w-[260px]">
                Your request has been received. We'll get back to you within 24
                hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-6 py-3 border border-black rounded-full text-sm font-semibold text-black hover:bg-black hover:text-white transition-colors duration-200"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="flex flex-col gap-3 md:gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-black mb-1.5">
                    Full Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Jane Cooper"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1.5">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="jane@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-black mb-1.5">
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1.5">
                    Service
                  </label>
                  <select
                    value={form.service}
                    onChange={update('service')}
                    className={inputClass}
                  >
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us about your visit..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="mt-1 px-8 py-4 bg-black rounded-full text-white text-sm md:text-base font-bold hover:bg-neutral-800 transition-colors duration-200"
              >
                Book Appointment
              </button>
            </form>
          )}
        </div>

        {/* Info + Map Column */}
        <div className="flex flex-col gap-1.5 md:gap-2 min-h-[400px]">
          <div
            className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-6 flex-1"
            style={reveal.getAnimStyle(2)}
          >
            <h3 className="text-lg md:text-xl font-bold text-black mb-4">
              Visit our clinic
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <span className="text-black mt-0.5">
                  <LocationIcon />
                </span>
                <p className="text-xs md:text-sm font-medium text-black leading-4">
                  {BUSINESS.addressLine1}
                  <br />
                  {BUSINESS.addressLine2}
                  <br />
                  {BUSINESS.addressLine3}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-black">
                  <PhoneIcon />
                </span>
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="text-xs md:text-sm font-medium text-black hover:underline"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-black">
                  <StarIcon />
                </span>
                <a
                  href={BUSINESS.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm font-medium text-black hover:underline"
                >
                  {BUSINESS.rating} · {BUSINESS.reviews} patient reviews
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-black mt-0.5">
                  <ClockIcon />
                </span>
                <div className="space-y-1 flex-1">
                  {HOURS.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between gap-3 text-xs md:text-sm font-medium text-black"
                    >
                      <span>{h.day}</span>
                      <span>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl md:rounded-2xl overflow-hidden h-56 md:flex-1 md:min-h-[200px] bg-neutral-200"
            style={reveal.getAnimStyle(3)}
          >
            <iframe
              title="Dental Health Location"
              src={BUSINESS.mapEmbed}
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Emergency CTA */}
        <div
          className="md:col-span-2 rounded-xl md:rounded-2xl bg-black p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-h-[150px]"
          style={reveal.getAnimStyle(4)}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-7 md:leading-9">
              Dental or Facial Trauma Emergency?
            </h2>
            <p className="text-sm text-neutral-400 mt-1.5 md:mt-2">
              In pain right now? Facial injuries and dental trauma are treated
              with priority — call us today.
            </p>
          </div>
          <a
            href={`tel:${BUSINESS.phone}`}
            className="px-6 py-3.5 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform shrink-0 whitespace-nowrap"
          >
            Call {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
