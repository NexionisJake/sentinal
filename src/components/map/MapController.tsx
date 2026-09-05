import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function MapController({ focus }: { focus: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (focus) {
      map.flyTo([focus.lat, focus.lng], focus.zoom ?? 10, { duration: 1.1 });
    }
  }, [focus, map]);

  return null;
}
