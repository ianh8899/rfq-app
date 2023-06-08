//pages/index.js

import React, { useState } from 'react'; // React library // React hooks
import axios from 'axios'; // Module for making HTTP requests
import jwt_decode from 'jwt-decode'; // import jwt-decode
import { useAuthContext } from '../contexts/AuthContext'; // Used for getting the current user data from AuthContext
import { useRouter } from 'next/router'; // Used for handling routing within the app

const Index = () => {
    // Using useState hook for form fields and response message
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Access setUser from the AuthContext and useRouter hook for routing
    const { setUser } = useAuthContext();
    const router = useRouter();

    const login = async (e) => {
        e.preventDefault(); // prevent default form submission

        try {
            // Send a post request to the server with the form data
            const res = await axios.post('http://localhost:5000/user/login', { username, password });
            const decodedToken = jwt_decode(res.data.token); // Decode the token
            localStorage.setItem('token', res.data.token); // Save the token in localStorage
            localStorage.setItem('userId', decodedToken._id); // Store user id in local storage
            setUser(decodedToken); // Update the user status globally using decoded token
            setMessage('Logged in successfully');
            router.push('/home'); // Navigate to the welcome page
        } catch (err) {
            // If an error occurred during login, display the error message
            setMessage(err.response.data.message);
        }
    };

    return (
        <div id="login-page">
            <style jsx>{`
                #login-page {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                #login-page form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    align-items: center;
                }

                #login-page label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                #login-page input {
                    padding: 10px;
                    border-radius: 30px;
                    width: 200px;
                }

                #login-page button {
                    background-color: #333;
                    border: none;
                    border-radius: 30px;
                    color: #FFF;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    padding: 10px 20px;
                    width: 200px;
                    align-self: center; 
                }

                #login-page button:hover {
                    background-color: #000000;
                }
            `}</style>
            <h2>Login</h2>
            <form onSubmit={login}>
                <label>
                    Company Name:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
};
// Export the component for use in _app.js
export default Index;