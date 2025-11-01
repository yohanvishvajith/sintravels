"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

// Declare Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

// Country type for database fetched data
interface CountryData {
  name: string;
  flagImg: string | null;
  jobs: number;
}

export function WorldMapSection() {
  const ref = useRef(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const isInView = useInView(ref, { once: true });
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [countries, setCountries] = useState<CountryData[]>([]);

  // Fetch country data and job statistics from database
  useEffect(() => {
    const fetchCountryStats = async () => {
      try {
        const response = await fetch("/api/countries/stats");
        if (response.ok) {
          const stats: CountryData[] = await response.json();
          setCountries(stats);
        }
      } catch (error) {
        console.error("Error fetching country stats:", error);
      }
    };

    fetchCountryStats();
  }, []);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return;

      // Load CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
        script.onload = () => {
          setMapLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setMapLoaded(true);
      }
    };

    loadLeaflet();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.L || mapInstanceRef.current)
      return;

    // Initialize map
    const map = window.L.map(mapRef.current).setView([20, 0], 2);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    window.L.tileLayer(
      "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        minZoom: 2,
        maxZoom: 8,
      }
    ).addTo(map);

    // Load GeoJSON World Countries
    fetch(
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
    )
      .then((res) => res.json())
      .then((data) => {
        // Check if map still exists before adding layers
        if (!mapInstanceRef.current) return;

        window.L.geoJson(data, {
          style: {
            color: "#555",
            weight: 1,
            fillColor: "#c0c0c0",
            fillOpacity: 0.7,
          },
          onEachFeature: function (feature: any, layer: any) {
            const name = feature.properties.name;

            // Hover highlight
            layer.on("mouseover", function () {
              if (!mapInstanceRef.current) return;
              layer.setStyle({ fillColor: "#0d6efd" });
              const jobCount = getJobCount(name);
              const info =
                jobCount > 0
                  ? `${name}: ${jobCount} jobs available`
                  : `${name}: Click for more info`;
              layer.bindTooltip(info, { sticky: true }).openTooltip();
            });

            // Reset on mouse out
            layer.on("mouseout", function () {
              if (!mapInstanceRef.current) return;
              layer.setStyle({ fillColor: "#c0c0c0" });
              mapInstanceRef.current.closeTooltip();
            });

            // Click to update info panel
            layer.on("click", function () {
              setSelectedCountry(name);
            });
          },
        }).addTo(map);
      })
      .catch((err) => console.error("Error loading map data:", err));

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  const selectedCountryInfo = countries.find((c) => c.name === selectedCountry);

  const getFlagImg = (name: string | null) => {
    if (!name) return null;
    const found = countries.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    return found ? found.flagImg : null;
  };

  const getJobCount = (countryName: string) => {
    const found = countries.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return found ? found.jobs : 0;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Interactive World Map
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore job opportunities across 6+ countries. Click on any country
            to see available positions.
          </p>
        </motion.div>

        <div className="relative">
          {/* Interactive World Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12"
          >
            <div className="flex flex-col lg:flex-row h-[600px]">
              {/* Map Container */}
              <div className="flex-[3] relative">
                <div
                  ref={mapRef}
                  className="w-full h-full"
                  style={{ minHeight: "400px" }}
                />
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">
                        Loading interactive map...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Panel */}
              <div className="flex-1 bg-gray-50 p-6 flex flex-col justify-center border-l-2 border-gray-200 lg:min-w-[300px]">
                {selectedCountryInfo ? (
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      {getFlagImg(selectedCountry) ? (
                        <Image
                          src={getFlagImg(selectedCountry) as string}
                          alt={`${selectedCountry} flag`}
                          width={48}
                          height={32}
                          className="rounded"
                        />
                      ) : (
                        <span className="text-2xl">{selectedCountry}</span>
                      )}
                      <h3 className="text-xl font-bold text-blue-600">
                        {selectedCountry}
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Available Jobs:</strong>{" "}
                        <span className="text-blue-600 font-semibold text-lg">
                          {selectedCountryInfo?.jobs || 0}
                        </span>
                      </p>
                      <p className="text-gray-700 mt-3">Active opportunities</p>
                    </div>
                    <Link
                      href={`/jobs?country=${encodeURIComponent(
                        selectedCountry as string
                      )}`}
                      className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Explore Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                      Click a country
                    </h3>
                    <p className="text-gray-600">
                      Select any country on the map to see job opportunities and
                      details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Country Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {countries.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedCountry(country.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">
                    {country.flagImg && (
                      <Image
                        src={country.flagImg}
                        alt={`${country.name} flag`}
                        width={32}
                        height={24}
                        className="inline-block rounded object-cover"
                      />
                    )}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {country.jobs} jobs
                  </Badge>
                </div>
                <h4 className="font-semibold text-gray-900">{country.name}</h4>
                <p className="text-sm text-gray-600">Active opportunities</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
