import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Markets } from './pages/Markets';
import { Trading } from './pages/Trading';
import { useAuthStore } from './store/authStore';
import {AddFunds} from './pages/AddFunds';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userId = useAuthStore((state) => state.userId);
  if (!userId) return <Navigate to="/login" />;
  return <>{children}</>;
}

  {/* <ProtectedRoute>
                <Trading />
              </ProtectedRoute> */}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/markets"
            element={
             
                <Markets />
             
            }
          />
          <Route
            path="/trade/:marketId"
            element={
            
              <Trading />
            }
          />
          <Route
            path="/add-funds"
            element={
            
              <AddFunds />
            }
          />
          <Route path="*" element={<Navigate to="/markets" />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;