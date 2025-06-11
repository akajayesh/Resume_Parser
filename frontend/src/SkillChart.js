// frontend/src/SkillChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SkillChart({ skills }) {
  if (!skills || skills.length === 0) return null;

  const data = {
    labels: skills,
    datasets: [
      {
        label: 'Skill Presence',
        data: skills.map(() => 1),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Skills Detected from Resume' },
    },
    scales: {
      x: { display: false, max: 1 },
    },
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default SkillChart;
