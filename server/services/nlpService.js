const Sentiment = require('sentiment');
const config = require('../config/ai');

class NLPService {
  constructor() {
    this.sentimentAnalyzer = new Sentiment();
  }

  // Analyze sentiment of text
  analyzeSentiment(text) {
    const result = this.sentimentAnalyzer.analyze(text);
    
    let label = 'neutral';
    if (result.score > 2) {
      label = 'very-positive';
    } else if (result.score > 0) {
      label = 'positive';
    } else if (result.score < -2) {
      label = 'very-negative';
    } else if (result.score < 0) {
      label = 'negative';
    }

    return {
      score: result.score,
      comparative: result.comparative,
      label,
      tokens: result.tokens,
      positive: result.positive,
      negative: result.negative,
    };
  }

  // Detect crisis keywords
  detectCrisisKeywords(text) {
    const lowerText = text.toLowerCase();
    const detected = {
      highRisk: [],
      mediumRisk: [],
    };

    config.risk.highRiskKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        detected.highRisk.push(keyword);
      }
    });

    config.risk.mediumRiskKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        detected.mediumRisk.push(keyword);
      }
    });

    return detected;
  }

  // Assess risk level based on text analysis
  assessRisk(text, sentimentResult) {
    const crisisKeywords = this.detectCrisisKeywords(text);
    
    let riskLevel = 'low';
    const indicators = [];

    if (crisisKeywords.highRisk.length > 0) {
      riskLevel = 'critical';
      indicators.push(...crisisKeywords.highRisk);
    } else if (crisisKeywords.mediumRisk.length > 0) {
      riskLevel = 'medium';
      indicators.push(...crisisKeywords.mediumRisk);
    }

    if (sentimentResult.label === 'very-negative' && riskLevel === 'low') {
      riskLevel = 'medium';
      indicators.push('very-negative sentiment');
    }

    return {
      level: riskLevel,
      indicators,
      confidence: this.calculateRiskConfidence(riskLevel, crisisKeywords, sentimentResult),
    };
  }

  // Calculate confidence score for risk assessment
  calculateRiskConfidence(riskLevel, crisisKeywords, sentimentResult) {
    let confidence = 0.5;

    if (riskLevel === 'critical') {
      confidence = 0.9;
    } else if (riskLevel === 'high') {
      confidence = 0.8;
    } else if (riskLevel === 'medium') {
      confidence = 0.6;
    }

    // Adjust based on number of keywords
    const totalKeywords = crisisKeywords.highRisk.length + crisisKeywords.mediumRisk.length;
    confidence += Math.min(totalKeywords * 0.1, 0.2);

    // Adjust based on sentiment
    if (sentimentResult.label === 'very-negative') {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  // Extract key phrases/topics from text
  extractTopics(text) {
    const tokens = this.sentimentAnalyzer.analyze(text).tokens;
    const stopWords = new Set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);
    
    const topics = tokens.filter(token => !stopWords.has(token.toLowerCase()) && token.length > 2);
    
    // Count frequency
    const topicCounts = {};
    topics.forEach(topic => {
      const lower = topic.toLowerCase();
      topicCounts[lower] = (topicCounts[lower] || 0) + 1;
    });

    // Return top 5 topics
    return Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
  }
}

module.exports = new NLPService();
