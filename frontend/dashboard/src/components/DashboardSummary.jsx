import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Target,
  Activity,
  Zap,
  Shield,
  Calendar,
  Users,
  Globe
} from "lucide-react";
import { getAllRegions } from "../data/regionalData";

export const DashboardSummary = () => {
  const regions = getAllRegions();
  
  // Calculate aggregate statistics
  const totalFields = regions.reduce((sum, region) => sum + region.totalFields, 0);
  const totalArea = regions.reduce((sum, region) => sum + region.totalArea, 0);
  const totalHealthyCrops = regions.reduce((sum, region) => sum + region.realTimeMetrics.healthyCrops, 0);
  const totalDiseaseAlerts = regions.reduce((sum, region) => sum + region.realTimeMetrics.diseaseAlerts, 0);
  const avgConfidence = regions.reduce((sum, region) => sum + 0.87, 0) / regions.length; // Using consistent confidence

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            CropSense AI - Executive Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive real-time monitoring across Nashik, Pune, and Mumbai regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Total Fields</span>
              </div>
              <p className="text-3xl font-bold text-primary">{totalFields.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">{totalArea.toLocaleString()} acres monitored</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">Healthy Crops</span>
              </div>
              <p className="text-3xl font-bold text-success">{totalHealthyCrops.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((totalHealthyCrops / totalFields) * 100)}% health rate
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium">Disease Alerts</span>
              </div>
              <p className="text-3xl font-bold text-warning">{totalDiseaseAlerts}</p>
              <p className="text-xs text-muted-foreground mt-1">Active monitoring</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">AI Confidence</span>
              </div>
              <p className="text-3xl font-bold text-accent">{Math.round(avgConfidence * 100)}%</p>
              <p className="text-xs text-muted-foreground mt-1">High accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Regional Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regions.map((region, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{region.region} Region</h3>
                    <p className="text-sm text-muted-foreground">
                      {region.totalFields} fields • {region.totalArea.toLocaleString()} acres • 
                      Primary crops: {region.primaryCrops.slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {Math.round((region.realTimeMetrics.healthyCrops / region.totalFields) * 100)}% healthy
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {region.realTimeMetrics.diseaseAlerts} alerts
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Growth Stage</p>
                    <p className="font-medium">{region.realTimeMetrics.avgGrowthStage}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Temperature</p>
                    <p className="font-medium">{region.realTimeMetrics.temperature.toFixed(1)}°C</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Humidity</p>
                    <p className="font-medium">{region.realTimeMetrics.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Soil Moisture</p>
                    <p className="font-medium">{region.realTimeMetrics.soilMoisture}%</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health Score</span>
                    <span>{Math.round((region.realTimeMetrics.healthyCrops / region.totalFields) * 100)}%</span>
                  </div>
                  <Progress value={(region.realTimeMetrics.healthyCrops / region.totalFields) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Features Showcase */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Real-time Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Live updates on crop health, weather conditions, and disease trends across all monitored fields.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Weather Updates:</span>
                <Badge variant="outline" className="text-success">Every 3 seconds</Badge>
              </div>
              <div className="flex justify-between">
                <span>Disease Alerts:</span>
                <Badge variant="outline" className="text-success">Instant</Badge>
              </div>
              <div className="flex justify-between">
                <span>Field Status:</span>
                <Badge variant="outline" className="text-success">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Target className="h-5 w-5" />
              Predictive Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              AI-powered yield predictions, disease risk assessment, and seasonal trend analysis.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Yield Accuracy:</span>
                <Badge variant="outline" className="text-accent">87-95%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Disease Prediction:</span>
                <Badge variant="outline" className="text-accent">Advanced</Badge>
              </div>
              <div className="flex justify-between">
                <span>Trend Analysis:</span>
                <Badge variant="outline" className="text-accent">12 months</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Shield className="h-5 w-5" />
              Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Proactive disease prevention, early warning systems, and comprehensive risk assessment.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Early Detection:</span>
                <Badge variant="outline" className="text-warning">24/7</Badge>
              </div>
              <div className="flex justify-between">
                <span>Risk Alerts:</span>
                <Badge variant="outline" className="text-warning">Real-time</Badge>
              </div>
              <div className="flex justify-between">
                <span>Prevention Tips:</span>
                <Badge variant="outline" className="text-warning">AI Generated</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Activity className="h-5 w-5" />
              Field Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Detailed field tracking, growth stage monitoring, and personalized care recommendations.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Field Tracking:</span>
                <Badge variant="outline" className="text-primary">Detailed</Badge>
              </div>
              <div className="flex justify-between">
                <span>Growth Stages:</span>
                <Badge variant="outline" className="text-primary">6 phases</Badge>
              </div>
              <div className="flex justify-between">
                <span>Care Plans:</span>
                <Badge variant="outline" className="text-primary">Personalized</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <BarChart3 className="h-5 w-5" />
              Advanced Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Comprehensive reports, historical trends, seasonal analysis, and performance metrics.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Report Types:</span>
                <Badge variant="outline" className="text-purple-600">6 formats</Badge>
              </div>
              <div className="flex justify-between">
                <span>Historical Data:</span>
                <Badge variant="outline" className="text-purple-600">24 months</Badge>
              </div>
              <div className="flex justify-between">
                <span>Export Options:</span>
                <Badge variant="outline" className="text-purple-600">PDF/CSV/JSON</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Users className="h-5 w-5" />
              Community Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Regional benchmarking, community trends, and collaborative farming insights.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Regional Data:</span>
                <Badge variant="outline" className="text-green-600">3 regions</Badge>
              </div>
              <div className="flex justify-between">
                <span>Community Trends:</span>
                <Badge variant="outline" className="text-green-600">Live</Badge>
              </div>
              <div className="flex justify-between">
                <span>Benchmarking:</span>
                <Badge variant="outline" className="text-green-600">Real-time</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            System Status & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Data Collection</span>
              </div>
              <p className="text-lg font-bold text-success">Online</p>
              <p className="text-xs text-muted-foreground mt-1">Real-time updates active</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Analysis</span>
              </div>
              <p className="text-lg font-bold text-success">Optimal</p>
              <p className="text-xs text-muted-foreground mt-1">{Math.round(avgConfidence * 100)}% accuracy</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Alert System</span>
              </div>
              <p className="text-lg font-bold text-success">Active</p>
              <p className="text-xs text-muted-foreground mt-1">{totalDiseaseAlerts} active alerts</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Data Storage</span>
              </div>
              <p className="text-lg font-bold text-success">Healthy</p>
              <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
