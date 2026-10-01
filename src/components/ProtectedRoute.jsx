import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container shadow-md mb-4 text-on-primary animate-pulse">
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-secondary-container flex items-center justify-center shadow-sm">
            <span
              className="material-symbols-outlined text-[14px] text-on-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <span className="material-symbols-outlined text-[32px] text-primary-fixed">style</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold">
            redação
          </span>
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-secondary font-extrabold">
            .swipe
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
          Verificando sua sessão...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
