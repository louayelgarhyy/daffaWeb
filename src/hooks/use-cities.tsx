import { useState, useEffect } from 'react';
import { citiesApi } from '@/lib/api';
import type { ApiCity, ApiArea } from '@/lib/api/cities';

export function useCities(countryId: number = 1) {
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    citiesApi.getCitiesByCountry(countryId)
      .then((data) => {
        if (!cancelled) setCities(data);
      })
      .catch((err) => {
        console.error('Failed to fetch cities:', err);
        if (!cancelled) setCities([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [countryId]);

  const getAreasForCity = (cityId: string | number): ApiArea[] => {
    const city = cities.find(c => String(c.id) === String(cityId));
    return city?.areas || [];
  };

  return { cities, isLoading, getAreasForCity };
}
