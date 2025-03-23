import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Login } from "./pages/Login";
import { Markets } from "./pages/Markets";
import { Trading } from "./pages/Trading";
import { AddFunds } from "./pages/AddFunds";
import { useAuthStore } from "./store/authStore";

function ProtectedRoute({ children }) {
  const userId = useAuthStore((state) => state.userId);
  if (!userId) return <Navigate to="/login" />;
  return <>{children}</>;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/markets"
            element={
              <ProtectedRoute>
                <Markets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trade/:marketId"
            element={
              <ProtectedRoute>
                <Trading />
              </ProtectedRoute>
            }
          />
          <Route path="/add-funds" element={<AddFunds />} />
          <Route path="*" element={<Navigate to="/markets" />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1C2125",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

export default App;
