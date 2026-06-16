import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Features - Auth
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';

// Features - Dashboard
import RecruiterDashboard from './features/dashboard/pages/RecruiterDashboard';
import CandidateDashboard from './features/dashboard/pages/CandidateDashboard';

// Features - Assessments
import AssessmentManagement from './features/assessments/pages/AssessmentManagement';

// Features - Questions
import QuestionManagement from './features/questions/pages/QuestionManagement';

// Features - Analytics
import AnalyticsDashboard from './features/analytics/pages/AnalyticsDashboard';

// Features - Attempts & Results
import AssessmentAttempt from './features/attempts/pages/AssessmentAttempt';
import AssessmentResults from './features/attempts/pages/AssessmentResults';

// Features - AI Resume Analyzer
import ResumeAnalyzer from './features/resume-analyzer/pages/ResumeAnalyzer';

import useAuth from './hooks/useAuth';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Root Path Redirect */}
      <Route 
        path="/" 
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : user?.role?.toUpperCase() === 'RECRUITER' ? (
            <Navigate to="/recruiter/dashboard" replace />
          ) : (
            <Navigate to="/candidate/dashboard" replace />
          )
        } 
      />

      {/* Auth Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Recruiter Protected Routes */}
      <Route 
        path="/recruiter" 
        element={
          <ProtectedRoute allowedRoles={['RECRUITER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="assessments" element={<AssessmentManagement />} />
        <Route path="questions" element={<QuestionManagement />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
      </Route>

      {/* Candidate Protected Routes */}
      <Route 
        path="/candidate" 
        element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="results/:attemptId" element={<AssessmentResults />} />
      </Route>

      {/* Distraction-free Candidate Exam Attempt Console */}
      <Route 
        path="/candidate/attempt/:attemptId" 
        element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}>
            <div className="min-h-screen w-screen bg-[#030303] light:bg-[#fcfcfc] p-8 dark-grid-bg transition-colors duration-200">
              <AssessmentAttempt />
            </div>
          </ProtectedRoute>
        } 
      />

      {/* Catch-all redirect to Root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
