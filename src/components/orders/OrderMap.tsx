
import { useState, useEffect, useRef } from "react";
import { useData } from "@/contexts/DataContext";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface OrderMapProps {
  orderId: number;
}

// Mock tracking data points - in real scenario these would come from your backend
const getTrackingPoints = (orderId: number) => {
  // Starting point - central warehouse
  const startPoint = { lat: 40.7128, lng: -74.006 };
  
  // Different distribution points based on orderId
  const points = [
    { orderId: 1, route: [
      { lat: 40.7128, lng: -74.006 }, // New York
      { lat: 40.6892, lng: -74.0445 }, // Jersey City
      { lat: 40.7357, lng: -74.1724 }, // Newark
      { lat: 40.8224, lng: -73.9496 }, // Bronx
      { lat: 40.6782, lng: -73.9442 }, // Brooklyn
    ]},
    { orderId: 2, route: [
      { lat: 40.7128, lng: -74.006 }, // New York
      { lat: 41.0082, lng: -73.7738 }, // Stamford
      { lat: 41.3082, lng: -72.9282 }, // New Haven
      { lat: 41.7658, lng: -72.6734 }, // Hartford
      { lat: 42.3601, lng: -71.0589 }, // Boston
    ]},
  ];
  
  // Find matching route or return default
  const orderRoute = points.find(p => p.orderId === orderId);
  return orderRoute ? orderRoute.route : [startPoint];
};

export const OrderMap = ({ orderId }: OrderMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { orders } = useData();
  const order = orders.find(o => o.id === orderId);
  
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [mapObject, setMapObject] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  
  useEffect(() => {
    // Load map script dynamically
    const loadMapScript = () => {
      const existingScript = document.getElementById('mapboxgl-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
        script.id = 'mapboxgl-script';
        document.body.appendChild(script);
        
        script.onload = () => {
          // Load CSS once script is loaded
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
          document.head.appendChild(link);
          
          setMapLoaded(true);
        };
      } else {
        setMapLoaded(true);
      }
    };
    
    loadMapScript();
  }, []);
  
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    const initMap = () => {
      try {
        // @ts-ignore
        const mapboxgl = window.mapboxgl;
        if (!mapboxgl) {
          console.error("Mapbox GL not loaded");
          return;
        }
        
        // In a real app, use an environment variable or fetch from backend
        mapboxgl.accessToken = 'YOUR_MAPBOX_PUBLIC_TOKEN';
        
        const map = new mapboxgl.Map({
          container: mapRef.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [0, 0],
          zoom: 2,
        });

        setMapObject(map);
        
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        map.on('load', () => {
          // Start tracking simulation when map loads
          startTrackingSimulation(map);
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Could not load map. Please try again later.");
      }
    };
    
    initMap();
    
    return () => {
      if (mapObject) {
        mapObject.remove();
      }
    };
  }, [mapLoaded]);
  
  const startTrackingSimulation = (map: any) => {
    const trackingPoints = getTrackingPoints(orderId);
    let currentIndex = 0;
    
    // Update initial position
    if (trackingPoints.length > 0) {
      setCurrentPosition(trackingPoints[0]);
      
      // Create a marker
      const el = document.createElement('div');
      el.className = 'truck-marker';
      el.style.width = '25px';
      el.style.height = '25px';
      el.style.backgroundSize = 'contain';
      el.style.backgroundImage = 'url(https://cdn4.iconfinder.com/data/icons/logistics-delivery-2-5/64/130-512.png)';
      el.style.backgroundRepeat = 'no-repeat';
      
      // @ts-ignore
      const newMarker = new window.mapboxgl.Marker(el)
        .setLngLat([trackingPoints[0].lng, trackingPoints[0].lat])
        .addTo(map);
      
      setMarker(newMarker);
      
      // Center the map on first point
      map.flyTo({
        center: [trackingPoints[0].lng, trackingPoints[0].lat],
        zoom: 12,
        essential: true
      });
      
      // Simulate movement
      const interval = setInterval(() => {
        currentIndex++;
        
        if (currentIndex < trackingPoints.length) {
          const nextPoint = trackingPoints[currentIndex];
          setCurrentPosition(nextPoint);
          
          // Update marker position
          newMarker.setLngLat([nextPoint.lng, nextPoint.lat]);
          
          // Pan the map to follow the marker
          map.panTo([nextPoint.lng, nextPoint.lat], { duration: 2000 });
          
          // Update progress message
          const progress = Math.round((currentIndex / (trackingPoints.length - 1)) * 100);
          const status = order?.status === "shipped" ? "In transit" : "Being processed";
          toast.info(`${status}: ${progress}% complete`, { id: 'tracking-progress', duration: 3000 });
        } else {
          // End of route reached
          clearInterval(interval);
          toast.success("Order tracking complete!", { id: 'tracking-complete' });
        }
      }, 3000); // Move every 3 seconds
      
      return () => clearInterval(interval);
    }
  };
  
  if (!mapLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p>Loading map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      {order && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md max-w-sm">
          <h3 className="font-bold text-lg">Order #{orderId}</h3>
          <p><span className="font-medium">Status:</span> {order.status}</p>
          <p><span className="font-medium">Customer:</span> {order.customer || "Anonymous"}</p>
          <p><span className="font-medium">Items:</span> {order.items.length}</p>
          {currentPosition && (
            <p className="mt-2 text-sm">
              <span className="font-medium">Current location:</span> {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
