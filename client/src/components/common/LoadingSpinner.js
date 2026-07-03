import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, color = '#3b82f6' }) => {
  return (
    <div className="loading-spinner">
      <Loader2 size={size} color={color} className="spinner-icon" />
    </div>
  );
};

export default LoadingSpinner;
