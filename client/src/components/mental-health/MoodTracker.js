import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMoodRecord, getMoodRecords } from '../../redux/slices/moodSlice';
import { Smile, Meh, Frown, Angry } from 'lucide-react';

const MoodTracker = () => {
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [factors, setFactors] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { records, loading: recordsLoading } = useSelector((state) => state.mood);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMoodRecords());
  }, [dispatch]);

  const moodOptions = [
    { value: 'very-positive', label: 'Very Happy', icon: Smile, color: '#22c55e' },
    { value: 'positive', label: 'Happy', icon: Smile, color: '#84cc16' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: '#eab308' },
    { value: 'negative', label: 'Sad', icon: Frown, color: '#f97316' },
    { value: 'very-negative', label: 'Very Sad', icon: Angry, color: '#ef4444' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(createMoodRecord({
        mood,
        intensity,
        factors: factors.split(',').map(f => f.trim()).filter(f => f),
        notes,
      })).unwrap();
      
      setMood('');
      setIntensity(5);
      setFactors('');
      setNotes('');
    } catch (err) {
      console.error('Failed to save mood:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mood-tracker">
      <div className="tracker-header">
        <h2>Mood Tracker</h2>
        <p>Track your daily mood to understand patterns</p>
      </div>

      <div className="mood-form-container">
        <form onSubmit={handleSubmit} className="mood-form">
          <div className="form-group">
            <label>How are you feeling today?</label>
            <div className="mood-options">
              {moodOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMood(option.value)}
                    className={`mood-option ${mood === option.value ? 'selected' : ''}`}
                    style={{ borderColor: mood === option.value ? option.color : '#e5e7eb' }}
                  >
                    <Icon size={32} color={option.color} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>Intensity: {intensity}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="intensity-slider"
            />
            <div className="intensity-labels">
              <span>Mild</span>
              <span>Intense</span>
            </div>
          </div>

          <div className="form-group">
            <label>Factors (comma-separated)</label>
            <input
              type="text"
              value={factors}
              onChange={(e) => setFactors(e.target.value)}
              placeholder="e.g., work, sleep, exercise"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              maxLength={500}
            />
          </div>

          <button type="submit" disabled={loading || !mood} className="btn-primary">
            {loading ? 'Saving...' : 'Save Mood'}
          </button>
        </form>
      </div>

      <div className="mood-history">
        <h3>Recent Moods</h3>
        {recordsLoading ? (
          <p>Loading...</p>
        ) : records.length === 0 ? (
          <p>No mood records yet. Start tracking!</p>
        ) : (
          <div className="mood-list">
            {records.slice(0, 5).map((record) => {
              const moodOption = moodOptions.find(m => m.value === record.mood);
              const Icon = moodOption?.icon;
              return (
                <div key={record._id} className="mood-item">
                  <div className="mood-item-header">
                    <Icon size={24} color={moodOption?.color} />
                    <span className="mood-date">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mood-details">
                    <span>Intensity: {record.intensity}/10</span>
                    {record.factors.length > 0 && (
                      <span>Factors: {record.factors.join(', ')}</span>
                    )}
                    {record.notes && <p>{record.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
