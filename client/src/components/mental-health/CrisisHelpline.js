import React, { useState } from 'react';
import { Phone, MessageCircle, AlertTriangle, Heart } from 'lucide-react';

const CrisisHelpline = () => {
  const [showResources, setShowResources] = useState(false);

  const crisisResources = [
    {
      type: 'hotline',
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      available: '24/7',
      description: 'Free and confidential support for people in distress',
    },
    {
      type: 'hotline',
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      available: '24/7',
      description: 'Text with a trained crisis counselor',
    },
    {
      type: 'hotline',
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      available: '24/7',
      description: 'Treatment referral and information service',
    },
    {
      type: 'resource',
      name: 'Find a Therapist',
      url: 'https://www.psychologytoday.com',
      description: 'Search for mental health professionals in your area',
    },
    {
      type: 'resource',
      name: 'NAMI Helpline',
      number: '1-800-950-6264',
      available: 'Mon-Fri 10am-10pm ET',
      description: 'National Alliance on Mental Illness support',
    },
  ];

  const emergencySteps = [
    {
      icon: Phone,
      title: 'Call Emergency Services',
      description: 'If you are in immediate danger, call 911 or go to the nearest emergency room.',
    },
    {
      icon: MessageCircle,
      title: 'Reach Out',
      description: 'Contact a trusted friend, family member, or mental health professional.',
    },
    {
      icon: Heart,
      title: 'Stay Safe',
      description: 'Remove any harmful objects and go to a safe location.',
    },
    {
      icon: AlertTriangle,
      title: 'Get Help',
      description: 'Use the resources below to connect with professional support.',
    },
  ];

  return (
    <div className="crisis-helpline">
      <div className="crisis-header">
        <AlertTriangle size={48} className="crisis-icon" />
        <h2>Crisis Support</h2>
        <p>You are not alone. Help is available 24/7.</p>
      </div>

      <div className="emergency-banner">
        <h3>If you are in immediate danger, please call 911</h3>
        <p className="emergency-text">Your safety is the top priority</p>
      </div>

      <div className="emergency-steps">
        <h3>What to Do in a Crisis</h3>
        <div className="steps-grid">
          {emergencySteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="step-card">
                <Icon size={32} className="step-icon" />
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="crisis-resources">
        <div className="resources-header">
          <h3>Crisis Resources</h3>
          <button
            onClick={() => setShowResources(!showResources)}
            className="btn-toggle"
          >
            {showResources ? 'Hide Resources' : 'Show Resources'}
          </button>
        </div>

        {showResources && (
          <div className="resources-list">
            {crisisResources.map((resource, index) => (
              <div key={index} className={`resource-card ${resource.type}`}>
                <div className="resource-header">
                  <h4>{resource.name}</h4>
                  {resource.type === 'hotline' && <Phone size={20} />}
                </div>
                <p className="resource-description">{resource.description}</p>
                <div className="resource-contact">
                  {resource.number && (
                    <a href={`tel:${resource.number}`} className="resource-link">
                      {resource.number}
                    </a>
                  )}
                  {resource.url && (
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                      Visit Website
                    </a>
                  )}
                  {resource.available && (
                    <span className="resource-availability">{resource.available}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="disclaimer">
        <p>
          <strong>Disclaimer:</strong> This platform is not a substitute for professional mental health care. 
          If you are experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.
        </p>
      </div>
    </div>
  );
};

export default CrisisHelpline;
