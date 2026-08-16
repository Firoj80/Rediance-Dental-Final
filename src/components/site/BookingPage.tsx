'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Stethoscope,
  User,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useSiteStore, type ServiceData } from '@/lib/store'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

/** Format a Date to YYYY-MM-DD using local timezone (avoids UTC shift from toISOString) */
function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

interface SlotData {
  time: string
  available: boolean
}

const STEP_LABELS = ['Service', 'Date', 'Time', 'Details', 'Confirm']

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300',
              i < currentStep
                ? 'bg-emerald-700 text-white'
                : i === currentStep
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-50 text-slate-400'
            )}
          >
            <span className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center text-[10px] border transition-all duration-300',
              i < currentStep
                ? 'bg-emerald-600 text-white border-emerald-600'
                : i === currentStep
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-white text-slate-400 border-slate-200'
            )}>
              {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={cn('w-6 sm:w-10 h-px transition-colors duration-300', i < currentStep ? 'bg-emerald-700' : 'bg-slate-200')} />
          )}
        </div>
      ))}
    </div>
  )
}

export function BookingPage() {
  const services = useSiteStore((s) => s.services)
  const clinicData = useSiteStore((s) => s.clinicData)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [slots, setSlots] = useState<SlotData[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  const [offDays, setOffDays] = useState<number[]>([]) // JS day numbers (0=Sun, 6=Sat) that are weekly off
  const [bookingAdvanceDays, setBookingAdvanceDays] = useState(30)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<{ success: boolean; id?: string; error?: string } | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Fetch blocked dates, working hours, and advance days on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const [blockedRes, clinicRes, hoursRes] = await Promise.all([
          fetch('/api/blocked-dates'),
          fetch('/api/clinic'),
          fetch('/api/working-hours'),
        ])
        if (blockedRes.ok) {
          const blocked = await blockedRes.json()
          setBlockedDates(blocked.map((d: { date: string }) => new Date(d.date + 'T00:00:00')))
        }
        if (clinicRes.ok) {
          const clinic = await clinicRes.json()
          const settings = clinic.settings?.[0]
          if (settings) {
            setBookingAdvanceDays(settings.bookingAdvanceDays || 30)
          }
        }
        if (hoursRes.ok) {
          const hours = await hoursRes.json()
          // Convert DB dayOfWeek (0=Mon..6=Sun) to JS day (0=Sun..6=Sat)
          // and collect disabled days
          const disabled: number[] = []
          for (const wh of hours) {
            if (!wh.enabled) {
              // DB 0=Mon -> JS 1, DB 6=Sun -> JS 0
              const jsDay = wh.dayOfWeek === 6 ? 0 : wh.dayOfWeek + 1
              disabled.push(jsDay)
            }
          }
          setOffDays(disabled)
        }
      } catch {
        // silent fail
      }
    }
    fetchConfig()
  }, [])

  // Fetch time slots when date or service changes
  const fetchSlots = useCallback(async () => {
    if (!selectedDate) return
    setSlotsLoading(true)
    setSelectedTime('')
    try {
      const dateStr = toLocalDateString(selectedDate)
      const params = new URLSearchParams({ date: dateStr })
      if (selectedService) {
        params.set('serviceId', selectedService.id)
      }
      const res = await fetch(`/api/appointments/availability?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSlots(data)
      } else {
        setSlots([])
      }
    } catch {
      setSlots([])
    } finally {
      setSlotsLoading(false)
    }
  }, [selectedDate, selectedService])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  // Calendar props
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + bookingAdvanceDays)

  const handleNext = () => {
    setFormErrors({})
    if (currentStep === 0 && !selectedService) {
      setFormErrors({ service: 'Please select a service' })
      return
    }
    if (currentStep === 1 && !selectedDate) {
      setFormErrors({ date: 'Please select a date' })
      return
    }
    if (currentStep === 2 && !selectedTime) {
      setFormErrors({ time: 'Please select a time slot' })
      return
    }
    if (currentStep === 3) {
      if (!patientInfo.name.trim()) {
        setFormErrors({ name: 'Name is required' })
        return
      }
      if (!patientInfo.phone.trim()) {
        setFormErrors({ phone: 'Phone is required' })
        return
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setFormErrors({})
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return
    setSubmitting(true)
    setBookingResult(null)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          appointmentDate: toLocalDateString(selectedDate),
          appointmentTime: selectedTime,
          patientName: patientInfo.name,
          patientPhone: patientInfo.phone,
          patientEmail: patientInfo.email || '',
          patientMessage: patientInfo.message || '',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setBookingResult({ success: false, error: data.error || 'Failed to book appointment' })
        return
      }

      setBookingResult({ success: true, id: data.id })
      setCurrentStep(5)
    } catch {
      setBookingResult({ success: false, error: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const resetBooking = () => {
    setCurrentStep(0)
    setSelectedService(null)
    setSelectedDate(undefined)
    setSelectedTime('')
    setSlots([])
    setPatientInfo({ name: '', phone: '', email: '', message: '' })
    setBookingResult(null)
    setFormErrors({})
  }

  const inputClasses = 'w-full h-11 px-4 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors placeholder:text-slate-400'

  // Render service selection
  const renderStepService = () => (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Select a Service</h3>
      <p className="text-sm text-slate-500 mb-6">Choose the service you&apos;d like to book.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service)}
            className={cn(
              'rounded-xl border-2 p-4 cursor-pointer transition-all text-left',
              selectedService?.id === service.id
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/10'
                : 'border-slate-100 hover:border-emerald-300'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                selectedService?.id === service.id ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-400'
              )}>
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm">{service.name}</p>
                <p className="text-xs text-slate-400">{service.duration} min</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {formErrors.service && (
        <p className="text-sm text-red-500 mt-3 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.service}
        </p>
      )}
    </div>
  )

  // Render date selection
  const renderStepDate = () => (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Select a Date</h3>
      <p className="text-sm text-slate-500 mb-6">Choose your preferred appointment date.</p>

      <div className="flex justify-center">
        <div className="rounded-2xl border border-slate-200 p-3">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              setSelectedTime('')
            }}
            disabled={[
              { before: new Date(new Date().setHours(0, 0, 0, 0)) },
              ...(offDays.length > 0 ? [{ dayOfWeek: offDays }] : []),
              ...blockedDates,
            ]}
            toDate={maxDate}
            className="rounded-xl"
          />
        </div>
      </div>

      {selectedDate && (
        <p className="text-sm text-center text-slate-500 mt-4">
          Selected: {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}

      {formErrors.date && (
        <p className="text-sm text-red-500 mt-3 flex items-center gap-1 justify-center">
          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.date}
        </p>
      )}
    </div>
  )

  // Render time selection
  const renderStepTime = () => (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Select a Time</h3>
      <p className="text-sm text-slate-500 mb-6">
        Available slots for {selectedDate?.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
        {selectedService && ` (${selectedService.name})`}
      </p>

      {slotsLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-11 rounded-xl" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-10">
          <Clock className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No available slots for this date.</p>
          <p className="text-xs text-slate-400 mt-1">Please select a different date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => setSelectedTime(slot.time)}
              className={cn(
                'rounded-xl border p-3 text-center cursor-pointer transition-all text-sm',
                !slot.available
                  ? 'border-slate-100 line-through text-slate-300 cursor-not-allowed bg-slate-50'
                  : selectedTime === slot.time
                  ? 'border-emerald-500 bg-emerald-700 text-white shadow-sm shadow-emerald-700/15'
                  : 'border-slate-200 hover:border-emerald-300 text-slate-700 hover:bg-emerald-50/30'
              )}
            >
              {formatTime(slot.time)}
            </button>
          ))}
        </div>
      )}

      {formErrors.time && (
        <p className="text-sm text-red-500 mt-3 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.time}
        </p>
      )}
    </div>
  )

  // Render patient info
  const renderStepDetails = () => (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Your Details</h3>
      <p className="text-sm text-slate-500 mb-6">Please provide your contact information.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="bk-name" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
            <User className="w-3.5 h-3.5" /> Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="bk-name"
            type="text"
            value={patientInfo.name}
            onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
            placeholder="Your full name"
            className={cn(inputClasses, formErrors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : '')}
          />
          {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="bk-phone" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
            <Phone className="w-3.5 h-3.5" /> Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            id="bk-phone"
            type="tel"
            value={patientInfo.phone}
            onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
            placeholder="Your phone number"
            className={cn(inputClasses, formErrors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : '')}
          />
          {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
        </div>
        <div>
          <label htmlFor="bk-email" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
            <Mail className="w-3.5 h-3.5" /> Email (Optional)
          </label>
          <input
            id="bk-email"
            type="email"
            value={patientInfo.email}
            onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
            placeholder="Your email address"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="bk-message" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Message (Optional)
          </label>
          <textarea
            id="bk-message"
            value={patientInfo.message}
            onChange={(e) => setPatientInfo({ ...patientInfo, message: e.target.value })}
            placeholder="Any specific concerns or notes"
            rows={3}
            className={`${inputClasses} h-auto py-3 resize-none`}
          />
        </div>
      </div>
    </div>
  )

  // Render confirmation
  const renderStepConfirm = () => (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Review & Confirm</h3>
      <p className="text-sm text-slate-500 mb-6">Please verify your appointment details.</p>

      <div className="space-y-4">
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Service</p>
              <p className="font-medium text-slate-900 text-sm">{selectedService?.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{selectedService?.duration} min</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Date & Time</p>
              <p className="font-medium text-slate-900 text-sm">
                {selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{selectedTime ? formatTime(selectedTime) : ''}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Patient Name</p>
              <p className="font-medium text-slate-900 text-sm">{patientInfo.name}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Phone</p>
              <p className="font-medium text-slate-900 text-sm">{patientInfo.phone}</p>
              {patientInfo.email && <p className="text-xs text-slate-500 mt-0.5">{patientInfo.email}</p>}
            </div>
          </div>
          {patientInfo.message && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Message</p>
              <p className="text-sm text-slate-700">{patientInfo.message}</p>
            </div>
          )}
        </div>

        {bookingResult && !bookingResult.success && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {bookingResult.error}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // Render success
  const renderSuccess = () => (
    <div className="text-center py-10">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Appointment Booked!</h2>
      <p className="text-slate-500 mb-2">Your appointment has been successfully scheduled.</p>
      {bookingResult?.id && (
        <p className="text-sm text-slate-500 mb-8">
          Booking ID: <span className="font-mono font-medium text-slate-900">{bookingResult.id}</span>
        </p>
      )}
      <p className="text-sm text-slate-500 mb-10 max-w-sm mx-auto">
        You can reach us at {clinicData?.phone || 'our clinic phone'} for any changes or queries.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={resetBooking}
          className="border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
        >
          Book Another
        </button>
        <button
          onClick={() => { window.location.hash = '#/' }}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full px-8 py-2.5 text-sm transition-all shadow-lg shadow-emerald-700/15 hover:-translate-y-0.5"
        >
          Back to Home
        </button>
      </div>
    </div>
  )

  return (
    <div className="pt-20">
      {/* Compact Page Header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <span className="section-label text-emerald-600 mb-3 block">Book Appointment</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Schedule Your Visit
          </h1>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 lg:px-10">
          {currentStep < 5 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm shadow-slate-900/3">
              <StepIndicator currentStep={currentStep} />

              {renderStepByStep()}

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-full px-5 py-2.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-full px-6 py-2.5 shadow-sm shadow-emerald-700/15 transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-full px-6 py-2.5 shadow-sm shadow-emerald-700/15 transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Appointment
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            renderSuccess()
          )}
        </div>
      </section>
    </div>
  )

  function renderStepByStep() {
    switch (currentStep) {
      case 0: return renderStepService()
      case 1: return renderStepDate()
      case 2: return renderStepTime()
      case 3: return renderStepDetails()
      case 4: return renderStepConfirm()
      default: return null
    }
  }
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}
