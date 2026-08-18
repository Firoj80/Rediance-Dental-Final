import { useState } from 'react';
import {
  LocationIcon,
  PhoneIcon,
  ClockIcon,
  useStaggeredReveal,
} from '../shared';
import { useClinic } from '../context/ClinicContext';
import { bookAppointment } from '../lib/api';

const TREATMENTS = [
  'General Checkup',
  'Dental Veneers',
  'Dental Crowns',
  'Teeth Whitening',
  'Dental Implants',
  'Orthodontics',
  'Root Canal Therapy',
  'Facial Trauma Care',
  'Gum Treatment',
];

const TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

const inputClass =
  'w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors duration-200';

/** Next 14 days, excluding Sundays (clinic closed). */
function getAvailableDays() {
  const days = [];
  const today = new Date();
  for (let i = 1; days.length < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue; // Sunday closed
    days.push(d);
  }
  return days;
}

export function BookPage() {
  const { clinicData: BUSINESS } = useClinic();
  const reveal = useStaggeredReveal(4);
  const days = getAvailableDays();

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    treatment: TREATMENTS[0],
    notes: '',
  });
  const [selectedDay, setSelectedDay] = useState<string>(
    days[0].toISOString()
  );
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[0]);

  const update =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const chosenDate = new Date(selectedDay);
  const prettyDate = chosenDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <section
      ref={reveal.containerRef}
      className="min-h-screen w-full flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2">
        {/* Header */}
        <div
          className="md:col-span-3 rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4 min-h-[190px]"
          style={reveal.getAnimStyle(0)}
        >
          <div>
            <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
              Reserve your visit
            </p>
            <h1 className="text-[clamp(2.75rem,7.5vw,7rem)] font-bold leading-[0.95] tracking-tight text-black">
              Book an
              <br />
              Appointment
            </h1>
          </div>
          <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5 max-w-[250px] md:text-right">
            Choose a date and time that suits you. We confirm every booking by
            phone within a few hours.
          </p>
        </div>

        {/* Booking form */}
        <div
          className="md:col-span-2 rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7"
          style={reveal.getAnimStyle(1)}
        >
          {submitted ? (
            <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center">
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
              <h3 className="text-2xl md:text-3xl font-bold text-black">
                Appointment requested
              </h3>
              <div className="bg-white rounded-xl px-5 py-4 mt-1">
                <p className="text-sm font-bold text-black">{prettyDate}</p>
                <p className="text-sm font-medium text-black mt-0.5">
                  {selectedTime} · {form.treatment}
                </p>
              </div>
              <p className="text-xs md:text-sm font-medium text-neutral-600 leading-4 md:leading-5 max-w-[320px] mt-1">
                Thank you{form.name ? `, ${form.name}` : ''}. Our team will call
                you on {form.phone || 'your number'} shortly to confirm.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-6 py-3 border border-black rounded-full text-sm font-semibold text-black hover:bg-black hover:text-white transition-colors duration-200"
              >
                Book another appointment
              </button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // Convert time to 24-hour HH:mm
                  const [time, period] = selectedTime.split(' ');
                  let [hours, minutes] = time.split(':');
                  let hoursNum = parseInt(hours, 10);
                  if (period === 'PM' && hoursNum !== 12) hoursNum += 12;
                  if (period === 'AM' && hoursNum === 12) hoursNum = 0;
                  const formattedTime = `${hoursNum.toString().padStart(2, '0')}:${minutes}`;

                  await bookAppointment({
                    patientName: form.name,
                    patientPhone: form.phone,
                    patientEmail: form.email,
                    patientMessage: `Treatment: ${form.treatment}${form.notes ? `\n\nNotes: ${form.notes}` : ''}`,
                    appointmentDate: new Date(selectedDay).toISOString().split('T')[0],
                    appointmentTime: formattedTime,
                  });
                  setSubmitted(true);
                } catch (err: any) {
                  console.error(err);
                  alert(err.message || 'Failed to book appointment. Please try again.');
                }
              }}
              className="flex flex-col gap-5"
            >
              {/* Step 1 — Date */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-black mb-3">
                  1 · Choose a date
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {days.map((d) => {
                    const iso = d.toISOString();
                    const active = iso === selectedDay;
                    return (
                      <button
                        type="button"
                        key={iso}
                        onClick={() => setSelectedDay(iso)}
                        className={`shrink-0 w-16 md:w-18 rounded-xl px-3 py-3 flex flex-col items-center gap-1 border transition-colors duration-200 ${
                          active
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-neutral-200 hover:border-black'
                        }`}
                      >
                        <span className="text-[10px] font-semibold uppercase opacity-70">
                          {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </span>
                        <span className="text-xl font-bold leading-none">
                          {d.getDate()}
                        </span>
                        <span className="text-[10px] font-medium opacity-70">
                          {d.toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] font-medium text-neutral-500 mt-1">
                  Closed on Sundays.
                </p>
              </div>

              {/* Step 2 — Time */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-black mb-3">
                  2 · Pick a time slot
                </p>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const active = slot === selectedTime;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold border transition-colors duration-200 ${
                          active
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-neutral-200 hover:border-black'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3 — Details */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-black mb-3">
                  3 · Your details
                </p>
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-black mb-1.5">
                        Full Name
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-black mb-1.5">
                        Mobile Number
                      </label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={update('phone')}
                        placeholder="+91 98765 43210"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-black mb-1.5">
                        Email <span className="font-normal text-neutral-400">(optional)</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={update('email')}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-black mb-1.5">
                        Treatment
                      </label>
                      <select
                        value={form.treatment}
                        onChange={update('treatment')}
                        className={inputClass}
                      >
                        {TREATMENTS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black mb-1.5">
                      Notes <span className="font-normal text-neutral-400">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={update('notes')}
                      placeholder="Any symptoms or details we should know about..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Summary + submit */}
              <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border border-neutral-200">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    Your selection
                  </p>
                  <p className="text-sm font-bold text-black mt-1">
                    {prettyDate} · {selectedTime}
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-black rounded-full text-white text-sm md:text-base font-bold hover:bg-neutral-800 transition-colors duration-200 shrink-0"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-1.5 md:gap-2">
          <div
            className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-6"
            style={reveal.getAnimStyle(2)}
          >
            <h3 className="text-lg md:text-xl font-bold text-black mb-4">
              Clinic details
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
              <div className="flex items-start gap-3">
                <span className="text-black mt-0.5">
                  <ClockIcon />
                </span>
                <div className="space-y-1 flex-1">
                  {BUSINESS.hours.map((h) => (
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

          {/* Emergency */}
          <div
            className="rounded-xl md:rounded-2xl bg-black p-5 md:p-6 flex-1 flex flex-col justify-between gap-4 min-h-[180px]"
            style={reveal.getAnimStyle(3)}
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                Need urgent care?
              </h3>
              <p className="text-xs md:text-sm text-neutral-400 mt-2 leading-4 md:leading-5">
                Facial injuries and severe dental pain are treated with
                priority — skip the form and call us directly.
              </p>
            </div>
            <a
              href={`tel:${BUSINESS.phone}`}
              className="w-full px-5 py-4 bg-white rounded-full text-black text-sm md:text-base font-bold text-center hover:scale-105 transition-transform"
            >
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
