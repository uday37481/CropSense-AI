import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Eye
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { ShareAnalyticsDashboard } from "./ShareAnalyticsDashboard";
import { SocialPostScheduler } from "./SocialPostScheduler";
import PredictiveOutbreakMap from "./PredictiveOutbreakMap";
import { RegionalDashboard } from "./RegionalDashboard";
import { EnhancedAnalytics } from "./EnhancedAnalytics";
import { DashboardSummary } from "./DashboardSummary";

export const CropDashboard = () => {

  const [stats, setStats] = useState({
    totalAnalyses: 0,
    healthyCount: 0,
    diseaseCount: 0,
    confidenceAvg: 0,
    recentDetections: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState(null);

  const mockFields = [
    { name: "North Field", lat: 19.07, lng: 72.88, stage: "Tillering", lastScan: "2025-10-14T09:30:00Z", status: "Healthy" },
    { name: "South Field", lat: 18.52, lng: 73.85, stage: "Vegetative", lastScan: "2025-10-13T16:05:00Z", status: "Watch" },
    { name: "East Orchard", lat: 19.22, lng: 73.16, stage: "Fruiting", lastScan: "2025-10-12T11:10:00Z", status: "Action" }
  ];

  const hotspotRegions = [
    { region: "Pune District", lat: 18.52, lng: 73.86, risk: 0.68 },
    { region: "Nashik Plains", lat: 19.99, lng: 73.78, risk: 0.74 },
    { region: "Konkan Coast", lat: 16.99, lng: 73.31, risk: 0.42 }
  ];

  useEffect(() => {

    let channel = null;

    const init = async () => {

      await loadDashboardData();

      const onRefresh = () => loadDashboardData();
      window.addEventListener("dashboard:refresh", onRefresh);

      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user?.id;

      if (uid) {

        channel = supabase
          .channel("dashboard-updates")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "crop_detections",
              filter: `user_id=eq.${uid}`
            },
            () => loadDashboardData()
          )
          .subscribe();
      }

      return () => {
        if (channel) supabase.removeChannel(channel);
        window.removeEventListener("dashboard:refresh", onRefresh);
      };
    };

    const cleanupPromise = init();

    return () => {
      cleanupPromise
        .then((cleanup) => {
          if (typeof cleanup === "function") cleanup();
          else if (channel) supabase.removeChannel(channel);
        })
        .catch(() => {
          if (channel) supabase.removeChannel(channel);
        });
    };

  }, []);

  const loadDashboardData = async () => {

    try {

      const { data: session } = await supabase.auth.getSession();

      if (!session.session?.user) return;

      const { data: detections, error } = await supabase
        .from("crop_detections")
        .select("*")
        .eq("user_id", session.session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const totalAnalyses = detections?.length || 0;

      const healthyCount =
        detections?.filter((d) =>
          (d.disease_name || "").toLowerCase().includes("healthy")
        ).length || 0;

      const diseaseCount = totalAnalyses - healthyCount;

      const confidenceAvg =
        totalAnalyses > 0
          ? detections.reduce((sum, d) => sum + Number(d.confidence ?? 0), 0) /
            totalAnalyses
          : 0;

      setStats({
        totalAnalyses,
        healthyCount,
        diseaseCount,
        confidenceAvg,
        recentDetections: detections || []
      });

    } catch (error) {

      console.error(error);
      toast.error("Failed to load dashboard data");

    } finally {

      setIsLoading(false);

    }

  };

  const getSeverityColor = (severity) => {

    switch (severity?.toLowerCase()) {

      case "low":
        return "text-success";

      case "medium":
        return "text-warning";

      case "high":
        return "text-destructive";

      default:
        return "text-muted-foreground";
    }
  };

  const formatDate = (dateString) => {

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  };

  if (isLoading) {

    return (
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">

          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>

          <p>Loading your crop dashboard...</p>

        </div>
      </section>
    );

  }

  return (

    <section className="py-16">

      <div className="container mx-auto px-6">

        <div className="flex items-center justify-between mb-12">

          <div>

            <h2 className="text-4xl font-bold mb-2">
              Your Crop Dashboard
            </h2>

            <p className="text-muted-foreground">
              Track crop health and disease detection insights
            </p>

          </div>

          <Button
            onClick={loadDashboardData}
            disabled={isLoading}
            variant="outline"
          >
            Refresh Data
          </Button>

        </div>

        {/* Stats Cards */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <Card className="p-6">

            <div className="flex justify-between">

              <h3>Total Analyses</h3>

              <BarChart3 size={18} />

            </div>

            <p className="text-3xl font-bold text-primary">
              {stats.totalAnalyses}
            </p>

          </Card>

          <Card className="p-6">

            <div className="flex justify-between">

              <h3>Healthy Crops</h3>

              <CheckCircle size={18} className="text-green-500" />

            </div>

            <p className="text-3xl font-bold text-green-600">
              {stats.healthyCount}
            </p>

          </Card>

          <Card className="p-6">

            <div className="flex justify-between">

              <h3>Disease Alerts</h3>

              <AlertTriangle size={18} className="text-yellow-500" />

            </div>

            <p className="text-3xl font-bold text-yellow-600">
              {stats.diseaseCount}
            </p>

          </Card>

          <Card className="p-6">

            <div className="flex justify-between">

              <h3>AI Confidence</h3>

              <TrendingUp size={18} />

            </div>

            <p className="text-3xl font-bold">
              {Math.round(stats.confidenceAvg * 100)}%
            </p>

          </Card>

        </div>

        {/* Tabs */}

        <Tabs defaultValue="summary">

          <TabsList className="grid grid-cols-5 w-full">

            <TabsTrigger value="summary">Summary</TabsTrigger>

            <TabsTrigger value="recent">Recent</TabsTrigger>

            <TabsTrigger value="regional">Regional</TabsTrigger>

            <TabsTrigger value="outbreaks">Outbreak Map</TabsTrigger>

            <TabsTrigger value="analytics">Analytics</TabsTrigger>

          </TabsList>

          <TabsContent value="summary">
            <DashboardSummary />
          </TabsContent>

          <TabsContent value="recent">

            <Card className="p-6">

              <h3 className="text-lg font-semibold mb-4">
                Recent Disease Detection
              </h3>

              {stats.recentDetections.length === 0 ? (

                <div className="text-center py-8 text-muted-foreground">

                  <Eye size={40} className="mx-auto mb-4 opacity-50" />

                  <p>No analyses yet</p>

                </div>

              ) : (

                <div className="space-y-3">

                  {stats.recentDetections.map((detection, index) => (

                    <div
                      key={detection.id}
                      className="flex justify-between p-4 border rounded-lg"
                    >

                      <div>

                        <h4 className="font-medium">
                          {detection.disease_name}
                        </h4>

                        <p className="text-sm text-muted-foreground">
                          {formatDate(detection.created_at)}
                        </p>

                      </div>

                      <Badge
                        variant="outline"
                        className={getSeverityColor(detection.severity)}
                      >
                        {detection.severity}
                      </Badge>

                    </div>

                  ))}

                </div>

              )}

            </Card>

          </TabsContent>

          <TabsContent value="regional">
            <RegionalDashboard />
          </TabsContent>

          <TabsContent value="outbreaks">
            <PredictiveOutbreakMap />
          </TabsContent>

          <TabsContent value="analytics">
            <EnhancedAnalytics />
          </TabsContent>

        </Tabs>

        <div className="mt-10">

          <ShareAnalyticsDashboard />

          <SocialPostScheduler />

        </div>

      </div>

    </section>

  );
};
