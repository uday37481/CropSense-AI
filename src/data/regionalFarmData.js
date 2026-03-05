// Mock data for Field Mapping, Crop Planning, and Yield Tracking

const regionalFarmData = {
  Nashik: {
    fields: [
      { id: '1', name: 'Field A', area: 10, soil_type: 'Loam', irrigation_type: 'Drip Irrigation', coordinates: [19.9975, 73.7898], notes: 'Optimal for grapes' },
      { id: '2', name: 'Field B', area: 15, soil_type: 'Clay', irrigation_type: 'Sprinkler System', coordinates: [19.9976, 73.7899], notes: 'Suitable for onions' },
    ],
    cropPlans: [
      { id: '1', field_id: '1', crop_type: 'Grapes', variety: 'Thompson Seedless', planting_date: '2025-01-15', expected_harvest_date: '2025-06-15', status: 'growing', yield_target: 5000, notes: 'Monitor for powdery mildew' },
      { id: '2', field_id: '2', crop_type: 'Onions', variety: 'Red Onion', planting_date: '2025-02-10', expected_harvest_date: '2025-07-10', status: 'planned', yield_target: 8000, notes: 'Ensure adequate water supply' },
    ],
    yieldData: [
      { id: '1', crop_type: 'Grapes', variety: 'Thompson Seedless', planting_date: '2025-01-15', actual_harvest_date: '2025-06-10', yield_target: 5000, actual_yield: 4800, status: 'harvested', field: { name: 'Field A', area: 10 } },
    ],
  },

  Pune: {
    fields: [
      { id: '3', name: 'Field C', area: 12, soil_type: 'Sandy Loam', irrigation_type: 'Flood Irrigation', coordinates: [18.5204, 73.8567], notes: 'Ideal for sugarcane' },
    ],
    cropPlans: [
      { id: '3', field_id: '3', crop_type: 'Sugarcane', variety: 'Co 86032', planting_date: '2025-03-01', expected_harvest_date: '2026-02-28', status: 'planted', yield_target: 12000, notes: 'Regular pest control needed' },
    ],
    yieldData: [
      { id: '2', crop_type: 'Sugarcane', variety: 'Co 86032', planting_date: '2025-03-01', actual_harvest_date: '', yield_target: 12000, actual_yield: 0, status: 'growing', field: { name: 'Field C', area: 12 } },
    ],
  },

  Mumbai: {
    fields: [
      { id: '4', name: 'Field D', area: 8, soil_type: 'Silt', irrigation_type: 'Rain Fed', coordinates: [19.0760, 72.8777], notes: 'Good for rice' },
    ],
    cropPlans: [
      { id: '4', field_id: '4', crop_type: 'Rice', variety: 'Basmati', planting_date: '2025-06-01', expected_harvest_date: '2025-11-01', status: 'planned', yield_target: 7000, notes: 'Monitor rainfall' },
    ],
    yieldData: [
      { id: '3', crop_type: 'Rice', variety: 'Basmati', planting_date: '2025-06-01', actual_harvest_date: '', yield_target: 7000, actual_yield: 0, status: 'planned', field: { name: 'Field D', area: 8 } },
    ],
  },
};

export default regionalFarmData;
