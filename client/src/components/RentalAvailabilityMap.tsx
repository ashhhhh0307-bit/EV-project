import { useEffect, useRef, useState } from "react";
import { CarFront, LocateFixed, MapPin, Navigation, Radio, Route, ShieldCheck } from "lucide-react";
import { MapView } from "@/components/Map";

type Vehicle = { id: number; make: string; model: string; city: string; pickupAddress?: string | null; registrationNumber: string; dailyRateCents: number; status: string; ownerId: number };
type LocatedVehicle = Vehicle & { location: google.maps.LatLngLiteral; distanceKm: number };
const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

export default function RentalAvailabilityMap({ vehicles }: { vehicles: Vehicle[] }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const vehicleMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const routeLineRef = useRef<google.maps.Polyline | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locatedVehicles, setLocatedVehicles] = useState<LocatedVehicle[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState("Finding your position…");
  const [following, setFollowing] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  const marker = (map: google.maps.Map, position: google.maps.LatLngLiteral, title: string, type: "user" | "vehicle") => {
    const content = document.createElement("div");
    content.className = `availability-pin ${type}`;
    content.innerHTML = type === "user" ? "●" : "⚡";
    return new google.maps.marker.AdvancedMarkerElement({ map, position, title, content });
  };

  const updateLocation = (position: GeolocationPosition) => {
    const next = { lat: position.coords.latitude, lng: position.coords.longitude };
    setUserLocation(next);
    setStatus("Live position active");
    if (mapRef.current && following) mapRef.current.panTo(next);
  };

  const locate = () => {
    if (!navigator.geolocation) { setStatus("Location is not supported by this browser"); return; }
    setStatus("Requesting your precise position…");
    navigator.geolocation.getCurrentPosition(updateLocation, () => setStatus("Location permission is required to show distance"), { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 });
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(updateLocation, () => setStatus("Location permission is required to show distance"), { enableHighAccuracy: true, maximumAge: 5000 });
    return () => navigator.geolocation.clearWatch(id);
  }, [following]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !userLocation || !window.google?.maps?.Geocoder) return;
    if (userMarkerRef.current) userMarkerRef.current.map = null;
    userMarkerRef.current = marker(mapRef.current, userLocation, "Your position", "user");
    const geocoder = new google.maps.Geocoder();
    const located: LocatedVehicle[] = [];
    let pending = vehicles.length;
    if (!pending) { setLocatedVehicles([]); setStatus("No available rental EVs yet"); return; }
    vehicles.forEach((vehicle) => geocoder.geocode({ address: vehicle.pickupAddress ? `${vehicle.pickupAddress}, ${vehicle.city}` : vehicle.city }, (results, resultStatus) => {
      const location = results?.[0]?.geometry.location;
      if (resultStatus === "OK" && location) {
        const point = { lat: location.lat(), lng: location.lng() };
        const meters = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(userLocation.lat, userLocation.lng), new google.maps.LatLng(point.lat, point.lng));
        located.push({ ...vehicle, location: point, distanceKm: Math.round((meters / 1000) * 10) / 10 });
      }
      pending -= 1;
      if (pending === 0) setLocatedVehicles(located.sort((a, b) => a.distanceKm - b.distanceKm));
    }));
  }, [mapReady, userLocation, vehicles]);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    vehicleMarkersRef.current.forEach((item) => { item.map = null; });
    vehicleMarkersRef.current = locatedVehicles.map((vehicle) => marker(mapRef.current!, vehicle.location, `${vehicle.make} ${vehicle.model} · ${vehicle.distanceKm} km away`, "vehicle"));
    routeLineRef.current?.setMap(null);
    const selected = locatedVehicles.find((vehicle) => vehicle.id === selectedId);
    if (selected) {
      routeLineRef.current = new google.maps.Polyline({ map: mapRef.current, path: [userLocation, selected.location], strokeColor: "#ef8b45", strokeOpacity: .75, strokeWeight: 3, geodesic: true });
      mapRef.current.panTo(selected.location);
    }
  }, [locatedVehicles, selectedId, userLocation]);

  return <section className="availability-map-panel"><div className="availability-map-head"><div><span className="autoswap-kicker">LIVE RENTAL AVAILABILITY</span><h3>Find the nearest available EV</h3><p>You and each rental owner can see the owner position, availability, and distance between you.</p></div><div className="availability-map-actions"><button onClick={locate}><LocateFixed size={14} /> {userLocation ? "Update position" : "Show my position"}</button><button className={following ? "active" : ""} onClick={() => setFollowing((value) => !value)}><Radio size={14} /> {following ? "Following" : "Follow off"}</button></div></div><div className="availability-map-grid"><div className="availability-map-canvas"><MapView className="availability-map" initialCenter={userLocation ?? DEFAULT_CENTER} initialZoom={12} onMapReady={(map) => { mapRef.current = map; setMapReady(true); locate(); }} /><div className="availability-map-status"><i className={userLocation ? "live" : "idle"} /> {status}</div><div className="availability-legend"><span><b className="you-dot" /> You</span><span><b className="owner-dot" /> Available owner EV</span><span><b className="route-dot" /> Distance line</span></div></div><aside className="availability-list"><div className="availability-list-top"><span><CarFront size={15} /> {locatedVehicles.length} available nearby</span><ShieldCheck size={14} /></div>{locatedVehicles.length === 0 ? <div className="availability-empty"><MapPin size={22} /><strong>Waiting for available EV locations</strong><p>Allow location access and saved Browse EV listings will appear here.</p><button onClick={locate}>Show my position</button></div> : locatedVehicles.map((vehicle) => <article className={`availability-card ${selectedId === vehicle.id ? "selected" : ""}`} key={vehicle.id} onClick={() => setSelectedId(vehicle.id)}><div className="availability-card-icon"><CarFront size={16} /></div><div className="availability-card-copy"><strong>{vehicle.make} {vehicle.model}</strong><span>{vehicle.city} · {vehicle.pickupAddress || "Owner pickup point"}</span><small>{vehicle.registrationNumber} · {vehicle.distanceKm} km from you</small></div><div className="availability-card-side"><b>₹{(vehicle.dailyRateCents / 100).toLocaleString("en-IN")}</b><small>per day</small><button onClick={(event) => { event.stopPropagation(); setSelectedId(vehicle.id); }}><Route size={12} /> View route</button></div></article>)}</aside></div></section>;
}
