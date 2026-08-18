import Image from 'next/image';
import { ArrowIcon, useStaggeredReveal } from '../shared';
import { useClinic } from '../context/ClinicContext';
import { getServices } from '../lib/api';
import { useEffect, useState } from 'react';

export function ServicesPage() {
  const reveal = useStaggeredReveal(15); // increased for more items
  const { clinicData: BUSINESS } = useClinic();
  
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => {
        const data = res.data || res;
        // Filter out inactive services if needed, but for now we'll just show what's returned
        // usually active flag is used. Let's just show active ones
        const activeServices = (Array.isArray(data) ? data : []).filter(s => s.active);
        setServices(activeServices);
      })
      .catch((err) => {
        console.error('Failed to fetch services', err);
      })
      .finally(() => {
        setLoadingServices(false);
      });
  }, []);

  return (
    <section
      ref={reveal.containerRef}
      className="min-h-screen w-full flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
        {/* Header Card */}
        <div
          className="md:col-span-2 rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 min-h-[190px]"
          style={reveal.getAnimStyle(0)}
        >
          <div>
            <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
              What we do
            </p>
            <h1 className="text-[clamp(3rem,8vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-black">
              Our
              <br />
              Services
            </h1>
          </div>
          <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5 max-w-[240px] md:text-right">
            {services.length > 0 ? `${services.length} specialised treatments` : 'Specialised treatments'} under one roof in {BUSINESS.city} — led
            by {BUSINESS.doctor}.
          </p>
        </div>

        {/* Service Cards — real photography */}
        {loadingServices ? (
           <div className="md:col-span-2 text-center p-10 text-gray-500">Loading services...</div>
        ) : services.length === 0 ? (
           <div className="md:col-span-2 text-center p-10 text-gray-500">No services found.</div>
        ) : (
          services.map((svc, i) => (
            <div
              key={svc.id}
              className="group rounded-xl md:rounded-2xl overflow-hidden relative min-h-[260px] md:min-h-[300px]"
              style={reveal.getAnimStyle(i + 1)}
            >
              {/* Photo */}
              {svc.image ? (
                <Image
                  src={svc.image}
                  alt={svc.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-stone-800 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              )}
              {/* Legibility gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

              {/* Content */}
              <div className="relative z-10 h-full p-4 md:p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-xs md:text-sm font-semibold text-white">
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/50 flex items-center justify-center text-white transition-colors duration-200 group-hover:bg-white group-hover:text-black">
                    <ArrowIcon />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl md:text-4xl font-bold leading-[1.05] whitespace-pre-line text-white">
                    {svc.name.replace(' ', '\n')}
                  </h3>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm font-medium leading-4 md:leading-5 max-w-[280px] text-white/85">
                    {svc.shortDescription || svc.name}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {/* CTA Card */}
        <div
          className="md:col-span-2 rounded-xl md:rounded-2xl bg-black p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-h-[150px]"
          style={reveal.getAnimStyle(9)}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-7 md:leading-9">
            Not sure which
            <br />
            treatment you need?
          </h2>
          <a
            href={`tel:${BUSINESS.phone}`}
            className="px-6 py-3.5 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform shrink-0 whitespace-nowrap"
          >
            Call {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
