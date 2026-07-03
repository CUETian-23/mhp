import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, AlertTriangle, FileText, TrendingUp, CheckCircle } from 'lucide-react';

const ProfessionalDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    activeAlerts: 0,
    pendingReports: 0,
  });

  const quickActions = [
    {
      icon: Users,
      label: 'Patient List',
      action: () => navigate('/patients'),
      color: '#3b82f6',
    },
    {
      icon: Calendar,
      label: 'Appointments',
      action: () => navigate('/appointments'),
      color: '#22c55e',
    },
    {
      icon: AlertTriangle,
      label: 'Crisis Alerts',
      action: () => navigate('/alerts'),
      color: '#ef4444',
    },
    {
      icon: FileText,
      label: 'Reports',
      action: () => navigate('/reports'),
      color: '#8b5cf6',
    },
  ];

  const recentPatients = [
    { id: 1, name: 'John Doe', lastVisit: '2024-01-15', status: 'active', riskLevel: 'low' },
    { id: 2, name: 'Jane Smith', lastVisit: '2024-01-14', status: 'active', riskLevel: 'medium' },
    { id: 3, name: 'Bob Johnson', lastVisit: '2024-01-13', status: 'active', riskLevel: 'low' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'John Doe', date: '2024-01-16', time: '10:00 AM', type: 'video' },
    { id: 2, patient: 'Jane Smith', date: '2024-01-16', time: '2:00 PM', type: 'in-person' },
    { id: 3, patient: 'Bob Johnson', date: '2024-01-17', time: '11:00 AM', type: 'video' },
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return '#22c55e';
      case 'medium': return '#f97316';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div className="professional-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Professional Dashboard</h1>
          <p>Dr. {user?.profile?.lastName || user?.username}</p>
        </div>
        <div className="header-actions">
          <button className="btn-icon">
            <CheckCircle size={24} />
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Users size={32} color="#3b82f6" />
          <div className="stat-content">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={32} color="#22c55e" />
          <div className="stat-content">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <AlertTriangle size={32} color="#ef4444" />
          <div className="stat-content">
            <h3>{stats.activeAlerts}</h3>
            <p>Active Alerts</p>
          </div>
        </div>
        <div className="stat-card">
          <FileText size={32} color="#8b5cf6" />
          <div className="stat-content">
            <h3>{stats.pendingReports}</h3>
            <p>Pending Reports</p>
          </div>
        </div>
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
        <div className="dashboard-card patients-overview">
          <div className="card-header">
            <h3>Recent Patients</h3>
            <Users size={20} />
          </div>
          <div className="patients-list">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="patient-item">
                <div className="patient-info">
                  <h4>{patient.name}</h4>
                  <span className="last-visit">Last visit: {patient.lastVisit}</span>
                </div>
                <div className="patient-status">
                  <span
                    className="risk-badge"
                    style={{ backgroundColor: getRiskColor(patient.riskLevel) }}
                  >
                    {patient.riskLevel}
                  </span>
                  <span className="status-badge">{patient.status}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-link">View All Patients</button>
        </div>

        <div className="dashboard-card appointments-overview">
          <div className="card-header">
            <h3>Upcoming Appointments</h3>
            <Calendar size={20} />
          </div>
          <div className="appointments-list">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-info">
                  <h4>{appointment.patient}</h4>
                  <span className="appointment-date">
                    {appointment.date} at {appointment.time}
                  </span>
                </div>
                <span className="appointment-type">{appointment.type}</span>
              </div>
            ))}
          </div>
          <button className="btn-link">View All Appointments</button>
        </div>

        <div className="dashboard-card alerts-overview">
          <div className="card-header">
            <h3>Recent Alerts</h3>
            <AlertTriangle size={20} />
          </div>
          <div className="alerts-list">
            <div className="alert-item high">
              <AlertTriangle size={20} color="#ef4444" />
              <div className="alert-info">
                <h4>High Risk Alert</h4>
                <p>Jane Smith - Elevated risk indicators detected</p>
                <span className="alert-time">2 hours ago</span>
              </div>
            </div>
            <div className="alert-item medium">
              <AlertTriangle size={20} color="#f97316" />
              <div className="alert-info">
                <h4>Medium Risk Alert</h4>
                <p>John Doe - Negative sentiment pattern detected</p>
                <span className="alert-time">5 hours ago</span>
              </div>
            </div>
          </div>
          <button className="btn-link">View All Alerts</button>
        </div>

        <div className="dashboard-card analytics-overview">
          <div className="card-header">
            <h3>Analytics Overview</h3>
            <TrendingUp size={20} />
          </div>
          <div className="analytics-content">
            <div className="analytics-item">
              <span className="label">Patient Engagement</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <span className="value">75%</span>
            </div>
            <div className="analytics-item">
              <span className="label">Risk Reduction Rate</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <span className="value">60%</span>
            </div>
            <div className="analytics-item">
              <span className="label">Appointment Adherence</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="value">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
