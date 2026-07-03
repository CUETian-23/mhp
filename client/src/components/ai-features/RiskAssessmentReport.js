import React from 'react';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';

const RiskAssessmentReport = ({ riskData }) => {
  if (!riskData) {
    return (
      <div className="risk-assessment placeholder">
        <p>No risk assessment data available</p>
      </div>
    );
  }

  const { level, indicators, confidence } = riskData;

  const getRiskColor = (level) => {
    switch (level) {
      case 'low':
        return '#22c55e';
      case 'medium':
        return '#f97316';
      case 'high':
        return '#ef4444';
      case 'critical':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'low':
        return <CheckCircle size={32} />;
      case 'medium':
        return <AlertTriangle size={32} />;
      case 'high':
        return <AlertTriangle size={32} />;
      case 'critical':
        return <Shield size={32} />;
      default:
        return <AlertTriangle size={32} />;
    }
  };

  const getRiskDescription = (level) => {
    switch (level) {
      case 'low':
        return 'No immediate concerns detected. Continue monitoring your mental wellness.';
      case 'medium':
        return 'Some indicators of distress detected. Consider reaching out for support.';
      case 'high':
        return 'Significant indicators of distress. Professional support is recommended.';
      case 'critical':
        return 'Critical risk indicators detected. Immediate professional support is strongly recommended.';
      default:
        return 'Unable to determine risk level.';
    }
  };

  const color = getRiskColor(level);
  const icon = getRiskIcon(level);

  return (
    <div className="risk-assessment">
      <div className="risk-header">
        <div className="risk-icon" style={{ color }}>
          {icon}
        </div>
        <h3>Risk Assessment</h3>
      </div>

      <div className="risk-level">
        <div className="level-label">Risk Level</div>
        <div className="level-badge" style={{ backgroundColor: color }}>
          {level.toUpperCase()}
        </div>
      </div>

      <div className="risk-description">
        <p>{getRiskDescription(level)}</p>
      </div>

      {indicators && indicators.length > 0 && (
        <div className="risk-indicators">
          <h4>Detected Indicators</h4>
          <ul>
            {indicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="risk-confidence">
        <span>Assessment Confidence: {(confidence * 100).toFixed(1)}%</span>
      </div>

      {level === 'critical' || level === 'high' ? (
        <div className="risk-action">
          <a href="/crisis" className="btn-crisis">
            <AlertTriangle size={20} />
            Get Crisis Support
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default RiskAssessmentReport;
