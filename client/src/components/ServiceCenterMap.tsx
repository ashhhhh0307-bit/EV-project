import { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, Navigation, Radio, Route, Search, ShieldCheck } from "lucide-react";
import { MapView } from "@/components/Map";

type CenterRecord = { id: number; name: string; city: string; address?: string | null };
type NearbyPlace = { id: string; name: string; address: string; rating?: number; location: google.maps.LatLngLiteral };

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

export default function ServiceCenterMap({ registeredCenters }: { registeredCenters: CenterRecord[] }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const registeredMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const nearbyMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [nearbyCenters, setNearbyCenters] = useState<NearbyPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [followUser, setFollowUser] = useState(true);
  const [locationStatus, setLocationStatus] = useState("Location access is off");
  const [mapReady, setMapReady] = useState(false);
  const [routing, setRouting] = useState(false);

  const clearMarkers = (markers: google.maps.marker.AdvancedMarkerElement[]) => {
    markers.forEach((marker) => { marker.map = null; });
    markers.length = 0;
  };

  const createMarker = (map: google.maps.Map, position: google.maps.LatLngLiteral, title: string, kind: "user" | "registered" | "nearby") => {
    const content = document.createElement("div");
    content.className = `service-map-pin ${kind}`;
    content.innerHTML = kind === "user" ? "●" : kind === "registered" ? "▣" : "⚡";
    const marker = new google.maps.marker.AdvancedMarkerElement({ map, position, title, content });
    return marker;
  };

  const updateUserLocation = (position: GeolocationPosition) => {
    const next = { lat: position.coords.latitude, lng: position.coords.longitude };
    setUserLocation(next);
    setLocationStatus("Live location active");
    if (mapRef.current && followUser) mapRef.current.panTo(next);
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported in this browser");
      return;
    }
    setLocationStatus("Requesting precise location…");
    navigator.geolocation.getCurrentPosition(updateUserLocation, () => setLocationStatus("Location permission was not granted"), { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 });
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition(updateUserLocation, () => setLocationStatus("Location permission was not granted"), { enableHighAccuracy: true, maximumAge: 5000 });
    return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [followUser]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !userLocation || !window.google?.maps?.places) return;
    if (userMarkerRef.current) userMarkerRef.current.map = null;
    userMarkerRef.current = createMarker(mapRef.current, userLocation, "Your live location", "user");
    const placesService = new google.maps.places.PlacesService(mapRef.current);
    placesService.nearbySearch({ location: userLocation, radius: 10000, keyword: "EV service center" }, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        setNearbyCenters([]);
        setLocationStatus("No nearby EV service centers found in this radius");
        return;
      }
      const next = results.slice(0, 12).flatMap((place) => {
        if (!place.place_id || !place.geometry?.location || !place.name) return [];
        return [{ id: place.place_id, name: place.name, address: place.vicinity ?? "Nearby EV service center", rating: place.rating, location: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } }];
      });
      clearMarkers(nearbyMarkersRef.current);
      next.forEach((place) => nearbyMarkersRef.current.push(createMarker(mapRef.current!, place.location, place.name, "nearby")));
      setNearbyCenters(next);
      setLocationStatus(`${next.length} nearby EV service centers found`);
    });
  }, [mapReady, userLocation]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google?.maps?.Geocoder) return;
    clearMarkers(registeredMarkersRef.current);
    const geocoder = new google.maps.Geocoder();
    registeredCenters.forEach((center) => {
      geocoder.geocode({ address: center.address ? `${center.address}, ${center.city}` : center.city }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry.location) {
          const location = results[0].geometry.location;
          registeredMarkersRef.current.push(createMarker(mapRef.current!, { lat: location.lat(), lng: location.lng() }, center.name, "registered"));
        }
      });
    });
  }, [mapReady, registeredCenters]);

  const showRoute = (place: NearbyPlace) => {
    if (!mapRef.current || !userLocation || !window.google?.maps?.DirectionsService) {
      setLocationStatus("Turn on live location before starting navigation");
      return;
    }
    setRouting(true);
    setSelectedPlace(place);
    directionsRendererRef.current ??= new google.maps.DirectionsRenderer({ map: mapRef.current, suppressMarkers: true, polylineOptions: { strokeColor: "#36a485", strokeWeight: 5, strokeOpacity: 0.85 } });
    new google.maps.DirectionsService().route({ origin: userLocation, destination: place.location, travelMode: google.maps.TravelMode.DRIVING }, (result, status) => {
      setRouting(false);
      if (status === "OK" && result) {
        directionsRendererRef.current?.setDirections(result);
        setLocationStatus(`Route ready to ${place.name}`);
      } else setLocationStatus("Unable to calculate a driving route");
    });
  };

  return <section className="service-map-workspace">
    <div className="service-map-header"><div><span className="autoswap-kicker">LIVE LOCATION NETWORK</span><h3>Find an EV service center near you</h3><p>See partner locations, discover nearby EV specialists, and get exact turn-by-turn movement from your current position.</p></div><div className="service-map-actions"><button className={`map-location-button ${userLocation ? "live" : ""}`} onClick={locateUser}><LocateFixed size={15} /> {userLocation ? "Update my location" : "Use my location"}</button><button className={`map-follow-button ${followUser ? "on" : ""}`} onClick={() => setFollowUser((value) => !value)}><Radio size={14} /> {followUser ? "Following" : "Follow off"}</button></div></div>
    <div className="service-map-layout"><div className="service-map-canvas"><MapView className="service-map" initialCenter={userLocation ?? DEFAULT_CENTER} initialZoom={12} onMapReady={(map) => { mapRef.current = map; directionsRendererRef.current = new google.maps.DirectionsRenderer({ map, suppressMarkers: true, polylineOptions: { strokeColor: "#36a485", strokeWeight: 5, strokeOpacity: 0.85 } }); setMapReady(true); locateUser(); }} /><div className="service-map-status"><span className={userLocation ? "status-live-dot" : "status-idle-dot"} /> {locationStatus}</div><div className="service-map-legend"><span><i className="legend-user" /> You</span><span><i className="legend-nearby" /> Nearby EV center</span><span><i className="legend-registered" /> Partner</span></div></div><aside className="nearby-center-list"><div className="nearby-list-head"><div><span className="autoswap-kicker">DISCOVERED NEARBY</span><h4>{nearbyCenters.length} EV service centers</h4></div><Search size={16} className="muted" /></div>{nearbyCenters.length === 0 ? <div className="nearby-empty"><div className="empty-symbol"><MapPin size={17} /></div><strong>Use your location to discover centers</strong><p>AutoSwap will search within 10 km for nearby EV service specialists.</p><button onClick={locateUser}><LocateFixed size={14} /> Enable location</button></div> : <div className="nearby-list">{nearbyCenters.map((place) => <article className={`nearby-center ${selectedPlace?.id === place.id ? "selected" : ""}`} key={place.id} onClick={() => setSelectedPlace(place)}><div className="nearby-center-icon"><ShieldCheck size={16} /></div><div className="nearby-center-copy"><strong>{place.name}</strong><span>{place.address}</span><small>{place.rating ? `★ ${place.rating.toFixed(1)} · ` : ""}Nearby EV service center</small></div><button className="navigate-center" onClick={(event) => { event.stopPropagation(); showRoute(place); }} disabled={routing && selectedPlace?.id === place.id}><Navigation size={14} /> {routing && selectedPlace?.id === place.id ? "Finding…" : "Navigate"}</button></article>)}</div>}</aside></div>
  </section>;
}
