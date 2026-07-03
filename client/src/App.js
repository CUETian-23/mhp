import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import BiometricLogin from './components/auth/BiometricLogin';
import BiometricRegistration from './components/auth/BiometricRegistration';
import StudentDashboard from './components/dashboard/StudentDashboard';
import ProfessionalDashboard from './components/dashboard/ProfessionalDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import MoodTracker from './components/mental-health/MoodTracker';
import JournalEntry from './components/mental-health/JournalEntry';
import CrisisHelpline from './components/mental-health/CrisisHelpline';
import AIAssistant from './components/mental-health/AIAssistant';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/biometric-login" element={<BiometricLogin />} />
          <Route path="/biometric-register" element={<BiometricRegistration />} />
          
          {isAuthenticated && (
            <>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/dashboard/professional" element={<ProfessionalDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/mood-tracker" element={<MoodTracker />} />
              <Route path="/journal" element={<JournalEntry />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/crisis" element={<CrisisHelpline />} />
            </>
          )}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
