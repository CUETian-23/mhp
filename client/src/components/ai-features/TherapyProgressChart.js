import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TherapyProgressChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="therapy-progress placeholder">
        <p>No progress data available</p>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: `Week ${index + 1}`,
    mood: item.moodScore || 0,
    anxiety: item.anxietyScore || 0,
  }));

  return (
    <div className="therapy-progress">
      <div className="progress-header">
        <h3>Therapy Progress</h3>
        <p>Track your mental wellness journey over time</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#22c55e"
            strokeWidth={2}
            name="Mood Score"
          />
          <Line
            type="monotone"
            dataKey="anxiety"
            stroke="#ef4444"
            strokeWidth={2}
            name="Anxiety Level"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="progress-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#22c55e' }} />
          <span>Mood Score</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }} />
          <span>Anxiety Level</span>
        </div>
      </div>
    </div>
  );
};

export default TherapyProgressChart;
