import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, AlertTriangle, Shield, Settings, BarChart3, Download, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAlerts: 0,
    systemHealth: 'good',
  });

  const quickActions = [
    {
      icon: Users,
      label: 'User Management',
      action: () => navigate('/admin/users'),
      color: '#3b82f6',
    },
    {
      icon: Activity,
      label: 'System Activity',
      action: () => navigate('/admin/activity'),
      color: '#22c55e',
    },
    {
      icon: AlertTriangle,
      label: 'Alert Management',
      action: () => navigate('/admin/alerts'),
      color: '#ef4444',
    },
    {
      icon: Shield,
      label: 'Security',
      action: () => navigate('/admin/security'),
      color: '#8b5cf6',
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => navigate('/admin/settings'),
      color: '#6b7280',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      action: () => navigate('/admin/analytics'),
      color: '#f97316',
    },
  ];

  const systemMetrics = [
    { name: 'Server Uptime', value: '99.9%', status: 'good' },
    { name: 'Response Time', value: '120ms', status: 'good' },
    { name: 'Database Health', value: 'Healthy', status: 'good' },
    { name: 'API Rate Limit', value: '45%', status: 'good' },
  ];

  const recentActivity = [
    { id: 1, action: 'New user registration', user: 'student123', time: '5 min ago', type: 'user' },
    { id: 2, action: 'Crisis alert triggered', user: 'user456', time: '15 min ago', type: 'alert' },
    { id: 3, action: 'System backup completed', user: 'system', time: '1 hour ago', type: 'system' },
    { id: 4, action: 'Security scan completed', user: 'system', time: '2 hours ago', type: 'security' },
    { id: 5, action: 'New professional registered', user: 'dr_smith', time: '3 hours ago', type: 'user' },
  ];

  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return '#3b82f6';
      case 'alert': return '#ef4444';
      case 'system': return '#22c55e';
      case 'security': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>System Overview and Management</p>
        </div>
        <div className="header-actions">
          <button className="btn-icon" title="Refresh Data">
            <RefreshCw size={24} />
          </button>
          <button className="btn-icon" title="Download Report">
            <Download size={24} />
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Users size={32} color="#3b82f6" />
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <Activity size={32} color="#22c55e" />
          <div className="stat-content">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <AlertTriangle size={32} color="#ef4444" />
          <div className="stat-content">
            <h3>{stats.totalAlerts}</h3>
            <p>Active Alerts</p>
          </div>
        </div>
        <div className="stat-card">
          <Shield size={32} color="#8b5cf6" />
          <div className="stat-content">
            <h3>{stats.systemHealth}</h3>
            <p>System Health</p>
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
        <div className="dashboard-card system-metrics">
          <div className="card-header">
            <h3>System Metrics</h3>
            <Activity size={20} />
          </div>
          <div className="metrics-list">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="metric-item">
                <span className="metric-name">{metric.name}</span>
                <span className={`metric-value status-${metric.status}`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <Activity size={20} />
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div
                  className="activity-indicator"
                  style={{ backgroundColor: getActivityColor(activity.type) }}
                />
                <div className="activity-info">
                  <h4>{activity.action}</h4>
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-link">View All Activity</button>
        </div>

        <div className="dashboard-card user-distribution">
          <div className="card-header">
            <h3>User Distribution</h3>
            <Users size={20} />
          </div>
          <div className="distribution-chart">
            <div className="distribution-item">
              <span className="label">Students</span>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '45%', backgroundColor: '#3b82f6' }}></div>
              </div>
              <span className="value">45%</span>
            </div>
            <div className="distribution-item">
              <span className="label">Professionals</span>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '15%', backgroundColor: '#22c55e' }}></div>
              </div>
              <span className="value">15%</span>
            </div>
            <div className="distribution-item">
              <span className="label">General Public</span>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '40%', backgroundColor: '#8b5cf6' }}></div>
              </div>
              <span className="value">40%</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card security-overview">
          <div className="card-header">
            <h3>Security Overview</h3>
            <Shield size={20} />
          </div>
          <div className="security-items">
            <div className="security-item">
              <Shield size={20} color="#22c55e" />
              <div className="security-info">
                <h4>Authentication</h4>
                <p>WebAuthn enabled for all users</p>
              </div>
              <span className="status-badge good">Secure</span>
            </div>
            <div className="security-item">
              <Shield size={20} color="#22c55e" />
              <div className="security-info">
                <h4>Data Encryption</h4>
                <p>All data encrypted at rest and in transit</p>
              </div>
              <span className="status-badge good">Secure</span>
            </div>
            <div className="security-item">
              <Shield size={20} color="#f97316" />
              <div className="security-info">
                <h4>Rate Limiting</h4>
                <p>API rate limiting active</p>
              </div>
              <span className="status-badge warning">Monitor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
