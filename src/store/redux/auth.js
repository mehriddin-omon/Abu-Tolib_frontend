import { useState, useEffect, useContext, createContext } from 'react';

// 1. Auth Context yaratish
const AuthContext = createContext();

// 2. AuthProvider komponenti
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // User ma'lumotlarini serverdan olish
  const fetchUser = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token yaroqsiz bo'lsa
        logout();
      }
    } catch (error) {
      console.error('Auth error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login funksiyasi
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;
        
        // Token va user ma'lumotlarini saqlash
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Register funksiyasi
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;
        
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout funksiyasi
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  // User ma'lumotlarini yangilash
  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }));
  };

  // Token mavjudligini tekshirish
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  // Component mount bo'lganda user ma'lumotlarini olish
  useEffect(() => {
    fetchUser();
  }, [token]);

  // Context value
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// 4. ProtectedRoute komponenti
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// 5. App.js da ishlatish
/*
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
*/