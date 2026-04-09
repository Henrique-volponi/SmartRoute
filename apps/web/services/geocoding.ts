export interface GeocodingResult {
  lat: number
  lng: number
  displayName: string
}

/**
 * Geocodes an address using Nominatim (OpenStreetMap).
 * Free, no API key required. Rate limit: 1 req/s.
 * Usage policy: https://operations.osmfoundation.org/policies/nominatim/
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  const params = new URLSearchParams({
    q: address,
    format: 'json',
    limit: '1',
    countrycodes: 'br',
    'accept-language': 'pt-BR',
    email: 'smartroute@app.com',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    { headers: { 'Accept': 'application/json' } }
  )

  if (!response.ok) throw new Error(`Nominatim error: ${response.status}`)

  const data: Array<{ lat: string; lon: string; display_name: string }> = await response.json()

  if (!data.length) return null

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  }
}
