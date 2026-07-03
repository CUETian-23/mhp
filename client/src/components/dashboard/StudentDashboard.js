import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMoodRecords } from '../../redux/slices/moodSlice';
import { getJournalEntries } from '../../redux/slices/journalSlice';
import { Smile, BookOpen, MessageCircle, TrendingUp, Calendar, Bell } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { records } = useSelector((state) => state.mood);
  const { entries } = useSelector((state) => state.journal);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMoodRecords());
    dispatch(getJournalEntries());
  }, [dispatch]);

  const recentMoods = records.slice(0, 5);
  const recentEntries = entries.slice(0, 3);

  const quickActions = [
    {
      icon: Smile,
      label: 'Log Mood',
      action: () => navigate('/mood-tracker'),
      color: '#22c55e',
    },
    {
      icon: BookOpen,
      label: 'Write Journal',
      action: () => navigate('/journal'),
      color: '#3b82f6',
    },
    {
      icon: MessageCircle,
      label: 'AI Assistant',
      action: () => navigate('/ai-assistant'),
      color: '#8b5cf6',
    },
    {
      icon: Calendar,
      label: 'Schedule',
      action: () => navigate('/appointments'),
      color: '#f97316',
    },
  ];

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.profile?.firstName || user?.username}!</h1>
          <p>Here's an overview of your mental wellness journey</p>
        </div>
        <button className="btn-icon">
          <Bell size={24} />
        </button>
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className="quick-action-card"
              style={{ borderColor: action.color }}
            >
              <Icon size={32} color={action.color} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card mood-overview">
          <div className="card-header">
            <h3>Recent Moods</h3>
            <TrendingUp size={20} />
          </div>
          {recentMoods.length === 0 ? (
            <p className="empty-state">No mood records yet</p>
          ) : (
            <div className="mood-list">
              {recentMoods.map((mood) => (
                <div key={mood._id} className="mood-summary">
                  <span className="mood-date">
                    {new Date(mood.createdAt).toLocaleDateString()}
                  </span>
                  <span className="mood-level">{mood.mood}</span>
                  <span className="mood-intensity">{mood.intensity}/10</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate('/mood-tracker')}
            className="btn-link"
          >
            View All Moods
          </button>
        </div>

        <div className="dashboard-card journal-overview">
          <div className="card-header">
            <h3>Recent Journal Entries</h3>
            <BookOpen size={20} />
          </div>
          {recentEntries.length === 0 ? (
            <p className="empty-state">No journal entries yet</p>
          ) : (
            <div className="journal-list">
              {recentEntries.map((entry) => (
                <div key={entry._id} className="journal-summary">
                  <h4>{entry.title}</h4>
                  <p className="entry-preview">
                    {entry.content.substring(0, 100)}...
                  </p>
                  <span className="entry-date">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate('/journal')}
            className="btn-link"
          >
            View All Entries
          </button>
        </div>

        <div className="dashboard-card wellness-tips">
          <div className="card-header">
            <h3>Daily Wellness Tip</h3>
            <Smile size={20} />
          </div>
          <div className="tip-content">
            <p>
              Take 5 minutes today to practice deep breathing. Inhale for 4 seconds, 
              hold for 4 seconds, and exhale for 4 seconds. This simple exercise can 
              help reduce stress and improve focus.
            </p>
          </div>
        </div>

        <div className="dashboard-card crisis-quick-access">
          <div className="card-header">
            <h3>Crisis Support</h3>
            <MessageCircle size={20} />
          </div>
          <p>If you're in crisis, help is available 24/7</p>
          <button
            onClick={() => navigate('/crisis')}
            className="btn-crisis"
          >
            Get Crisis Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
