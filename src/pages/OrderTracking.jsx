import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import HOTELS from "../data/hotels";
const STAGES = [
  { key: "confirmed", label: "Order Confirmed", minAge: 0 },
  { key: "preparing", label: "Preparing", minAge: 1 },
  { key: "packed", label: "Packed", minAge: 3 },
  { key: "out", label: "Out for Delivery", minAge: 6 },
  { key: "delivered", label: "Delivered", minAge: 10 }
];

const CITY_COORDS = {
  Chennai: [13.0827, 80.2707],
  Coimbatore: [11.0168, 76.9558],
  Trichy: [10.7905, 78.7047],
  Madurai: [9.9252, 78.1198],
  Dindigul: [10.3673, 77.9803],
  Salem: [11.6643, 78.1460],
  Erode: [11.3410, 77.7172],
  Tiruppur: [11.1085, 77.3411],
  Vellore: [12.9165, 79.1325],
  Thanjavur: [10.7870, 79.1378],
  Tirunelveli: [8.7139, 77.7567],
  Hosur: [12.7409, 77.8253],
  Nagercoil: [8.1830, 77.4119],
  Kanyakumari: [8.0883, 77.5385],
  Ooty: [11.4102, 76.6950],
  Karaikudi: [10.0747, 78.7842]
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getHotelCoords(hotel) {
  const base = CITY_COORDS[hotel?.city] || CITY_COORDS["Chennai"];
  let hash = 0;
  const name = hotel?.name || "Restaurant";
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  const latOffset = ((hash % 100) - 50) * 0.00015;
  const lngOffset = (((hash >> 2) % 100) - 50) * 0.00015;
  return [base[0] + latOffset, base[1] + lngOffset];
}

function interpolateRoute(routeCoords, ratio) {
  if (!routeCoords || routeCoords.length === 0) return null;
  if (ratio <= 0) return routeCoords[0];
  if (ratio >= 1) return routeCoords[routeCoords.length - 1];

  const totalSegments = routeCoords.length - 1;
  const rawIndex = ratio * totalSegments;
  const index = Math.floor(rawIndex);
  const fraction = rawIndex - index;

  const p1 = routeCoords[index];
  const p2 = routeCoords[index + 1];

  if (!p1 || !p2) return routeCoords[0];

  const lat = p1[0] + (p2[0] - p1[0]) * fraction;
  const lng = p1[1] + (p2[1] - p1[1]) * fraction;
  return [lat, lng];
}

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderAgeMins, setOrderAgeMins] = useState(0);

  // Location and Map state variables
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);
  const [etaMins, setEtaMins] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [bikeMarker, setBikeMarker] = useState(null);
  const [isSimulatingMessage, setIsSimulatingMessage] = useState(false);

  const effectiveAge = orderAgeMins;

  // 1. Fetch Order details & set up age timer
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    const matched = savedOrders.find(o => o.orderId === orderId);
    if (!matched) {
      alert("Order not found!");
      navigate("/my-orders");
      return;
    }
    setOrder(matched);

    if (matched.dateTime) {
      const orderTime = new Date(matched.dateTime).getTime();
      if (!isNaN(orderTime)) {
        setOrderAgeMins((Date.now() - orderTime) / 60000);
      }
    }

    const interval = setInterval(() => {
      if (matched.dateTime) {
        const orderTime = new Date(matched.dateTime).getTime();
        if (!isNaN(orderTime)) {
          setOrderAgeMins((Date.now() - orderTime) / 60000);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  // 2. Load Leaflet script & CSS dynamically from CDN
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => {
      setLeafletLoaded(true);
    };
    script.onerror = () => {
      setMapError("Failed to load Leaflet map library.");
    };
    document.body.appendChild(script);
  }, []);

  // 3. Get User Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Geolocation failed or denied:", error);
          setMapError("Location permission denied. Simulating delivery locally.");
          setUserCoords([13.0827, 80.2707]); // Default fallback
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setMapError("Geolocation is not supported by your browser. Simulating delivery locally.");
      setUserCoords([13.0827, 80.2707]);
    }
  }, []);

  // 4. Resolve Restaurant Coords and Fetch Route via OSRM
  useEffect(() => {
    if (!userCoords || !order) return;

    const hotel = HOTELS.find(h => h.name === order.hotelName);
    let finalHotelCoords = getHotelCoords(hotel);
    const finalUserCoords = userCoords;

    const dist = getDistance(userCoords[0], userCoords[1], finalHotelCoords[0], finalHotelCoords[1]);
    if (dist > 30) {
      // Offset hotel relative to user coordinates to simulate a realistic local route
      finalHotelCoords = [userCoords[0] + 0.012, userCoords[1] + 0.012];
      setIsSimulatingMessage(true);
    } else {
      setIsSimulatingMessage(false);
    }

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${finalHotelCoords[1]},${finalHotelCoords[0]};${finalUserCoords[1]},${finalUserCoords[0]}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteCoords(coords);
          setDistanceKm((data.routes[0].distance / 1000).toFixed(1));
          setEtaMins(Math.round(data.routes[0].duration / 60));
        } else {
          throw new Error("No route found");
        }
      } catch (err) {
        console.warn("OSRM routing error, using straight line:", err);
        const coords = [finalHotelCoords, finalUserCoords];
        setRouteCoords(coords);
        const distance = getDistance(finalHotelCoords[0], finalHotelCoords[1], finalUserCoords[0], finalUserCoords[1]);
        setDistanceKm(distance.toFixed(1));
        setEtaMins(Math.round(distance * 3)); // Estimate 3 mins per km
      }
    };

    fetchRoute();
  }, [userCoords, order]);

  // 5. Initialize Leaflet Map
  useEffect(() => {
    if (!leafletLoaded || !routeCoords.length || !order) return;

    const L = window.L;

    const container = L.DomUtil.get("map");
    if (container) {
      container._leaflet_id = null;
    }

    const map = L.map("map").setView(routeCoords[0], 14);
    setMapInstance(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Custom marker icons
    const hotelIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const userIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const bikeIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add Hotel & User markers
    L.marker(routeCoords[0], { icon: hotelIcon })
      .addTo(map)
      .bindPopup(`<b>${order.hotelName}</b><br/>Restaurant`)
      .openPopup();

    L.marker(routeCoords[routeCoords.length - 1], { icon: userIcon })
      .addTo(map)
      .bindPopup("<b>Your Location</b><br/>Delivery Destination");

    // Add Route Polyline
    L.polyline(routeCoords, { color: "#22c55e", weight: 5, opacity: 0.8 }).addTo(map);

    // Add Delivery Bike Marker
    const bike = L.marker(routeCoords[0], { icon: bikeIcon }).addTo(map);
bike.bindPopup(
  "<b>🏍️ Delivery Partner</b><br/>Your order is on the way!"
);
    setBikeMarker(bike);

    // Fit map bounds
    const bounds = L.latLngBounds(routeCoords);
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      map.remove();
    };
  }, [leafletLoaded, routeCoords, order]);

  // 6. Update Delivery Bike Marker Location in Sync with Timeline Stages
  useEffect(() => {
    if (!bikeMarker || !routeCoords.length) return;

    let ratio = 0;
    if (effectiveAge >= 10) {
      ratio = 1;
    } else if (effectiveAge >= 6) {
      ratio = (effectiveAge - 6) / 4;
    }

    const currentCoords = interpolateRoute(routeCoords, ratio);
    if (currentCoords) {
      bikeMarker.setLatLng(currentCoords);
      if (effectiveAge >= 6 && effectiveAge < 10 && mapInstance) {
        mapInstance.panTo(currentCoords);
      }
    }
  }, [bikeMarker, routeCoords, effectiveAge, mapInstance]);

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto p-6 mt-20 text-center">
          <p className="text-gray-500">Loading tracking status...</p>
        </div>
      </>
    );
  }

  // Determine active stage and status text
  let activeStageIndex = 0;
  STAGES.forEach((stage, idx) => {
    if (effectiveAge >= stage.minAge) {
      activeStageIndex = idx;
    }
  });

  const currentStatus = STAGES[activeStageIndex].label;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 mt-6">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-green-700">🚚 Track Order</h1>
            <p className="text-sm text-gray-400 mt-1">Order ID: <span className="font-mono font-bold text-gray-600">{order.orderId}</span></p>
          </div>
          <button
            onClick={() => navigate("/my-orders")}
            className="border border-green-600 text-green-700 hover:bg-green-50 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer"
          >
            ← Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* TIMELINE COLUMN */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white border rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Current Status</span>
                <span className="text-green-700 font-extrabold text-lg">{currentStatus}</span>
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                {STAGES.map((stage, idx) => {
                  const isCompleted = effectiveAge >= stage.minAge;
                  const isActive = activeStageIndex === idx;

                  return (
                    <div key={stage.key} className="relative flex gap-4 items-start">
                      
                      {/* Circle Indicator */}
                      <div
                        className={`absolute left-[-28px] w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-green-600 border-green-600 text-white"
                            : "bg-white border-gray-200 text-gray-300"
                        } ${isActive ? "ring-4 ring-green-100 animate-pulse scale-110" : ""}`}
                      >
                        {isCompleted ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                        )}
                      </div>

                      <div>
                        <h4 className={`font-bold transition-colors ${
                          isActive ? "text-green-800 text-lg" : isCompleted ? "text-gray-700" : "text-gray-450"
                        }`}>
                          {stage.label}
                        </h4>
                        {isActive && (
                          <p className="text-xs text-orange-500 font-semibold mt-0.5 animate-pulse">
                            Active stage • Your order is currently at this step
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MAP SECTION */}
            <div className="bg-white border rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Live Route Tracking</span>
                {isSimulatingMessage && (
                  <span className="text-xs bg-orange-100 text-orange-850 px-3 py-1 rounded-full font-bold">
                    Local Simulation Active
                  </span>
                )}
              </div>

              {mapError && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-orange-850 text-xs font-semibold">
                  ⚠️ {mapError}
                </div>
              )}

              {!leafletLoaded && !mapError ? (
                <div className="h-80 w-full rounded-2xl border flex items-center justify-center bg-gray-50 text-gray-400 font-medium">
                  Loading tracking map...
                </div>
              ) : (
                <div id="map" className="w-full h-80 rounded-2xl border" style={{ zIndex: 1 }}></div>
              )}

              {/* ETA & Distance Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <span className="text-xs text-green-850 uppercase font-bold tracking-wider block">Estimated Distance</span>
                  <span className="text-xl font-extrabold text-green-950 mt-1 block">
                    {distanceKm ? `${distanceKm} km` : "Calculating..."}
                  </span>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
                  <span className="text-xs text-orange-850 uppercase font-bold tracking-wider block">Estimated Travel Time</span>
                  <span className="text-xl font-extrabold text-orange-950 mt-1 block">
                    {etaMins ? `${etaMins} mins` : "Calculating..."}
                  </span>
                </div>
              </div>
 </div>
 </div>

              

          {/* ORDER BRIEF INFO PANEL */}
          <div className="space-y-6">
            <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Restaurant Details</h3>
              <div>
                <span className="font-extrabold text-gray-850 text-base block">{order.hotelName}</span>
                <span className="text-xs text-gray-400 mt-1 block">Placed at: {order.dateTime}</span>
              </div>
            </div>

            <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Items Summary</h3>
              <div className="divide-y divide-gray-100">
                {order.dishes.map((dish, idx) => (
                  <div key={idx} className="flex justify-between py-2.5 first:pt-0 last:pb-0 text-sm">
                    <span className="font-medium text-gray-600">{dish.name} (x{dish.quantity})</span>
                    <span className="font-bold text-gray-800">₹{dish.price * dish.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-extrabold text-gray-850 text-base">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-5 text-center">
              <span className="text-xs text-orange-850 uppercase font-bold tracking-wider block">Estimated Delivery</span>
              <span className="text-2xl font-black text-orange-950 mt-1 block">30 - 40 mins</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default OrderTracking;
