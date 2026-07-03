import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { Key } from 'lucide-react';

const PasswordFallback = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(login({ username, password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by Redux
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-fallback">
      <div className="fallback-card">
        <Key size={32} className="fallback-icon" />
        <h3>Password Login</h3>
        <p>Use your password as a fallback authentication method</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button onClick={() => navigate(-1)} className="btn-link">
          Back
        </button>
      </div>
    </div>
  );
};

export default PasswordFallback;
