import React from 'react';
import { Chart } from 'react-google-charts';
import { Card, Typography } from '@mui/material';

const CropPlanning = () => {
  const currentYear = new Date().getFullYear();
  
  const data = [
    [
      { type: 'string', label: 'Crop' },
      { type: 'string', label: 'Task' },
      { type: 'date', label: 'Start' },
      { type: 'date', label: 'End' },
    ],
    [
      'Rice',
      'Kharif Season',
      new Date(currentYear, 5, 1), // June 1
      new Date(currentYear, 9, 30), // October 30
    ],
    [
      'Wheat',
      'Rabi Season',
      new Date(currentYear, 10, 1), // November 1
      new Date(currentYear + 1, 2, 30), // March 30
    ],
    [
      'Sugarcane',
      'Year-round',
      new Date(currentYear, 0, 1), // January 1
      new Date(currentYear, 11, 31), // December 31
    ],
  ];

  return (
    <Card sx={{ p: 2, height: '500px' }}>
      <Typography variant="h6" gutterBottom>Crop Planning</Typography>
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="Timeline"
        loader={<div>Loading Chart...</div>}
        data={data}
        options={{
          timeline: {
            showRowLabels: true,
            groupByRowLabel: true,
          },
        }}
      />
    </Card>
  );
};

export default CropPlanning;
