import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AdminUsers from "./pages/AdminUsers";
import Incidents from "./pages/Incidents";
import IncidentDetail from "./pages/IncidentDetail";
import NotFound from "./pages/NotFound";

import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// 🛡️ حارس المسارات المطور (يستخدم AWS Amplify)
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // 🔍 نسأل أمازون: هل الجلسة لا تزال صالحة؟
        await getCurrentUser();
        setIsAuth(true);
      } catch (error) {
        // ✋ لو ما فيه يوزر أو انتهت الجلسة، نمسح البيانات المحلية
        localStorage.removeItem("user");
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mb-4"></div>
        <p className="text-lg font-medium">جاري التحقق من الهوية...</p>
      </div>
    );
  }

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          < Sonner position="top-right" theme="dark" />

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/admin-users" 
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />

              <Route
                path="/incidents"
                element={
                  <ProtectedRoute>
                    <Incidents />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/incidents/:id"
                element={
                  <ProtectedRoute>
                    <IncidentDetail />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;