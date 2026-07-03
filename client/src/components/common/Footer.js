import React from 'react';
import { Brain, Heart, Shield, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <Brain size={24} />
            <span>MentalHealth Platform</span>
          </div>
          <p>
            A comprehensive mental health platform with AI-powered support and 
            biometric authentication.
          </p>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="/crisis">Crisis Support</a></li>
            <li><a href="/resources">Mental Health Resources</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Crisis Resources</h4>
          <div className="crisis-info">
            <Heart size={20} color="#ef4444" />
            <p>If you're in crisis, please call 988 (National Suicide Prevention Lifeline)</p>
          </div>
          <div className="crisis-info">
            <Shield size={20} color="#22c55e" />
            <p>Available 24/7, free and confidential</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; 2024 Mental Health Platform. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/accessibility">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
