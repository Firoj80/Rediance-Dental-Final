import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const serviceCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  duration: z.number().int().min(5).default(30),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
})

const serviceUpdateSchema = serviceCreateSchema.partial().omit({ slug: true })

export async function GET(_request: Request) {
  try {
    requireAuth(_request)

    const services = await db.service.findMany({
      orderBy: { displayOrder: 'asc' },
    })
    return NextResponse.json(services)
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error fetching admin services:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    requireAuth(request)

    const body = await request.json()
    const parsed = serviceCreateSchema.safeParse(body)

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

    const service = await db.service.create({
      data: {
        clinicId: clinic.id,
        ...parsed.data,
        shortDescription: parsed.data.shortDescription ?? undefined,
        fullDescription: parsed.data.fullDescription ?? undefined,
        image: parsed.data.image ?? undefined,
        price: parsed.data.price ?? undefined,
        seoTitle: parsed.data.seoTitle ?? undefined,
        seoDescription: parsed.data.seoDescription ?? undefined,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    requireAuth(request)

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 })
    }

    const { id, ...updateData } = body
    const parsed = serviceUpdateSchema.safeParse(updateData)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const service = await db.service.update({
      where: { id },
      data: {
        ...parsed.data,
        shortDescription: parsed.data.shortDescription ?? undefined,
        fullDescription: parsed.data.fullDescription ?? undefined,
        image: parsed.data.image ?? undefined,
        price: parsed.data.price ?? undefined,
        seoTitle: parsed.data.seoTitle ?? undefined,
        seoDescription: parsed.data.seoDescription ?? undefined,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
