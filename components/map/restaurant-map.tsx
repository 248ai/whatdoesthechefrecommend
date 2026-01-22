"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface RestaurantFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
    claimed: boolean;
    chef_dish: string | null;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: RestaurantFeature[];
}

interface RestaurantMapProps {
  onRestaurantSelect?: (restaurant: RestaurantFeature["properties"] | null) => void;
  selectedRestaurantId?: string | null;
  searchResults?: RestaurantFeature["properties"][];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Default center on Seattle (sample data location)
const DEFAULT_CENTER: [number, number] = [-122.3321, 47.6062];
const DEFAULT_ZOOM = 11;

// Helper to safely create popup content using DOM methods (avoids XSS)
function createPopupContent(props: RestaurantFeature["properties"]): HTMLElement {
  const container = document.createElement("div");
  container.className = "p-2";

  const title = document.createElement("h3");
  title.className = "font-semibold text-charcoal text-sm mb-1";
  title.textContent = props.name;
  container.appendChild(title);

  if (props.chef_dish) {
    const dish = document.createElement("p");
    dish.className = "text-xs text-warm-gray mb-2";
    dish.textContent = `"${props.chef_dish}"`;
    container.appendChild(dish);
  }

  const link = document.createElement("a");
  const citySlug = props.city.toLowerCase().replace(/\s+/g, "-");
  link.href = `/${citySlug}/${props.slug}`;
  link.className = "text-xs text-terracotta hover:underline font-medium";
  link.textContent = "View details →";
  container.appendChild(link);

  return container;
}

export default function RestaurantMap({
  onRestaurantSelect,
  selectedRestaurantId,
  searchResults,
}: RestaurantMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (!MAPBOX_TOKEN) {
      setError("Mapbox token not configured. Add NEXT_PUBLIC_MAPBOX_TOKEN to your environment.");
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );

    // Add geolocation control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
        showUserHeading: false,
      }),
      "bottom-right"
    );

    // Add attribution in bottom-left (compact)
    map.current.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-left"
    );

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Load restaurant data and set up clustering
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const loadData = async () => {
      try {
        const response = await fetch("/api/restaurants");
        const geojson: GeoJSONData = await response.json();

        if (map.current?.getSource("restaurants")) {
          (map.current.getSource("restaurants") as mapboxgl.GeoJSONSource).setData(geojson);
          return;
        }

        // Add source with clustering
        map.current?.addSource("restaurants", {
          type: "geojson",
          data: geojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        // Cluster circles
        map.current?.addLayer({
          id: "clusters",
          type: "circle",
          source: "restaurants",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#7D9B76", // sage for small clusters
              10,
              "#C65D3B", // terracotta for medium
              30,
              "#2D2926", // charcoal for large
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              10,
              25,
              30,
              30,
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        // Cluster count labels
        map.current?.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "restaurants",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#ffffff",
          },
        });

        // Individual restaurant points
        map.current?.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "restaurants",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": [
              "case",
              ["get", "claimed"],
              "#7D9B76", // sage for verified
              "#C65D3B", // terracotta for unclaimed
            ],
            "circle-radius": 10,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        // Click on cluster to zoom
        map.current?.on("click", "clusters", (e) => {
          const features = map.current?.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          if (!features?.length) return;

          const clusterId = features[0].properties?.cluster_id;
          const source = map.current?.getSource("restaurants") as mapboxgl.GeoJSONSource;

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || !map.current) return;
            const geometry = features[0].geometry as GeoJSON.Point;

            map.current.easeTo({
              center: geometry.coordinates as [number, number],
              zoom: zoom ?? 14,
            });
          });
        });

        // Click on individual point to show popup
        map.current?.on("click", "unclustered-point", (e) => {
          if (!e.features?.length) return;
          const feature = e.features[0] as unknown as RestaurantFeature;
          const coordinates = feature.geometry.coordinates.slice() as [number, number];
          const props = feature.properties;

          // Close existing popup
          popup.current?.remove();

          // Create popup content using safe DOM methods
          const popupContent = createPopupContent(props);

          popup.current = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            maxWidth: "240px",
            offset: 15,
          })
            .setLngLat(coordinates)
            .setDOMContent(popupContent)
            .addTo(map.current!);

          onRestaurantSelect?.(props);
        });

        // Change cursor on hover
        map.current?.on("mouseenter", "clusters", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        map.current?.on("mouseleave", "clusters", () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });
        map.current?.on("mouseenter", "unclustered-point", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        map.current?.on("mouseleave", "unclustered-point", () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });

        // Close popup when clicking elsewhere
        map.current?.on("click", (e) => {
          const features = map.current?.queryRenderedFeatures(e.point, {
            layers: ["unclustered-point", "clusters"],
          });
          if (!features?.length) {
            popup.current?.remove();
            onRestaurantSelect?.(null);
          }
        });
      } catch (err) {
        console.error("Error loading restaurant data:", err);
        setError("Failed to load restaurant data");
      }
    };

    loadData();
  }, [mapLoaded, onRestaurantSelect]);

  // Listen for custom events from parent to control map
  useEffect(() => {
    const container = mapContainer.current?.parentElement;
    if (!container || !map.current) return;

    const handleFlyTo = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.lng && detail?.lat) {
        map.current?.flyTo({
          center: [detail.lng, detail.lat],
          zoom: detail.zoom || 15,
          duration: 1500,
        });
      }
    };

    const handleFitBounds = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.results?.length) {
        const coords = detail.results
          .filter((r: { latitude?: number; longitude?: number }) => r.latitude && r.longitude)
          .map((r: { longitude: number; latitude: number }) => [r.longitude, r.latitude] as [number, number]);

        if (coords.length === 1) {
          // Single result - fly to it
          map.current?.flyTo({
            center: coords[0],
            zoom: 15,
            duration: 1500,
          });
        } else if (coords.length > 1) {
          // Multiple results - fit bounds
          const bounds = coords.reduce(
            (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => bounds.extend(coord),
            new mapboxgl.LngLatBounds(coords[0], coords[0])
          );
          map.current?.fitBounds(bounds, {
            padding: 100,
            duration: 1500,
          });
        }
      }
    };

    container.addEventListener("flyTo", handleFlyTo);
    container.addEventListener("fitBounds", handleFitBounds);

    return () => {
      container.removeEventListener("flyTo", handleFlyTo);
      container.removeEventListener("fitBounds", handleFitBounds);
    };
  }, [mapLoaded]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cream">
        <div className="text-center p-8">
          <p className="text-warm-gray mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please check your environment configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-full">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream/80">
          <div className="flex items-center gap-2 text-warm-gray">
            <div className="w-4 h-4 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
            <span>Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
}
