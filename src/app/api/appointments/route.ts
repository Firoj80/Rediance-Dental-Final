import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createAppointmentSchema = z.object({
  patientName: z.string().min(1, 'Name is required'),
  patientPhone: z.string().min(1, 'Phone is required'),
  patientEmail: z.string().email().optional().or(z.literal('')),
  patientMessage: z.string().optional(),
  serviceId: z.string().optional(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:mm'),
})

export async function GET() {
  try {
    const appointments = await db.appointment.findMany({
      orderBy: [{ appointmentDate: 'desc' }, { appointmentTime: 'asc' }],
      include: { service: { select: { name: true } } },
    })
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createAppointmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Check date is not in the past
    const today = new Date().toISOString().split('T')[0]
    if (data.appointmentDate < today) {
      return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 })
    }

    // Get clinic
    const clinic = await db.clinic.findFirst()
    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not configured' }, { status: 500 })
    }

    // Check blocked dates
    const blocked = await db.blockedDate.findFirst({
      where: { clinicId: clinic.id, date: data.appointmentDate },
    })
    if (blocked) {
      return NextResponse.json(
        { error: 'This date is not available for booking' },
        { status: 400 }
      )
    }

    // Check working hours for the day of week
    const dateObj = new Date(data.appointmentDate + 'T00:00:00')
    const dayOfWeek = dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1 // 0=Mon, 6=Sun

    const workingHour = await db.workingHour.findFirst({
      where: { clinicId: clinic.id, dayOfWeek, enabled: true },
      include: { sessions: true },
    })

    if (!workingHour || workingHour.sessions.length === 0) {
      return NextResponse.json(
        { error: 'Clinic is closed on this day' },
        { status: 400 }
      )
    }

    // Check if requested time falls within a working session
    const timeInSession = workingHour.sessions.some(
      (s) => data.appointmentTime >= s.startTime && data.appointmentTime < s.endTime
    )
    if (!timeInSession) {
      return NextResponse.json(
        { error: 'Requested time is outside working hours' },
        { status: 400 }
      )
    }

    // Check service exists if provided
    if (data.serviceId) {
      const service = await db.service.findFirst({
        where: { id: data.serviceId, active: true },
      })
      if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 400 })
      }
    }

    // Check for existing appointment at same date+time
    const existing = await db.appointment.findFirst({
      where: {
        clinicId: clinic.id,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        status: { notIn: ['Cancelled', 'No Show'] },
      },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      )
    }

    const appointment = await db.appointment.create({
      data: {
        clinicId: clinic.id,
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        patientEmail: data.patientEmail || null,
        patientMessage: data.patientMessage || null,
        serviceId: data.serviceId || null,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        status: 'Pending',
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
