import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} 
  
from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} 
  
from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { mockRegionalData } from "@/data/mockRegionalData";

export default function PredictiveOutbreakMap() 
{
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [diseaseFilter, setDiseaseFilter] = useState(null);
  const [leafletReady, setLeafletReady] = useState(false);

  const mapDivRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const w = window;

    if (w.L) {
      setLeafletReady(true);
      return;
    }

    const existingScript = document.querySelector("script[data-leaflet]");

    if (existingScript) {
      existingScript.addEventListener("load", () => setLeafletReady(true));
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("data-leaflet", "true");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;

    script.onload = () => setLeafletReady(true);
    script.onerror = () => toast.error("Failed to load map library");

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    fetchOutbreakData();
  }, [timeRange, diseaseFilter]);

  const fetchOutbreakData = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke(
        "get-outbreak-data",
        {
          body: { days: parseInt(timeRange), diseaseFilter },
        }
      );

      if (error) throw error;

      const apiOutbreaks = data?.outbreaks || [];

      if (apiOutbreaks.length === 0) {
        setOutbreaks([
          {
            latitude: 18.5204,
            longitude: 73.8567,
            diseases: {
              "Leaf Rust": {
                count: 12,
                severity: "medium",
                locations: ["Pune", "PCMC"],
              },
            },
            totalCases: 12,
            avgConfidence: 0.82,
            latestDetection: new Date().toISOString(),
            riskScore: 0.62,
          },
          {
            latitude: 19.076,
            longitude: 72.8777,
            diseases: {
              "Bacterial Spot": {
                count: 18,
                severity: "high",
                locations: ["Mumbai"],
              },
            },
            totalCases: 18,
            avgConfidence: 0.88,
            latestDetection: new Date().toISOString(),
            riskScore: 0.75,
          },
          {
            latitude: 19.9975,
            longitude: 73.7898,
            diseases: {
              "Powdery Mildew": {
                count: 9,
                severity: "medium",
                locations: ["Nashik"],
              },
            },
            totalCases: 9,
            avgConfidence: 0.79,
            latestDetection: new Date().toISOString(),
            riskScore: 0.58,
          },
        ]);
      } else {
        setOutbreaks(apiOutbreaks);
      }
    } catch (error) {
      console.error("Error fetching outbreak data:", error);
      toast.error("Failed to load outbreak data");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskScore) => {
    if (riskScore >= 0.7) return "destructive";
    if (riskScore >= 0.4) return "default";
    return "secondary";
  };

  const getRiskLabel = (riskScore) => {
    if (riskScore >= 0.7) return "High Risk";
    if (riskScore >= 0.4) return "Medium Risk";
    return "Low Risk";
  };

  useEffect(() => {
    if (!leafletReady || !mapDivRef.current) return;

    const L = window.L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapDivRef.current).setView(
        [19.7515, 75.7139],
        6.5
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (!layer.getAttribution) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    outbreaks.forEach((o) => {
      const marker = L.marker([o.latitude, o.longitude]).addTo(map);

      marker.bindPopup(`
        <div style="font-size:12px;">
          <div style="font-weight:600;margin-bottom:4px;">
            Risk: ${getRiskLabel(o.riskScore)}
          </div>
          <div>Total cases: ${o.totalCases}</div>
          <div>Latest: ${new Date(o.latestDetection).toLocaleDateString()}</div>
        </div>
      `);

      L.circle([o.latitude, o.longitude], {
        radius: 15000 + o.riskScore * 20000,
        color:
          o.riskScore >= 0.7
            ? "#ef4444"
            : o.riskScore >= 0.4
            ? "#f59e0b"
            : "#22c55e",
        fillOpacity: 0.2,
      }).addTo(map);
    });
  }, [leafletReady, outbreaks]);

  const regionOutbreaks =
    mockRegionalData["Nashik"].diseaseDetection.occurrences;

  console.log("Disease occurrences in Nashik:", regionOutbreaks);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Predictive Disease Outbreak Map
              </CardTitle>
              <CardDescription>
                AI-powered analysis of disease patterns in your community
              </CardDescription>
            </div>
            <AlertTriangle className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchOutbreakData}>
              Refresh Data
            </Button>
          </div>

          <Tabs defaultValue="heatmap" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="heatmap">Outbreak Heatmap</TabsTrigger>
              <TabsTrigger value="list">Risk Zones</TabsTrigger>
            </TabsList>

            <TabsContent value="heatmap">
              {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="h-[420px] w-full rounded-lg overflow-hidden border" ref={mapDivRef} />
              )}
            </TabsContent>

            <TabsContent value="list">
              {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {outbreaks.map((outbreak, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4 flex justify-between">
                        <div>
                          <Badge variant={getRiskColor(outbreak.riskScore)}>
                            {getRiskLabel(outbreak.riskScore)}
                          </Badge>

                          <p className="text-sm mt-2">
                            Zone {idx + 1} • {outbreak.totalCases} cases
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {Object.keys(outbreak.diseases).join(", ")}
                          </p>
                        </div>

                        <div className="text-right text-xs">
                          <p>
                            {outbreak.latitude.toFixed(2)},{" "}
                            {outbreak.longitude.toFixed(2)}
                          </p>
                          <p className="text-muted-foreground">
                            {new Date(
                              outbreak.latestDetection
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">
            How Outbreak Prediction Works
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <p>
            🔍 <strong>Data Aggregation:</strong> Analyzes disease detections
            from geographic clusters
          </p>

          <p>
            📊 <strong>Risk Calculation:</strong> Combines case density,
            recency, and detection confidence
          </p>

          <p>
            🎯 <strong>Predictive Insights:</strong> Identifies high-risk zones
            before outbreaks occur
          </p>

          <p>
            🌍 <strong>Community Powered:</strong> Predictions improve with more
            users
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```
