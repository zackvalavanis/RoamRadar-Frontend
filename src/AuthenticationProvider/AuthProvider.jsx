import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // Load auth state from localStorage when the component first mounts
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const user = localStorage.getItem('user');

    // Check if user and jwt exist in localStorage before parsing
    if (jwt && user) {
      try {
        const parsedUser = JSON.parse(user);
        setAuth({
          ...parsedUser, // Spread the user object including is_admin
          jwt, // Ensure jwt is included as well
        });
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const login = (user) => {
    setAuth(user); // Set auth state with the full user object
    localStorage.setItem('jwt', user.jwt); // Store JWT
    localStorage.setItem('user', JSON.stringify(user)); // Store user object including is_admin
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
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
