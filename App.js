import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Navbar } from "./components/Navbar";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import ExamAnswer from "./pages/ExamAnswer";
import StudyTools from "./pages/StudyTools";
import TheMarker from "./pages/TheMarker";
import Upgrade from "./pages/Upgrade";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }
    
    return children;
};

function AppContent() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route 
                    path="/settings" 
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/exam-answer" 
                    element={
                        <ProtectedRoute>
                            <ExamAnswer />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/study-tools" 
                    element={
                        <ProtectedRoute>
                            <StudyTools />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/the-marker" 
                    element={
                        <ProtectedRoute>
                            <TheMarker />
                        </ProtectedRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-center" richColors />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <LanguageProvider>
                    <AuthProvider>
                        <AppContent />
                    </AuthProvider>
                </LanguageProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
