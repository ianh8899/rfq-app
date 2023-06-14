//context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react"; // React hooks
import axios from "axios"; // Module for making HTTP requests
import jwt_decode from "jwt-decode"; // Library for decoding JWT tokens
import React from "react";
import { parseCookies } from "nookies"; // React library

// Creating a new context for user authentication
const AuthContext = createContext();

// Wrapper component for providing authentication context to child components
export function AuthWrapper({ children, user }) {
  const [currentUser, setCurrentUser] = useState(null); // Initialize the current user state as null
  const [loading, setLoading] = useState(true); // Initialize the loading state as true

  // Use an effect hook to perform side effects (i.e. to fetch user details)
  useEffect(() => {
    console.log("Running useEffect hook");
    // If a user prop is passed, set this as the current user and stop loading
    if (user) {
      console.log("User prop is provided", user);
      setCurrentUser(user);
      setLoading(false);
    } else {
      const token = parseCookies().token; // Read the cookies
      if (token) {
        console.log("Token found in cookies", token);
        // If a token is found, decode it to get the user ID
        const decodedToken = jwt_decode(token);
        // Send a GET request to fetch the user data
        axios
          .get(`http://localhost:5000/user/${decodedToken._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            console.log("User data from server", response.data);
            setCurrentUser(response.data); // If the request is successful, set the response data as the current user
          })
          .catch((error) => {
            console.error("Error fetching user data", error); // If an error occurs, log it to the console
          })
          .finally(() => {
            console.log("Setting loading to false");
            setLoading(false); // When the request completes, stop loading
          });
      } else {
        console.log("No token found in cookies");
        setLoading(false); // If no token is found, stop loading
      }
    }
  }, []); // No dependency array is passed, so this effect runs only once

  // Define the shared state that will be passed to the context
  let sharedState = {
    user: currentUser,
    setUser: setCurrentUser,
  };

  console.log("Current user state", currentUser);

  // Only render children when the user has been checked (loading is false)
  return (
    <AuthContext.Provider value={sharedState}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook for easy access to the authentication context
export function useAuthContext() {
  const context = useContext(AuthContext);
  console.log("Accessing AuthContext", context);
  return useContext(AuthContext);
}
