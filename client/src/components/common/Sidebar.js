import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Home, 
  Smile, 
  BookOpen, 
  MessageCircle, 
  AlertTriangle, 
  Calendar, 
  Users, 
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const navigationItems = isAuthenticated
    ? [
        {
          category: 'Main',
          items: [
            { icon: Home, label: 'Dashboard', path: '/dashboard' },
            { icon: Smile, label: 'Mood Tracker', path: '/mood-tracker' },
            { icon: BookOpen, label: 'Journal', path: '/journal' },
            { icon: MessageCircle, label: 'AI Assistant', path: '/ai-assistant' },
          ],
        },
        {
          category: 'Support',
          items: [
            { icon: AlertTriangle, label: 'Crisis Support', path: '/crisis' },
            { icon: Calendar, label: 'Appointments', path: '/appointments' },
          ],
        },
        ...(user?.role === 'professional' || user?.role === 'admin'
          ? [
              {
                category: 'Professional',
                items: [
                  { icon: Users, label: 'Patients', path: '/patients' },
                  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
                ],
              },
            ]
          : []),
        ...(user?.role === 'admin'
          ? [
              {
                category: 'Admin',
                items: [
                  { icon: Users, label: 'User Management', path: '/admin/users' },
                  { icon: Settings, label: 'Settings', path: '/admin/settings' },
                ],
              },
            ]
          : []),
      ]
    : [];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {isAuthenticated && (
        <nav className="sidebar-nav">
          {navigationItems.map((section) => (
            <div key={section.category} className="sidebar-section">
              {!collapsed && (
                <h4 className="sidebar-section-title">{section.category}</h4>
              )}
              <ul className="sidebar-menu">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`sidebar-menu-item ${isActive(item.path) ? 'active' : ''}`}
                        title={collapsed ? item.label : ''}
                      >
                        <Icon size={20} />
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      )}

      {!collapsed && isAuthenticated && (
        <div className="sidebar-footer">
          <button
            onClick={() => navigate('/settings')}
            className="sidebar-menu-item"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
