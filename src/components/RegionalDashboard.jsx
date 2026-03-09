import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  BarChart3,
  Target,
  Shield,
  Zap
} from "lucide-react";

import { getAllRegions, getFieldsByRegion } from "@/data/regionalData";
import { mockRegionalData } from "@/data/mockRegionalData";
import { DashboardWidgets } from "./DashboardWidgets";

export const RegionalDashboard = () => {

  const [selectedRegion, setSelectedRegion] = useState("Nashik");
  const [regionalData, setRegionalData] = useState(null);
  const [fieldData, setFieldData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  const regions = getAllRegions();

  useEffect(() => {
    const data = mockRegionalData[selectedRegion];
    const fields = getFieldsByRegion(selectedRegion);

    setRegionalData(data);
    setFieldData(fields);
    setLastUpdate(new Date());
  }, [selectedRegion]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {

      setLastUpdate(new Date());

      if (regionalData) {
        const updatedData = {
          ...regionalData,
          realTimeMetrics: {
            ...regionalData.realTimeMetrics,
            temperature:
              regionalData.realTimeMetrics.temperature + (Math.random() - 0.5) * 0.5,
            humidity: Math.max(
              0,
              Math.min(
                100,
                regionalData.realTimeMetrics.humidity + (Math.random() - 0.5) * 2
              )
            ),
            windSpeed: Math.max(
              0,
              regionalData.realTimeMetrics.windSpeed + (Math.random() - 0.5) * 0.5
            ),
            lastUpdate: new Date().toISOString()
          }
        };

        setRegionalData(updatedData);
      }

    }, 5000);

    return () => clearInterval(interval);

  }, [isLive, regionalData]);

  const getTrendIcon = (trend) => {

    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-destructive" />;

      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-success" />;

      default:
        return <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>;
    }

  };

  const getSeverityColor = (severity) => {

    switch (severity) {

      case "low":
        return "text-success border-success/40";

      case "medium":
        return "text-warning border-warning/40";

      case "high":
        return "text-destructive border-destructive/40";

      default:
        return "text-muted-foreground border-muted-foreground/40";

    }

  };

  const getRiskColor = (risk) => {

    switch (risk) {

      case "low":
        return "bg-success/10 text-success border-success/20";

      case "medium":
        return "bg-warning/10 text-warning border-warning/20";

      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";

      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";

    }

  };

  if (!regionalData) {

    return (
      <div className="flex items-center justify-center h-64">

        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>

      </div>
    );

  }

  return (

    <div className="space-y-6">

      <Card>

        <CardHeader>

          <div className="flex items-center justify-between">

            <div>

              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Regional Dashboard - {selectedRegion}
              </CardTitle>

              <CardDescription>
                Real-time monitoring and analytics for {selectedRegion} region
              </CardDescription>

            </div>

            <div className="flex items-center gap-4">

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>

                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>

                <SelectContent>

                  {regions.map((region) => (

                    <SelectItem key={region.region} value={region.region}>
                      {region.region}
                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

              <div className="flex items-center gap-2">

                <div
                  className={`w-2 h-2 rounded-full ${
                    isLive ? "bg-success animate-pulse" : "bg-muted"
                  }`}
                ></div>

                <span className="text-sm text-muted-foreground">
                  {isLive ? "Live" : "Paused"} • {lastUpdate.toLocaleTimeString()}
                </span>

              </div>

            </div>

          </div>

        </CardHeader>

      </Card>

      {/* Metrics */}

      <div className="grid md:grid-cols-4 gap-6">

        <Card className="p-6">

          <div className="flex items-center justify-between mb-2">

            <h3 className="text-sm font-medium text-muted-foreground">
              Total Fields
            </h3>

            <MapPin className="w-4 h-4 text-muted-foreground" />

          </div>

          <p className="text-3xl font-bold text-primary">
            {regionalData.totalFields}
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            {regionalData.totalArea.toLocaleString()} acres
          </p>

        </Card>

        <Card className="p-6">

          <div className="flex items-center justify-between mb-2">

            <h3 className="text-sm font-medium text-muted-foreground">
              Healthy Crops
            </h3>

            <CheckCircle className="w-4 h-4 text-success" />

          </div>

          <p className="text-3xl font-bold text-success">
            {regionalData.realTimeMetrics.healthyCrops}
          </p>

        </Card>

        <Card className="p-6">

          <div className="flex items-center justify-between mb-2">

            <h3 className="text-sm font-medium text-muted-foreground">
              Disease Alerts
            </h3>

            <AlertTriangle className="w-4 h-4 text-warning" />

          </div>

          <p className="text-3xl font-bold text-warning">
            {regionalData.realTimeMetrics.diseaseAlerts}
          </p>

        </Card>

        <Card className="p-6">

          <div className="flex items-center justify-between mb-2">

            <h3 className="text-sm font-medium text-muted-foreground">
              Avg Growth Stage
            </h3>

            <Activity className="w-4 h-4 text-accent" />

          </div>

          <p className="text-2xl font-bold text-accent">
            {regionalData.realTimeMetrics.avgGrowthStage}
          </p>

        </Card>

      </div>

      <DashboardWidgets region={selectedRegion} />

    </div>

  );

};

