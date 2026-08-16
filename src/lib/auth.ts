import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { db } from '@/lib/db'

/**
 * Generate a deterministic session token from the stored password hash.
 * This avoids in-memory state that breaks on Turbopack module reloads.
 */
function computeToken(passwordHash: string): string {
  return createHash('sha256').update('rdc-admin-' + passwordHash).digest('hex').slice(0, 32)
}

/**
 * Validate admin auth. Returns null if authorized, or a 401 NextResponse to return.
 */
export async function checkAuth(request: Request): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)

  const settings = await db.clinicSettings.findFirst()
  if (!settings?.adminPassword) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 401 })
  }

  const expectedToken = computeToken(settings.adminPassword)
  if (token !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

/**
 * Legacy throw-based auth (kept for backward compat with existing routes).
 * Prefer checkAuth() in new code.
 */
export async function requireAuth(request: Request): Promise<void> {
  const result = await checkAuth(request)
  if (result) throw result
}

export async function createSessionToken(): Promise<string> {
  const settings = await db.clinicSettings.findFirst()
  if (!settings?.adminPassword) {
    throw new Error('Admin not configured')
  }
  return computeToken(settings.adminPassword)
}
