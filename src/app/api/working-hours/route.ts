import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const workingHourSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  enabled: z.boolean(),
  sessions: z.array(
    z.object({
      id: z.string().optional(),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
    }),
  ),
})

export async function GET() {
  try {
    const workingHours = await db.workingHour.findMany({
      orderBy: { dayOfWeek: 'asc' },
      include: { sessions: { orderBy: { startTime: 'asc' } } },
    })
    return NextResponse.json(workingHours)
  } catch (error) {
    console.error('Error fetching working hours:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    requireAuth(request)

    const body = await request.json()
    const parsed = z.array(workingHourSchema).safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const clinic = await db.clinic.findFirst()
    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    // Use a transaction to replace all working hours
    const result = await db.$transaction(async (tx) => {
      // Delete all existing working hours (cascade deletes sessions)
      await tx.workingHour.deleteMany({ where: { clinicId: clinic.id } })

      // Create new working hours with sessions
      for (const wh of parsed.data) {
        await tx.workingHour.create({
          data: {
            clinicId: clinic.id,
            dayOfWeek: wh.dayOfWeek,
            enabled: wh.enabled,
            sessions: {
              create: wh.sessions.map((s) => ({
                startTime: s.startTime,
                endTime: s.endTime,
              })),
            },
          },
        })
      }
    })

    // Fetch all updated working hours
    const workingHours = await db.workingHour.findMany({
      where: { clinicId: clinic.id },
      orderBy: { dayOfWeek: 'asc' },
      include: { sessions: { orderBy: { startTime: 'asc' } } },
    })

    return NextResponse.json(workingHours)
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error updating working hours:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
