const MoodRecord = require('../models/MoodRecord');
const JournalEntry = require('../models/JournalEntry');
const nlpService = require('../services/nlpService');
const riskAssessmentService = require('../services/riskAssessmentService');

// Create mood record
exports.createMoodRecord = async (req, res) => {
  try {
    const moodData = {
      ...req.body,
      user: req.user._id,
    };

    const moodRecord = await MoodRecord.create(moodData);
    res.status(201).json({
      success: true,
      data: moodRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get mood records
exports.getMoodRecords = async (req, res) => {
  try {
    const { limit = 20, skip = 0, startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const records = await MoodRecord.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await MoodRecord.countDocuments(filter);

    res.json({
      success: true,
      data: records,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get mood statistics
exports.getMoodStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const records = await MoodRecord.find(filter).sort({ createdAt: 1 });

    const moodCounts = {
      'very-positive': 0,
      'positive': 0,
      'neutral': 0,
      'negative': 0,
      'very-negative': 0,
    };

    let totalIntensity = 0;
    records.forEach(record => {
      moodCounts[record.mood]++;
      totalIntensity += record.intensity;
    });

    const avgIntensity = records.length > 0 ? totalIntensity / records.length : 0;
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    res.json({
      success: true,
      data: {
        totalRecords: records.length,
        moodCounts,
        averageIntensity: avgIntensity.toFixed(2),
        dominantMood: dominantMood ? dominantMood[0] : 'neutral',
        trend: calculateMoodTrend(records),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create journal entry
exports.createJournalEntry = async (req, res) => {
  try {
    const entryData = {
      ...req.body,
      user: req.user._id,
    };

    // Perform sentiment analysis
    const sentimentResult = nlpService.analyzeSentiment(entryData.content);
    entryData.sentimentAnalysis = {
      score: sentimentResult.score,
      label: sentimentResult.label,
      confidence: sentimentResult.comparative,
    };

    // Assess risk
    const riskAssessment = nlpService.assessRisk(entryData.content, sentimentResult);
    entryData.riskAssessment = riskAssessment;

    const entry = await JournalEntry.create(entryData);

    // Trigger risk assessment service if needed
    if (riskAssessment.level !== 'low') {
      await riskAssessmentService.assessJournalEntryRisk(entry._id);
    }

    res.status(201).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get journal entries
exports.getJournalEntries = async (req, res) => {
  try {
    const { limit = 20, skip = 0, mood, tags } = req.query;
    const filter = { user: req.user._id };

    if (mood) filter.mood = mood;
    if (tags) filter.tags = { $in: tags.split(',') };

    const entries = await JournalEntry.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await JournalEntry.countDocuments(filter);

    res.json({
      success: true,
      data: entries,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single journal entry
exports.getJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found',
      });
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update journal entry
exports.updateJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found',
      });
    }

    // Re-analyze if content changed
    if (req.body.content) {
      const sentimentResult = nlpService.analyzeSentiment(req.body.content);
      const riskAssessment = nlpService.assessRisk(req.body.content, sentimentResult);
      
      entry.sentimentAnalysis = {
        score: sentimentResult.score,
        label: sentimentResult.label,
        confidence: sentimentResult.comparative,
      };
      entry.riskAssessment = riskAssessment;
      await entry.save();
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete journal entry
exports.deleteJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found',
      });
    }

    res.json({
      success: true,
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to calculate mood trend
function calculateMoodTrend(records) {
  if (records.length < 2) return 'stable';

  const moodValues = {
    'very-negative': -2,
    'negative': -1,
    'neutral': 0,
    'positive': 1,
    'very-positive': 2,
  };

  const recent = moodValues[records[records.length - 1].mood] || 0;
  const previous = moodValues[records[0].mood] || 0;

  if (recent > previous) return 'improving';
  if (recent < previous) return 'declining';
  return 'stable';
}
