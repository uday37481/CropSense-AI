import React, { useState } from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer';
import { Typography, Box, Card } from '@mui/material';

const FieldMapping = () => {
  const [selectedOverlay, setSelectedOverlay] = useState('moisture');
  
  // Maharashtra-specific coordinates
  const defaultPosition = [19.9615, 73.8432]; // Nashik coordinates
  
  const overlayData = {
    moisture: {
      data: [
        [19.9615, 73.8432, 65], // Nashik
        [18.5204, 73.8567, 58], // Pune
        [19.0760, 72.8777, 72], // Mumbai
      ],
      gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1: 'red' }
    },
    temperature: {
      data: [
        [19.9615, 73.8432, 32], // Nashik
        [18.5204, 73.8567, 30], // Pune
        [19.0760, 72.8777, 34], // Mumbai
      ],
      gradient: { 0.4: 'green', 0.6: 'yellow', 0.8: 'orange', 1: 'red' }
    }
  };

  return (
    <Card sx={{ p: 2, height: '500px' }}>
      <Typography variant="h6" gutterBottom>Field Mapping</Typography>
      <MapContainer 
        center={defaultPosition} 
        zoom={7} 
        style={{ height: '450px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
          <LayersControl.Overlay name="Soil Moisture">
            <HeatmapLayer
              points={overlayData.moisture.data}
              longitudeExtractor={m => m[1]}
              latitudeExtractor={m => m[0]}
              intensityExtractor={m => m[2]}
              gradient={overlayData.moisture.gradient}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Temperature">
            <HeatmapLayer
              points={overlayData.temperature.data}
              longitudeExtractor={m => m[1]}
              latitudeExtractor={m => m[0]}
              intensityExtractor={m => m[2]}
              gradient={overlayData.temperature.gradient}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </Card>
  );
};

export default FieldMapping;
