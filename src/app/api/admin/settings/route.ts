import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(_request: Request) {
  try {
    requireAuth(_request)

    const settings = await db.clinicSettings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    // Mask the admin password
    const { adminPassword, ...rest } = settings
    return NextResponse.json({
      ...rest,
      adminPassword: adminPassword ? '********' : null,
    })
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    requireAuth(request)

    const body = await request.json()

    const settings = await db.clinicSettings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = { ...body }

    // Hash new password if provided
    if (body.adminPassword && body.adminPassword !== '********') {
      updateData.adminPassword = await bcrypt.hash(body.adminPassword, 10)
    } else {
      delete updateData.adminPassword
    }

    const updated = await db.clinicSettings.update({
      where: { id: settings.id },
      data: updateData,
    })

    // Mask password in response
    const { adminPassword, ...rest } = updated
    return NextResponse.json({
      ...rest,
      adminPassword: adminPassword ? '********' : null,
    })
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
