module.exports = {
  sentiment: {
    threshold: 0.5,
    languages: ['en'],
  },
  risk: {
    highRiskKeywords: ['suicide', 'kill myself', 'end it all', 'want to die', 'hopeless'],
    mediumRiskKeywords: ['depressed', 'anxious', 'overwhelmed', 'struggling'],
  },
  recommendations: {
    maxRecommendations: 5,
    refreshInterval: 86400000, // 24 hours
  },
};
