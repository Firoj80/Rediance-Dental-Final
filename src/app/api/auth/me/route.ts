import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth'

export async function GET() {
  const authError = await checkAuth()
  if (authError) {
    return NextResponse.json({ authenticated: false })
  }
  return NextResponse.json({ authenticated: true })
}
