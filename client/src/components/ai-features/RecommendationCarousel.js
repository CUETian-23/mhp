import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, Check } from 'lucide-react';

const RecommendationCarousel = ({ recommendations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendation-carousel placeholder">
        <Lightbulb size={32} />
        <p>No recommendations available yet</p>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const currentRecommendation = recommendations[currentIndex];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'activity':
        return '🏃';
      case 'resource':
        return '📚';
      case 'therapy':
        return '💬';
      case 'meditation':
        return '🧘';
      case 'exercise':
        return '💪';
      case 'social':
        return '👥';
      default:
        return '💡';
    }
  };

  return (
    <div className="recommendation-carousel">
      <div className="carousel-header">
        <Lightbulb size={24} />
        <h3>Personalized Recommendations</h3>
      </div>

      <div className="carousel-container">
        <button onClick={prevSlide} className="carousel-nav prev">
          <ChevronLeft size={24} />
        </button>

        <div className="carousel-slide">
          <div className="recommendation-card">
            <div className="recommendation-type">
              <span className="type-icon">{getTypeIcon(currentRecommendation.type)}</span>
              <span className="type-label">{currentRecommendation.type}</span>
            </div>

            <h4>{currentRecommendation.title}</h4>
            <p>{currentRecommendation.description}</p>

            {currentRecommendation.url && (
              <a
                href={currentRecommendation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="recommendation-link"
              >
                Learn More
              </a>
            )}

            <div className="recommendation-footer">
              <span className="priority-badge">Priority: {currentRecommendation.priority}/10</span>
              {currentRecommendation.isCompleted && (
                <span className="completed-badge">
                  <Check size={16} /> Completed
                </span>
              )}
            </div>
          </div>
        </div>

        <button onClick={nextSlide} className="carousel-nav next">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="carousel-indicators">
        {recommendations.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationCarousel;
