'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BUSINESS } from '../shared';
import { getClinicInfo, getWorkingHours } from '../lib/api';

interface ClinicContextType {
  clinicData: typeof BUSINESS;
  loading: boolean;
  error: string | null;
}

const ClinicContext = createContext<ClinicContextType>({
  clinicData: BUSINESS,
  loading: true,
  error: null,
});

export const ClinicProvider = ({ children }: { children: ReactNode }) => {
  const [clinicData, setClinicData] = useState<typeof BUSINESS>(BUSINESS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        setLoading(true);
        const [clinicRes, hoursRes] = await Promise.all([
          getClinicInfo().catch((err) => {
            console.warn('Clinic info fetch failed, using fallback.', err);
            return null;
          }),
          getWorkingHours().catch((err) => {
            console.warn('Working hours fetch failed, using fallback.', err);
            return null;
          })
        ]);

        setClinicData(prevData => {
          let newData = { ...prevData };
          if (clinicRes) {
             const data = clinicRes.data || clinicRes;
             newData = { ...newData, ...data };
             if (data.googleMapsUrl) {
               newData.mapEmbed = data.googleMapsUrl;
             }
          }
          if (hoursRes) {
             const hoursData = hoursRes.data || hoursRes;
             if (Array.isArray(hoursData)) {
               newData = { ...newData, hours: hoursData };
             } else if (hoursData.hours && Array.isArray(hoursData.hours)) {
               newData = { ...newData, hours: hoursData.hours };
             }
          }
          return newData;
        });
      } catch (err) {
        console.error('Error fetching clinic data:', err);
        setError('Failed to load dynamic clinic data. Using static fallbacks.');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
  }, []);

  return (
    <ClinicContext.Provider value={{ clinicData, loading, error }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
