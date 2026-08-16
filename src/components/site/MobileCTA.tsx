'use client'

import { Phone, CalendarPlus } from 'lucide-react'
import { useSiteStore } from '@/lib/store'

export function MobileCTA() {
  const clinicData = useSiteStore((s) => s.clinicData)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="flex items-center gap-2.5">
        {clinicData?.phone && (
          <a
            href={`tel:${clinicData.phone}`}
            className="w-10 h-10 shrink-0 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
          >
            <Phone className="w-4.5 h-4.5" />
          </a>
        )}
        <button
          onClick={() => {
            window.location.hash = '#/book'
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm py-3 transition-colors shadow-sm"
        >
          <CalendarPlus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>
    </div>
  )
}
