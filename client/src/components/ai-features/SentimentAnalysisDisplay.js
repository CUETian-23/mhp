import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SentimentAnalysisDisplay = ({ sentimentData }) => {
  if (!sentimentData) {
    return (
      <div className="sentiment-display placeholder">
        <p>No sentiment data available</p>
      </div>
    );
  }

  const { score, label, confidence } = sentimentData;

  const getSentimentColor = (label) => {
    switch (label) {
      case 'very-positive':
        return '#22c55e';
      case 'positive':
        return '#84cc16';
      case 'neutral':
        return '#eab308';
      case 'negative':
        return '#f97316';
      case 'very-negative':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSentimentIcon = (label) => {
    if (label.includes('positive')) return <TrendingUp size={24} />;
    if (label.includes('negative')) return <TrendingDown size={24} />;
    return <Minus size={24} />;
  };

  const color = getSentimentColor(label);
  const icon = getSentimentIcon(label);

  return (
    <div className="sentiment-display">
      <div className="sentiment-header">
        <div className="sentiment-icon" style={{ color }}>
          {icon}
        </div>
        <h3>Sentiment Analysis</h3>
      </div>

      <div className="sentiment-score">
        <div className="score-label">Sentiment Score</div>
        <div className="score-value" style={{ color }}>
          {score.toFixed(2)}
        </div>
      </div>

      <div className="sentiment-label">
        <span className="label-badge" style={{ backgroundColor: color }}>
          {label.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="sentiment-confidence">
        <span>Confidence: {(confidence * 100).toFixed(1)}%</span>
      </div>

      <div className="sentiment-bar">
        <div className="bar-track">
          <div
            className="bar-fill"
            style={{
              width: `${((score + 5) / 10) * 100}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <div className="bar-labels">
          <span>Very Negative</span>
          <span>Neutral</span>
          <span>Very Positive</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisDisplay;
