import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSessionToken } from '@/lib/auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 },
      )
    }

    const settings = await db.clinicSettings.findFirst()
    if (!settings?.adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Admin not configured' },
        { status: 500 },
      )
    }

    const valid = await bcrypt.compare(parsed.data.password, settings.adminPassword)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
    }

    const token = await createSessionToken()

    // Set HTTP-Only Cookie
    const response = NextResponse.json({ success: true })
    
    // Cookie expires in 7 days
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires,
    })

    return response
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
