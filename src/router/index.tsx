import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Dashboard } from '../pages/Dashboard';
import { Workspace } from '../pages/Workspace';
import { Settings } from '../pages/Settings';
import { WorkspaceProvider } from '../context/WorkspaceContext';
import { DocumentUIProvider } from '../context/DocumentUIContext';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'workspace/:id',
            element: <Workspace />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export function AppRouter() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <DocumentUIProvider>
          <RouterProvider router={router} />
        </DocumentUIProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default AppRouter;
