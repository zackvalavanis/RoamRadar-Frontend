import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // Load auth state from localStorage when the component first mounts
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const user = JSON.parse(localStorage.getItem('user')); // Get the user info from localStorage
      setAuth(user);
    }
  }, []);

  const login = (user) => {
    setAuth(user);
    localStorage.setItem('jwt', user.jwt); // Store JWT in localStorage
    localStorage.setItem('user', JSON.stringify(user)); // Store user info in localStorage
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('jwt'); // Remove JWT from localStorage
    localStorage.removeItem('user'); // Remove user info from localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
