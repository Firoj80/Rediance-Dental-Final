import { NextResponse } from 'next/server'

let adminSessionToken: string | null = null
const ADMIN_TOKEN = 'radiance-admin-' + Date.now()

export function getAdminToken(): string {
  return ADMIN_TOKEN
}

export function setAdminSession(token: string | null): void {
  adminSessionToken = token
}

export function requireAuth(request: Request): { authorized: true } {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const token = authHeader.slice(7)
  if (token !== adminSessionToken) {
    throw NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return { authorized: true }
}
