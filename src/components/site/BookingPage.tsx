'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  User,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useSiteStore, type ServiceData } from '@/lib/store'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface SlotData {
  time: string
  available: boolean
}

const STEP_LABELS = ['Service', 'Date', 'Time', 'Details', 'Confirm']

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              i < currentStep
                ? 'bg-primary text-white'
                : i === currentStep
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border bg-white text-foreground">
              {i < currentStep ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={cn('w-6 h-0.5', i < currentStep ? 'bg-primary' : 'bg-muted')} />
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

  // Fetch blocked dates and advance days on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const [blockedRes, clinicRes] = await Promise.all([
          fetch('/api/blocked-dates'),
          fetch('/api/clinic'),
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
      const dateStr = selectedDate.toISOString().split('T')[0]
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
          appointmentDate: selectedDate.toISOString().split('T')[0],
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

  // Render service selection
  const renderStepService = () => (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">Select a Service</h3>
      <p className="text-sm text-muted-foreground mb-6">Choose the service you&apos;d like to book.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service)}
            className={cn(
              'p-4 rounded-xl border text-left transition-all',
              selectedService?.id === service.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border hover:border-primary/30 hover:bg-muted/50'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                selectedService?.id === service.id ? 'bg-primary text-white' : 'bg-muted'
              )}>
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm">{service.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{service.duration} min</span>
                  {service.price != null && <span>• ₹{service.price}</span>}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {formErrors.service && (
        <p className="text-sm text-destructive mt-3 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.service}
        </p>
      )}
    </div>
  )

  // Render date selection
  const renderStepDate = () => (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">Select a Date</h3>
      <p className="text-sm text-muted-foreground mb-6">Choose your preferred appointment date.</p>

      <div className="flex justify-center">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date)
            setSelectedTime('')
          }}
          disabled={[
            { before: new Date(new Date().setHours(0, 0, 0, 0)) },
            { dayOfWeek: [0] },
            ...blockedDates,
          ]}
          toDate={maxDate}
          className="rounded-xl border"
        />
      </div>

      {selectedDate && (
        <p className="text-sm text-center text-muted-foreground mt-4">
          Selected: {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}

      {formErrors.date && (
        <p className="text-sm text-destructive mt-3 flex items-center gap-1 justify-center">
          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.date}
        </p>
      )}
    </div>
  )

  // Render time selection
  const renderStepTime = () => (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">Select a Time</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Available time slots for {selectedDate?.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
        {selectedService && ` (${selectedService.name})`}
      </p>

      {slotsLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-11 rounded-lg" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No available slots for this date.</p>
          <p className="text-xs text-muted-foreground mt-1">Please select a different date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => setSelectedTime(slot.time)}
              className={cn(
                'h-11 rounded-lg text-sm font-medium transition-all',
                !slot.available
                  ? 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed line-through'
                  : selectedTime === slot.time
                  ? 'bg-primary text-white ring-1 ring-primary/20'
                  : 'bg-muted hover:bg-primary/10 hover:text-primary text-foreground'
              )}
            >
              {formatTime(slot.time)}
            </button>
          ))}
        </div>
      )}

      {formErrors.time && (
        <p className="text-sm text-destructive mt-3 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.time}
        </p>
      )}
    </div>
  )

  // Render patient info
  const renderStepDetails = () => (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">Your Details</h3>
      <p className="text-sm text-muted-foreground mb-6">Please provide your contact information.</p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="bk-name" className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Full Name *
          </Label>
          <Input
            id="bk-name"
            value={patientInfo.name}
            onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
            placeholder="Your full name"
            className={formErrors.name ? 'border-destructive' : ''}
          />
          {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
        </div>
        <div>
          <Label htmlFor="bk-phone" className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Phone Number *
          </Label>
          <Input
            id="bk-phone"
            type="tel"
            value={patientInfo.phone}
            onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
            placeholder="Your phone number"
            className={formErrors.phone ? 'border-destructive' : ''}
          />
          {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
        </div>
        <div>
          <Label htmlFor="bk-email" className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> Email (Optional)
          </Label>
          <Input
            id="bk-email"
            type="email"
            value={patientInfo.email}
            onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
            placeholder="Your email address"
          />
        </div>
        <div>
          <Label htmlFor="bk-message" className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Message (Optional)
          </Label>
          <Textarea
            id="bk-message"
            value={patientInfo.message}
            onChange={(e) => setPatientInfo({ ...patientInfo, message: e.target.value })}
            placeholder="Any specific concerns or notes"
            rows={3}
          />
        </div>
      </div>
    </div>
  )

  // Render confirmation
  const renderStepConfirm = () => (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">Review & Confirm</h3>
      <p className="text-sm text-muted-foreground mb-6">Please verify your appointment details.</p>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-muted/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Service</p>
              <p className="font-medium text-foreground text-sm">{selectedService?.name}</p>
              <p className="text-xs text-muted-foreground">{selectedService?.duration} min {selectedService?.price != null ? `• ₹${selectedService.price}` : ''}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
              <p className="font-medium text-foreground text-sm">
                {selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-muted-foreground">{selectedTime ? formatTime(selectedTime) : ''}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Patient Name</p>
              <p className="font-medium text-foreground text-sm">{patientInfo.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Phone</p>
              <p className="font-medium text-foreground text-sm">{patientInfo.phone}</p>
              {patientInfo.email && <p className="text-xs text-muted-foreground">{patientInfo.email}</p>}
            </div>
          </div>
          {patientInfo.message && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <p className="text-sm text-foreground">{patientInfo.message}</p>
            </div>
          )}
        </div>

        {bookingResult && !bookingResult.success && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {bookingResult.error}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // Render success
  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Appointment Booked!</h2>
      <p className="text-muted-foreground mb-2">Your appointment has been successfully scheduled.</p>
      {bookingResult?.id && (
        <p className="text-sm text-muted-foreground mb-6">
          Booking ID: <span className="font-mono font-medium text-foreground">{bookingResult.id}</span>
        </p>
      )}
      <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
        You can reach us at {clinicData?.phone || 'our clinic phone'} for any changes or queries.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" onClick={resetBooking}>
          Book Another
        </Button>
        <Button
          onClick={() => { window.location.hash = '#/' }}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Back to Home
        </Button>
      </div>
    </div>
  )

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Book an Appointment</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Schedule your visit in just a few steps.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentStep < 5 ? (
            <Card>
              <CardContent className="pt-6">
                <StepIndicator currentStep={currentStep} />

                {renderStepByStep()}

                <Separator className="my-6" />

                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  {currentStep < 4 ? (
                    <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white">
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleConfirm}
                      disabled={submitting}
                      className="bg-primary hover:bg-primary/90 text-white"
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
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
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
