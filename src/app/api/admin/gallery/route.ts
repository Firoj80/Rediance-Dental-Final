import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth } from '@/lib/auth'
import { z } from 'zod'

const galleryCreateSchema = z.object({
  title: z.string().optional().nullable(),
  image: z.string().min(1, 'Image URL is required'),
  category: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
})

const galleryUpdateSchema = galleryCreateSchema.partial()

export async function GET(request: Request) {
  try {
    const authError = await checkAuth(request)
    if (authError) return authError

    const images = await db.galleryImage.findMany({
      orderBy: { displayOrder: 'asc' },
    })
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching admin gallery:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authError = await checkAuth(request)
    if (authError) return authError

    const body = await request.json()
    const parsed = galleryCreateSchema.safeParse(body)

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

    const image = await db.galleryImage.create({
      data: {
        clinicId: clinic.id,
        ...parsed.data,
        title: parsed.data.title ?? undefined,
        category: parsed.data.category ?? undefined,
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authError = await checkAuth(request)
    if (authError) return authError

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Gallery image ID is required' }, { status: 400 })
    }

    const { id, ...updateData } = body
    const parsed = galleryUpdateSchema.safeParse(updateData)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const image = await db.galleryImage.update({
      where: { id },
      data: {
        ...parsed.data,
        title: parsed.data.title ?? undefined,
        category: parsed.data.category ?? undefined,
      },
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error('Error updating gallery image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
