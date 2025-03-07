// src/utils/maps.ts
export interface LatLng {
  latitude: number;
  longitude: number;
}

export const computeDistance = (pointA: LatLng, pointB: LatLng): number => {
  if (!window.google) {
    console.error('Google Maps API is not loaded');
    return Infinity;
  }
  const latLngA = new window.google.maps.LatLng(pointA.latitude, pointA.longitude);
  const latLngB = new window.google.maps.LatLng(pointB.latitude, pointB.longitude);
  return window.google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
};