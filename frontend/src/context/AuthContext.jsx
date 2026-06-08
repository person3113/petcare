import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { me } from '../api/auth.js';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    function restoreSession() {
      me()
        .then(data => {
          if (!isMounted) return;
          setUser(data?.data || data || null);
        })
        .catch(error => {
          if (!isMounted) return;
          if (error?.status === 401) {
            setUser(null);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = { user, setUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
