import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createJournalEntry, getJournalEntries } from '../../redux/slices/journalSlice';
import { BookOpen, Save, Trash2 } from 'lucide-react';

const JournalEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const { entries, loading: entriesLoading } = useSelector((state) => state.journal);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getJournalEntries());
  }, [dispatch]);

  const moodOptions = [
    { value: 'very-positive', label: 'Very Positive' },
    { value: 'positive', label: 'Positive' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'negative', label: 'Negative' },
    { value: 'very-negative', label: 'Very Negative' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(createJournalEntry({
        title,
        content,
        mood,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        isPrivate,
      })).unwrap();
      
      setTitle('');
      setContent('');
      setMood('');
      setTags('');
      setIsPrivate(true);
    } catch (err) {
      console.error('Failed to save entry:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="journal-entry">
      <div className="journal-header">
        <BookOpen size={32} />
        <h2>Journal</h2>
        <p>Express your thoughts and track your mental wellness journey</p>
      </div>

      <div className="journal-form-container">
        <form onSubmit={handleSubmit} className="journal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Give your entry a title"
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your thoughts here..."
              rows={10}
              maxLength={10000}
            />
            <div className="char-count">{content.length}/10000</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mood">Mood</label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="">Select mood...</option>
                {moodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., anxiety, progress, gratitude"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <span>Keep this entry private</span>
            </label>
          </div>

          <button type="submit" disabled={loading || !title || !content} className="btn-primary">
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </div>

      <div className="journal-history">
        <h3>Recent Entries</h3>
        {entriesLoading ? (
          <p>Loading...</p>
        ) : entries.length === 0 ? (
          <p>No journal entries yet. Start writing!</p>
        ) : (
          <div className="journal-list">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry._id} className="journal-item">
                <div className="journal-item-header">
                  <h4>{entry.title}</h4>
                  <span className="entry-date">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="entry-preview">
                  {entry.content.substring(0, 150)}
                  {entry.content.length > 150 && '...'}
                </p>
                {entry.mood && (
                  <span className="entry-mood">
                    Mood: {moodOptions.find(m => m.value === entry.mood)?.label}
                  </span>
                )}
                {entry.tags.length > 0 && (
                  <div className="entry-tags">
                    {entry.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
                {entry.sentimentAnalysis && (
                  <div className="sentiment-badge">
                    Sentiment: {entry.sentimentAnalysis.label} ({entry.sentimentAnalysis.score.toFixed(2)})
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalEntry;
