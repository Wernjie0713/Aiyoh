import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import Login from './pages/Login';
import WebDevelopmentCourse from './pages/WebDevelopmentCourse';
import SummarizePage from './pages/Summarize'; 
import QuizPage from './pages/Quiz';
import GamePage from './pages/Game';
import { PdfProvider } from './contexts/PdfContext';

// Import Auth Provider
import { AuthProvider } from './contexts/AuthContext';

// Sample Not Found page
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <a href="/" className="bg-accent hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
        Go Home
      </a>
    </div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <PdfProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login isRegister={true} />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/courses" 
                  element={
                    <ProtectedRoute>
                      <CoursesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/courses/web-development" 
                  element={
                    <ProtectedRoute>
                      <WebDevelopmentCourse />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat/summarize" 
                  element={
                    <ProtectedRoute>
                      <SummarizePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat/quiz" 
                  element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat/game" 
                  element={
                    <ProtectedRoute>
                      <GamePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PdfProvider>
    </AuthProvider>
  );
};

export default App; 