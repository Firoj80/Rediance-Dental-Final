import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const images = await db.galleryImage.findMany({
      where: {
        visible: true,
        ...(category ? { category } : {}),
      },
      orderBy: { displayOrder: 'asc' },
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
