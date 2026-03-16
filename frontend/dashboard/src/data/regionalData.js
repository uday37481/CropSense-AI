export const getAllRegions = () => [
  {
    region: 'Nashik',
    totalFields: 120,
    totalArea: 600,
    primaryCrops: ['Grapes', 'Onions', 'Tomatoes'],
    realTimeMetrics: {
      healthyCrops: 110,
      diseaseAlerts: 5,
      avgGrowthStage: 'Flowering',
      temperature: 28.5,
      humidity: 65,
      soilMoisture: 55,
    },
  },
  {
    region: 'Pune',
    totalFields: 150,
    totalArea: 750,
    primaryCrops: ['Sugarcane', 'Jowar', 'Bajra'],
    realTimeMetrics: {
      healthyCrops: 140,
      diseaseAlerts: 8,
      avgGrowthStage: 'Vegetative',
      temperature: 30.2,
      humidity: 60,
      soilMoisture: 50,
    },
  },
  {
    region: 'Mumbai',
    totalFields: 80,
    totalArea: 400,
    primaryCrops: ['Rice', 'Mangoes', 'Coconuts'],
    realTimeMetrics: {
      healthyCrops: 75,
      diseaseAlerts: 2,
      avgGrowthStage: 'Harvesting',
      temperature: 32.1,
      humidity: 75,
      soilMoisture: 65,
    },
  },
];
