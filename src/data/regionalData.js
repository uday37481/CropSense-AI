// Comprehensive regional data for Nashik, Pune, and Mumbai

// Nashik Region Data
export const nashikData = {
  region: "Nashik",
  coordinates: { lat: 19.9975, lng: 73.7898 },
  totalFields: 1247,
  totalArea: 15680,
  primaryCrops: ["Grapes", "Onions", "Tomatoes", "Pomegranates", "Sugarcane"],

  seasonalData: [
    {
      season: "Rabi",
      crops: ["Wheat", "Onions", "Tomatoes"],
      avgYield: 85,
      diseaseIncidence: 12,
      weatherConditions: "Mild and dry"
    },
    {
      season: "Kharif",
      crops: ["Sugarcane", "Cotton", "Pulses"],
      avgYield: 78,
      diseaseIncidence: 18,
      weatherConditions: "Hot and humid"
    },
    {
      season: "Summer",
      crops: ["Grapes", "Pomegranates", "Vegetables"],
      avgYield: 92,
      diseaseIncidence: 8,
      weatherConditions: "Hot and dry"
    }
  ],

  realTimeMetrics: {
    healthyCrops: 1089,
    diseaseAlerts: 23,
    avgGrowthStage: "Fruiting",
    soilMoisture: 68,
    temperature: 32.5,
    humidity: 65,
    windSpeed: 8.2,
    lastUpdate: new Date().toISOString()
  },

  diseaseTrends: [
    {
      disease: "Powdery Mildew",
      currentCases: 8,
      trend: "increasing",
      severity: "medium",
      affectedArea: 450
    },
    {
      disease: "Anthracnose",
      currentCases: 5,
      trend: "stable",
      severity: "low",
      affectedArea: 280
    },
    {
      disease: "Bacterial Spot",
      currentCases: 10,
      trend: "decreasing",
      severity: "high",
      affectedArea: 620
    }
  ],

  yieldPredictions: [
    {
      crop: "Grapes",
      predictedYield: 28.5,
      confidence: 87,
      factors: [
        "Optimal weather",
        "Good soil moisture",
        "Effective pest control"
      ]
    },
    {
      crop: "Onions",
      predictedYield: 22.8,
      confidence: 92,
      factors: [
        "Favorable temperature",
        "Adequate irrigation",
        "Disease-free conditions"
      ]
    }
  ],

  historicalTrends: [
    { month: "Jan", detections: 156, healthy: 142, diseases: 14, avgConfidence: 0.87 },
    { month: "Feb", detections: 189, healthy: 167, diseases: 22, avgConfidence: 0.89 },
    { month: "Mar", detections: 234, healthy: 198, diseases: 36, avgConfidence: 0.85 }
  ],

  farmInsights: {
    topPerformingFields: [
      "Nashik Vineyard A",
      "Onion Farm B",
      "Mixed Crop Field C"
    ],

    areasNeedingAttention: [
      "Southern Grapes Block",
      "Tomato Field 3",
      "Pomegranate Orchard D"
    ],

    recommendations: [
      "Increase irrigation in grape vineyards during fruiting stage",
      "Apply preventive fungicide for powdery mildew",
      "Monitor soil pH levels in tomato fields"
    ],

    riskFactors: [
      "High humidity in grape growing areas",
      "Irregular rainfall patterns",
      "Pest pressure in pomegranate orchards"
    ]
  }
};

// Pune Region Data
export const puneData = {
  region: "Pune",
  coordinates: { lat: 18.5204, lng: 73.8567 },
  totalFields: 892,
  totalArea: 11250,
  primaryCrops: ["Sugarcane", "Wheat", "Pulses", "Vegetables", "Flowers"],

  realTimeMetrics: {
    healthyCrops: 756,
    diseaseAlerts: 18,
    avgGrowthStage: "Vegetative",
    soilMoisture: 72,
    temperature: 29.8,
    humidity: 58,
    windSpeed: 6.5,
    lastUpdate: new Date().toISOString()
  }
};

// Mumbai Region Data
export const mumbaiData = {
  region: "Mumbai",
  coordinates: { lat: 19.0760, lng: 72.8777 },
  totalFields: 456,
  totalArea: 3420,
  primaryCrops: ["Rice", "Vegetables", "Coconut", "Mangoes", "Flowers"],

  realTimeMetrics: {
    healthyCrops: 378,
    diseaseAlerts: 12,
    avgGrowthStage: "Flowering",
    soilMoisture: 75,
    temperature: 31.2,
    humidity: 78,
    windSpeed: 12.8,
    lastUpdate: new Date().toISOString()
  }
};

// Field Data
export const detailedFieldData = [
  {
    id: "nashik_001",
    name: "Nashik Vineyard A",
    region: "Nashik",
    coordinates: { lat: 19.9985, lng: 73.7908 },
    area: 45,
    cropType: "Grapes",
    variety: "Thompson Seedless",
    plantingDate: "2024-02-15",
    expectedHarvest: "2024-12-20",
    growthStage: "Fruiting",
    healthScore: 92,
    soilType: "Black Cotton Soil",
    irrigationType: "Drip Irrigation",
    lastInspection: "2024-10-15T08:30:00Z",

    currentConditions: {
      soilMoisture: 72,
      leafHealth: 95,
      pestActivity: 15,
      nutrientLevel: 88
    },

    nextActions: [
      "Monitor fruit development",
      "Prepare for harvest",
      "Check irrigation system"
    ],

    riskLevel: "low"
  }
];

// Region map
export const regionalDataMap = {
  Nashik: nashikData,
  Pune: puneData,
  Mumbai: mumbaiData
};

// Get all regions
export const getAllRegions = () => {
  return [nashikData, puneData, mumbaiData];
};

// Get regional data
export const getRegionalData = (region) => {
  return regionalDataMap[region] || null;
};

// Get fields by region
export const getFieldsByRegion = (region) => {
  return detailedFieldData.filter(field => field.region === region);
};
