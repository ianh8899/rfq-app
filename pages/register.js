// pages/register.js
import React, { useState } from "react"; // React library // React hooks
import axios from "axios"; // Module for making HTTP requests

const Register = () => {
  // Set up useState hooks for username, password, and message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // This function handles the registration process
  const register = async (e) => {
    e.preventDefault(); //Prevent the default form submission behavior

    try {
      // Send POST request to server with entered username and password
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`, {
        username,
        password,
      });
      setMessage("Registered successfully"); // Update the message if registration is successful
    } catch (err) {
      setMessage(err.response.data); // Update the message if there is an error
    }
  };

  return (
    <div id="register-page">
      <style jsx>{`
        #register-page {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #register-page form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        #register-page label {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #register-page input {
          padding: 10px;
          border-radius: 30px;
          width: 200px;
        }

        #register-page button {
          background-color: #333;
          border: none;
          border-radius: 30px;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.3s ease;
          padding: 10px 20px;
          width: 200px;
          align-self: center;
        }

        #register-page button:hover {
          background-color: #000000;
        }
      `}</style>
      <h2>Register as a Supplier</h2>
      <form onSubmit={register}>
        <label>
          Company Name:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

// Export the component for use in _app.js
export default Register;
