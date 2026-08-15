import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const VALID_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'] as const

const updateStatusSchema = z.object({
  status: z.enum(VALID_STATUSES),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request)

    const { id } = await params
    const body = await request.json()
    const parsed = updateStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const appointment = await db.appointment.update({
      where: { id },
      data: { status: parsed.data.status },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
