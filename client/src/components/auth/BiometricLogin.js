import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginWithWebAuthn } from '../../redux/slices/authSlice';
import webauthnService from '../../services/webauthnService';
import { Fingerprint } from 'lucide-react';

const BiometricLogin = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBiometricLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      // Generate authentication options
      const optionsResponse = await webauthnService.generateAuthenticationOptions(username);
      
      // Get credential from authenticator
      const authResponse = await window.navigator.credentials.get({
        publicKey: optionsResponse.options,
      });

      // Verify with server
      await dispatch(loginWithWebAuthn({
        username,
        response: authResponse,
        challenge: optionsResponse.options.challenge,
      })).unwrap();

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Biometric authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Fingerprint size={48} className="auth-icon" />
          <h2>Biometric Login</h2>
          <p>Use your fingerprint or face recognition to sign in</p>
        </div>

        <form onSubmit={handleBiometricLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Authenticating...' : 'Authenticate with Biometrics'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <a href="/login">Use password instead</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BiometricLogin;
