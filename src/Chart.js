import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Returns Over Time',
        data: data.map(item => item.return),
        borderColor: '#61dafb',
        backgroundColor: 'rgba(97, 218, 251, 0.2)',
        fill: true,
      }
    ]
  };

  return (
    <div>
      <h3>Returns Over Time</h3>
      <Line data={chartData} />
    </div>
  );
};

export default Chart;
