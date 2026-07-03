const Recommendation = require('../models/Recommendation');
const MoodRecord = require('../models/MoodRecord');
const JournalEntry = require('../models/JournalEntry');
const nlpService = require('./nlpService');
const config = require('../config/ai');

class RecommendationService {
  // Generate recommendations based on user's mood and journal entries
  async generateRecommendations(userId) {
    const recentMoods = await MoodRecord.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(7);

    const recentEntries = await JournalEntry.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recommendations = [];

    // Analyze mood patterns
    if (recentMoods.length > 0) {
      const moodAnalysis = this.analyzeMoodPatterns(recentMoods);
      recommendations.push(...this.getMoodBasedRecommendations(moodAnalysis));
    }

    // Analyze journal topics
    if (recentEntries.length > 0) {
      const topics = this.extractCommonTopics(recentEntries);
      recommendations.push(...this.getTopicBasedRecommendations(topics));
    }

    // Add general wellness recommendations
    recommendations.push(...this.getGeneralRecommendations());

    // Remove duplicates and limit
    const uniqueRecommendations = this.removeDuplicates(recommendations);
    const limitedRecommendations = uniqueRecommendations.slice(0, config.recommendations.maxRecommendations);

    // Save recommendations to database
    await this.saveRecommendations(userId, limitedRecommendations);

    return limitedRecommendations;
  }

  // Analyze mood patterns
  analyzeMoodPatterns(moods) {
    const moodCounts = {};
    moods.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    const avgIntensity = moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length;

    return {
      dominantMood: dominantMood ? dominantMood[0] : 'neutral',
      avgIntensity,
      trend: this.calculateMoodTrend(moods),
    };
  }

  // Calculate mood trend
  calculateMoodTrend(moods) {
    if (moods.length < 2) return 'stable';

    const moodValues = {
      'very-negative': -2,
      'negative': -1,
      'neutral': 0,
      'positive': 1,
      'very-positive': 2,
    };

    const recent = moodValues[moods[0].mood] || 0;
    const previous = moodValues[moods[moods.length - 1].mood] || 0;

    if (recent > previous) return 'improving';
    if (recent < previous) return 'declining';
    return 'stable';
  }

  // Get mood-based recommendations
  getMoodBasedRecommendations(moodAnalysis) {
    const recommendations = [];

    if (moodAnalysis.dominantMood.includes('negative')) {
      recommendations.push({
        type: 'activity',
        title: 'Try a Guided Meditation',
        description: 'A 10-minute meditation can help reduce stress and improve mood.',
        url: 'https://www.headspace.com/meditation',
        priority: 8,
      });
      recommendations.push({
        type: 'exercise',
        title: 'Go for a Walk',
        description: 'Physical activity releases endorphins that can improve your mood.',
        url: null,
        priority: 7,
      });
    }

    if (moodAnalysis.trend === 'declining') {
      recommendations.push({
        type: 'therapy',
        title: 'Consider Talking to a Professional',
        description: 'If your mood has been declining, speaking with a therapist can help.',
        url: null,
        priority: 9,
      });
    }

    if (moodAnalysis.avgIntensity > 7) {
      recommendations.push({
        type: 'meditation',
        title: 'Practice Deep Breathing',
        description: 'Deep breathing exercises can help manage intense emotions.',
        url: null,
        priority: 6,
      });
    }

    return recommendations;
  }

  // Extract common topics from journal entries
  extractCommonTopics(entries) {
    const allTopics = [];
    entries.forEach(entry => {
      const topics = nlpService.extractTopics(entry.content);
      allTopics.push(...topics);
    });

    const topicCounts = {};
    allTopics.forEach(({ topic }) => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    return Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  // Get topic-based recommendations
  getTopicBasedRecommendations(topics) {
    const recommendations = [];
    const topicMap = {
      'anxiety': {
        type: 'resource',
        title: 'Anxiety Management Techniques',
        description: 'Learn evidence-based techniques for managing anxiety.',
        url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
        priority: 7,
      },
      'stress': {
        type: 'activity',
        title: 'Stress Reduction Exercises',
        description: 'Try these exercises to reduce stress levels.',
        url: null,
        priority: 6,
      },
      'sleep': {
        type: 'resource',
        title: 'Sleep Hygiene Tips',
        description: 'Improve your sleep quality with these evidence-based tips.',
        url: 'https://www.sleepfoundation.org/sleep-hygiene',
        priority: 5,
      },
      'work': {
        type: 'activity',
        title: 'Work-Life Balance Strategies',
        description: 'Find balance between work and personal life.',
        url: null,
        priority: 6,
      },
    };

    topics.forEach(topic => {
      const lowerTopic = topic.toLowerCase();
      if (topicMap[lowerTopic]) {
        recommendations.push(topicMap[lowerTopic]);
      }
    });

    return recommendations;
  }

  // Get general wellness recommendations
  getGeneralRecommendations() {
    return [
      {
        type: 'activity',
        title: 'Practice Gratitude',
        description: 'Write down three things you\'re grateful for today.',
        url: null,
        priority: 4,
      },
      {
        type: 'social',
        title: 'Connect with a Friend',
        description: 'Reach out to someone you haven\'t spoken to in a while.',
        url: null,
        priority: 5,
      },
      {
        type: 'exercise',
        title: 'Try a New Exercise',
        description: 'Physical activity is great for mental health.',
        url: null,
        priority: 4,
      },
    ];
  }

  // Remove duplicate recommendations
  removeDuplicates(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
      const key = `${rec.type}-${rec.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Save recommendations to database
  async saveRecommendations(userId, recommendations) {
    // Mark old recommendations as viewed
    await Recommendation.updateMany(
      { user: userId, isViewed: false },
      { isViewed: true }
    );

    // Create new recommendations
    const recommendationDocs = recommendations.map(rec => ({
      user: userId,
      ...rec,
      expiresAt: new Date(Date.now() + config.recommendations.refreshInterval),
    }));

    await Recommendation.insertMany(recommendationDocs);
  }

  // Get user's recommendations
  async getUserRecommendations(userId) {
    const recommendations = await Recommendation.find({ user: userId })
      .sort({ priority: -1, createdAt: -1 })
      .limit(10);

    // Remove expired recommendations
    const now = new Date();
    await Recommendation.deleteMany({ user: userId, expiresAt: { $lt: now } });

    return recommendations;
  }

  // Mark recommendation as completed
  async markAsCompleted(userId, recommendationId) {
    const recommendation = await Recommendation.findOneAndUpdate(
      { _id: recommendationId, user: userId },
      { isCompleted: true, completedAt: new Date() }
    );
    return recommendation;
  }

  // Mark recommendation as viewed
  async markAsViewed(userId, recommendationId) {
    const recommendation = await Recommendation.findOneAndUpdate(
      { _id: recommendationId, user: userId },
      { isViewed: true }
    );
    return recommendation;
  }
}

module.exports = new RecommendationService();
