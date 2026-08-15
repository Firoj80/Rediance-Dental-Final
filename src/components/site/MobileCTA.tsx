'use client'

import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border p-3 lg:hidden">
      <Button
        onClick={() => {
          window.location.hash = '#/book'
        }}
        className="w-full bg-primary hover:bg-primary/90 text-white shadow-md"
        size="lg"
      >
        <CalendarPlus className="w-4 h-4" />
        Book Appointment
      </Button>
    </div>
  )
}
