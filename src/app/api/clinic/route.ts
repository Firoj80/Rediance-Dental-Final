import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const clinic = await db.clinic.findFirst({
      include: {
        settings: {
          select: {
            id: true,
            clinicId: true,
            doctorName: true,
            doctorQualification: true,
            doctorExperience: true,
            doctorBio: true,
            doctorPhoto: true,
            doctorSpecializations: true,
            defaultSlotDuration: true,
            bookingAdvanceDays: true,
            statYears: true,
            statPatients: true,
            statServices: true,
            statRating: true,
            homeSeoTitle: true,
            homeSeoDescription: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    return NextResponse.json(clinic)
  } catch (error) {
    console.error('Error fetching clinic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
