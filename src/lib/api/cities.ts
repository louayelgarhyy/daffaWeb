// Cities & Areas API
import { get } from './client';

export interface ApiArea {
  id: string | number;
  name: string;
  code: string | null;
}

export interface ApiCity {
  id: string | number;
  name: string;
  code: string;
  areas: ApiArea[];
}

export interface ApiCountryWithCities {
  id: string | number;
  name: string;
  code: string;
  cities: ApiCity[];
}

interface CitiesResponse {
  status: boolean;
  data: ApiCountryWithCities;
}

/**
 * Fetch cities and areas for a given country_id
 */
export async function getCitiesByCountry(countryId: number = 1): Promise<ApiCity[]> {
  const response = await get<CitiesResponse>(`/api/v2/cities?country_id=${countryId}`, true);
  return response.data?.cities || [];
}
