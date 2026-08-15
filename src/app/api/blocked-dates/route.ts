import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const blockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().optional(),
})

export async function GET() {
  try {
    const blockedDates = await db.blockedDate.findMany({
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(blockedDates)
  } catch (error) {
    console.error('Error fetching blocked dates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    requireAuth(request)

    const body = await request.json()
    const parsed = blockedDateSchema.safeParse(body)

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

    const blockedDate = await db.blockedDate.create({
      data: {
        clinicId: clinic.id,
        date: parsed.data.date,
        reason: parsed.data.reason || null,
      },
    })

    return NextResponse.json(blockedDate, { status: 201 })
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error creating blocked date:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    requireAuth(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await db.blockedDate.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error deleting blocked date:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
