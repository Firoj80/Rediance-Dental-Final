import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth } from '@/lib/auth'
import { z } from 'zod'

const testimonialCreateSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  review: z.string().min(1, 'Review is required'),
  rating: z.number().int().min(1).max(5).default(5),
  photo: z.string().optional().nullable(),
  published: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
})

const testimonialUpdateSchema = testimonialCreateSchema.partial()

export async function GET(request: Request) {
  try {
    const authError = await checkAuth(request)
    if (authError) return authError

    const testimonials = await db.testimonial.findMany({
      orderBy: { displayOrder: 'asc' },
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching admin testimonials:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authError = await checkAuth(request)
    if (authError) return authError

    const body = await request.json()
    const parsed = testimonialCreateSchema.safeParse(body)

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

    const testimonial = await db.testimonial.create({
      data: {
        clinicId: clinic.id,
        ...parsed.data,
        photo: parsed.data.photo ?? undefined,
      },
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authError = await checkAuth(request)
    if (authError) return authError

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 })
    }

    const { id, ...updateData } = body
    const parsed = testimonialUpdateSchema.safeParse(updateData)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        ...parsed.data,
        photo: parsed.data.photo ?? undefined,
      },
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
