const EARTH_RADIUS_KM = 6371
const AVERAGE_FLIGHT_SPEED_KMH = 900
// Taxi, takeoff, climb, and descent aren't spent at cruise speed.
const FLIGHT_OVERHEAD_HOURS = 0.5

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export interface Coordinates {
  latitude: number
  longitude: number
}

/** Great-circle ("as the crow flies") distance in km between two coordinates. */
export function getDistanceKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.latitude - a.latitude)
  const dLon = toRadians(b.longitude - a.longitude)
  const lat1 = toRadians(a.latitude)
  const lat2 = toRadians(b.latitude)

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

/** Rough flight-time estimate from great-circle distance, not a real routed itinerary. */
export function estimateFlightHours(distanceKm: number): number {
  return distanceKm / AVERAGE_FLIGHT_SPEED_KMH + FLIGHT_OVERHEAD_HOURS
}
