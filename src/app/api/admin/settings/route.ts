import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAuth } from '@/lib/auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Fields that belong to the Clinic model (not ClinicSettings)
const CLINIC_FIELDS = ['name', 'tagline', 'description', 'logo', 'favicon', 'phone', 'email', 'whatsapp', 'address', 'googleMapsUrl', 'facebook', 'instagram', 'youtube'] as const

type ClinicField = (typeof CLINIC_FIELDS)[number]

const clinicUpdateSchema = z.object({
  name: z.string().optional(),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  favicon: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  googleMapsUrl: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  youtube: z.string().nullable().optional(),
})

/**
 * Extract a URL from a Google Maps embed <iframe> HTML snippet,
 * or return the string as-is if it's already a plain URL.
 */
function extractMapUrl(input: string): string {
  if (!input) return input
  const match = input.match(/src="([^"]+)"/)
  if (match) return match[1]
  return input.trim()
}

/**
 * Resolve short Google Maps URLs (maps.app.goo.gl, goo.gl/maps)
 * by following redirects to get the full URL with coordinates.
 */
async function resolveMapUrl(url: string): Promise<string> {
  url = extractMapUrl(url)
  if (!url) return url
  if (url.includes('/maps/embed') || url.includes('output=embed')) return url

  let finalUrl = url;

  // Follow redirect for short URLs
  if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(8000),
      })
      finalUrl = res.url
    } catch {
      // Ignore
    }
  }

  // Convert place URLs with coordinates to embed URLs
  if (finalUrl.includes('@')) {
    const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (match) {
      return `https://www.google.com/maps?q=${match[1]},${match[2]}&z=16&output=embed`
    }
  } else if (finalUrl.includes('/place/')) {
    // If it has a place name but no coordinates, we can try querying the place name
    const match = finalUrl.match(/\/place\/([^\/]+)/)
    if (match) {
      return `https://www.google.com/maps?q=${match[1]}&z=16&output=embed`
    }
  }

  return finalUrl
}

export async function GET(request: Request) {
  try {
    const authError = await checkAuth(request)
    if (authError) return authError

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
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authError = await checkAuth(request)
    if (authError) return authError

    const body = await request.json()

    // Separate clinic fields from settings fields
    const clinicData: Record<string, unknown> = {}
    const settingsData: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(body)) {
      if ((CLINIC_FIELDS as readonly string[]).includes(key)) {
        clinicData[key] = value
      } else {
        settingsData[key] = value
      }
    }

    // Update Clinic model if any clinic fields are present
    if (Object.keys(clinicData).length > 0) {
      const clinic = await db.clinic.findFirst()
      if (!clinic) {
        return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
      }
      // Auto-resolve short Google Maps URLs to full URLs with coordinates
      if (typeof clinicData.googleMapsUrl === 'string') {
        clinicData.googleMapsUrl = await resolveMapUrl(clinicData.googleMapsUrl)
      }
      const parsed = clinicUpdateSchema.safeParse(clinicData)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Validation error', details: parsed.error.issues }, { status: 400 })
      }
      await db.clinic.update({
        where: { id: clinic.id },
        data: parsed.data,
      })
    }

    // Update ClinicSettings if any settings fields are present
    if (Object.keys(settingsData).length > 0) {
      const settings = await db.clinicSettings.findFirst()
      if (!settings) {
        return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
      }

      // Hash new password if provided
      if (settingsData.adminPassword && settingsData.adminPassword !== '********') {
        settingsData.adminPassword = await bcrypt.hash(settingsData.adminPassword as string, 10)
      } else {
        delete settingsData.adminPassword
      }

      await db.clinicSettings.update({
        where: { id: settings.id },
        data: settingsData,
      })
    }

    // Return updated settings (without password)
    const updatedSettings = await db.clinicSettings.findFirst()
    if (!updatedSettings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    const { adminPassword, ...rest } = updatedSettings
    return NextResponse.json({
      ...rest,
      adminPassword: adminPassword ? '********' : null,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
