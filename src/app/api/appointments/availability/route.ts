import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const totalMins = h * 60 + m + minutes
  const newH = Math.floor(totalMins / 60)
  const newM = totalMins % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!date || !dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Valid date param (YYYY-MM-DD) is required' },
        { status: 400 },
      )
    }

    const clinic = await db.clinic.findFirst()
    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not configured' }, { status: 500 })
    }

    // Check blocked dates
    const blocked = await db.blockedDate.findFirst({
      where: { clinicId: clinic.id, date },
    })
    if (blocked) {
      return NextResponse.json([])
    }

    // Check if date is in the past (string comparison works for YYYY-MM-DD, timezone-safe)
    const todayStr = new Date().toISOString().slice(0, 10)
    if (date < todayStr) {
      return NextResponse.json([])
    }

    // Get day of week (0=Monday, 6=Sunday) from the date string
    const selectedDate = new Date(date + 'T00:00:00')
    const jsDay = selectedDate.getDay()
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1

    // Get working hours for the day
    const workingHour = await db.workingHour.findFirst({
      where: { clinicId: clinic.id, dayOfWeek, enabled: true },
      include: { sessions: true },
    })

    if (!workingHour || workingHour.sessions.length === 0) {
      return NextResponse.json([])
    }

    // Get slot duration
    let slotDuration = 30
    if (serviceId) {
      const service = await db.service.findUnique({ where: { id: serviceId } })
      if (service) {
        slotDuration = service.duration
      }
    } else {
      const settings = await db.clinicSettings.findFirst({
        where: { clinicId: clinic.id },
      })
      if (settings) {
        slotDuration = settings.defaultSlotDuration
      }
    }

    // Get existing appointments for the date
    const existingAppointments = await db.appointment.findMany({
      where: {
        clinicId: clinic.id,
        appointmentDate: date,
        status: { notIn: ['Cancelled', 'No Show'] },
      },
      select: { appointmentTime: true },
    })
    const bookedTimes = new Set(existingAppointments.map((a) => a.appointmentTime))

    // Generate slots from each session
    const slots: { time: string; available: boolean }[] = []

    for (const session of workingHour.sessions) {
      let current = session.startTime
      const endMins = timeToMinutes(session.endTime)

      while (timeToMinutes(current) < endMins) {
        // Only add slots that fit within the session
        if (timeToMinutes(addMinutes(current, slotDuration)) <= endMins) {
          slots.push({
            time: current,
            available: !bookedTimes.has(current),
          })
        }
        current = addMinutes(current, slotDuration)
      }
    }

    return NextResponse.json(slots)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
