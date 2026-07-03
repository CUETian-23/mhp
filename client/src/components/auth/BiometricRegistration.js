import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import webauthnService from '../../services/webauthnService';
import { Fingerprint, CheckCircle } from 'lucide-react';

const BiometricRegistration = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleBiometricRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      // Generate registration options
      const optionsResponse = await webauthnService.generateRegistrationOptions(username);
      
      // Create credential with authenticator
      const credential = await window.navigator.credentials.create({
        publicKey: optionsResponse.options,
      });

      // Verify with server
      await webauthnService.verifyRegistrationResponse(
        optionsResponse.user.id,
        credential,
        optionsResponse.options.challenge
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/biometric-login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Biometric registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Fingerprint size={48} className="auth-icon" />
          <h2>Register Biometric</h2>
          <p>Set up fingerprint or face recognition for secure login</p>
        </div>

        {success ? (
          <div className="success-message">
            <CheckCircle size={48} />
            <h3>Registration Successful!</h3>
            <p>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleBiometricRegistration} className="auth-form">
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
              {loading ? 'Registering...' : 'Register Biometric'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            <a href="/login">Back to login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BiometricRegistration;
