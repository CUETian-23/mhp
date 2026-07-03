const nlpService = require('./nlpService');
const CrisisAlert = require('../models/CrisisAlert');
const JournalEntry = require('../models/JournalEntry');

class RiskAssessmentService {
  // Assess risk from journal entry
  async assessJournalEntryRisk(entryId) {
    const entry = await JournalEntry.findById(entryId);
    if (!entry) {
      throw new Error('Journal entry not found');
    }

    const sentimentResult = nlpService.analyzeSentiment(entry.content);
    const riskAssessment = nlpService.assessRisk(entry.content, sentimentResult);

    // Update entry with analysis
    entry.sentimentAnalysis = {
      score: sentimentResult.score,
      label: sentimentResult.label,
      confidence: sentimentResult.comparative,
    };

    entry.riskAssessment = riskAssessment;
    await entry.save();

    // Create crisis alert if risk is medium or higher
    if (riskAssessment.level === 'medium' || riskAssessment.level === 'high' || riskAssessment.level === 'critical') {
      await this.createCrisisAlert(entry.user, riskAssessment, 'journal', entryId);
    }

    return riskAssessment;
  }

  // Create crisis alert
  async createCrisisAlert(userId, riskAssessment, source, sourceId) {
    const alert = new CrisisAlert({
      user: userId,
      severity: riskAssessment.level,
      source,
      sourceId,
      indicators: riskAssessment.indicators,
    });

    await alert.save();

    // In production, this would trigger notifications to crisis team
    if (riskAssessment.level === 'critical') {
      await this.escalateCrisis(alert._id);
    }

    return alert;
  }

  // Escalate crisis alert
  async escalateCrisis(alertId) {
    const alert = await CrisisAlert.findById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.status = 'escalated';
    alert.escalationSent = true;
    alert.escalationTime = new Date();
    await alert.save();

    // In production, send notifications to crisis team
    console.log(`CRISIS ESCALATION: Alert ${alertId} for user ${alert.user}`);
  }

  // Get user's crisis history
  async getUserCrisisHistory(userId) {
    const alerts = await CrisisAlert.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);
    return alerts;
  }

  // Resolve crisis alert
  async resolveCrisisAlert(alertId, notes) {
    const alert = await CrisisAlert.findById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.status = 'resolved';
    alert.resolvedAt = new Date();
    if (notes) {
      alert.notes = notes;
    }
    await alert.save();

    return alert;
  }

  // Get active crisis alerts
  async getActiveAlerts() {
    const alerts = await CrisisAlert.find({ status: 'active' })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    return alerts;
  }

  // Get escalated alerts
  async getEscalatedAlerts() {
    const alerts = await CrisisAlert.find({ status: 'escalated' })
      .populate('user', 'username email')
      .sort({ escalationTime: -1 });
    return alerts;
  }
}

module.exports = new RiskAssessmentService();
