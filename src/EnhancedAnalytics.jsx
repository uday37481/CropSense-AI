import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Activity,
  PieChart,
  LineChart,
  Download,
  RefreshCw
} from "lucide-react";

import { getAllRegions } from "@/data/regionalData";

export const EnhancedAnalytics = () => {

  const [selectedRegion, setSelectedRegion] = useState("All");
  const [timeRange, setTimeRange] = useState("12");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const regions = getAllRegions();

  useEffect(() => {
    generateAnalyticsData();
  }, [selectedRegion, timeRange]);

  const generateAnalyticsData = () => {
    setLoading(true);

    setTimeout(() => {

      const data = {
        totalDetections: selectedRegion === "All" ? 2847 : 1247,
        healthyPercentage: selectedRegion === "All" ? 78.5 : 87.2,
        diseasePercentage: selectedRegion === "All" ? 21.5 : 12.8,
        avgConfidence: selectedRegion === "All" ? 0.87 : 0.89,

        regionalComparison: [
          { region: "Nashik", detections: 1247, healthy: 1089, diseases: 158, confidence: 0.89 },
          { region: "Pune", detections: 892, healthy: 756, diseases: 136, confidence: 0.85 },
          { region: "Mumbai", detections: 708, healthy: 578, diseases: 130, confidence: 0.82 }
        ],

        monthlyTrends: generateMonthlyTrends(),
        diseaseDistribution: generateDiseaseDistribution(),
        cropPerformance: generateCropPerformance(),
        seasonalAnalysis: generateSeasonalAnalysis(),
        predictiveInsights: generatePredictiveInsights()
      };

      setAnalyticsData(data);
      setLoading(false);

    }, 1000);
  };

  const generateMonthlyTrends = () => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    return months.map(month => ({
      month,
      detections: Math.floor(Math.random() * 200) + 150,
      healthy: Math.floor(Math.random() * 150) + 100,
      diseases: Math.floor(Math.random() * 50) + 20,
      confidence: Math.random() * 0.2 + 0.8
    }));
  };

  const generateDiseaseDistribution = () => {

    const diseases = [
      { name: "Powdery Mildew", trend: "up" },
      { name: "Bacterial Spot", trend: "down" },
      { name: "Leaf Rust", trend: "stable" },
      { name: "Anthracnose", trend: "up" },
      { name: "Downy Mildew", trend: "down" },
      { name: "Mosaic Virus", trend: "stable" }
    ];

    return diseases.map(d => ({
      disease: d.name,
      count: Math.floor(Math.random() * 100) + 20,
      percentage: Math.floor(Math.random() * 20) + 5,
      trend: d.trend
    }));
  };

  const generateCropPerformance = () => {

    const crops = [
      { name: "Grapes", quality: "Premium" },
      { name: "Onions", quality: "Good" },
      { name: "Tomatoes", quality: "Excellent" },
      { name: "Sugarcane", quality: "Good" },
      { name: "Wheat", quality: "Fair" },
      { name: "Rice", quality: "Excellent" }
    ];

    return crops.map(crop => ({
      crop: crop.name,
      yield: Math.random() * 50 + 20,
      quality: crop.quality,
      diseaseResistance: Math.floor(Math.random() * 30) + 70
    }));
  };

  const generateSeasonalAnalysis = () => {
    return [
      { season: "Rabi", avgYield: 85, diseaseIncidence: 15, weatherImpact: "Favorable" },
      { season: "Kharif", avgYield: 78, diseaseIncidence: 22, weatherImpact: "Challenging" },
      { season: "Summer", avgYield: 82, diseaseIncidence: 12, weatherImpact: "Moderate" }
    ];
  };

  const generatePredictiveInsights = () => {

    return [
      {
        category: "Disease Risk",
        prediction: "Increased powdery mildew risk in grape vineyards due to high humidity",
        confidence: 87,
        impact: "negative",
        timeframe: "Next 2 weeks"
      },
      {
        category: "Yield Forecast",
        prediction: "Above-average yields expected for onion crops in Nashik region",
        confidence: 92,
        impact: "positive",
        timeframe: "Next harvest season"
      },
      {
        category: "Weather Impact",
        prediction: "Moderate rainfall expected to improve soil moisture levels",
        confidence: 78,
        impact: "positive",
        timeframe: "Next 7 days"
      },
      {
        category: "Market Trends",
        prediction: "Stable prices expected for vegetable crops in Mumbai region",
        confidence: 85,
        impact: "neutral",
        timeframe: "Next month"
      }
    ];
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-destructive" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-success" />;
      default:
        return <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const exportReport = () => {
    console.log("Exporting analytics report...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Enhanced Analytics Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive analysis and predictive insights for crop management
          </CardDescription>
        </CardHeader>
      </Card>

    </div>
  );
};
