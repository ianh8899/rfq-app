import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const login = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/login', { username, password });
            localStorage.setItem('auth-token', res.data);
            setMessage('Logged in successfully');
        } catch (err) {
            setMessage(err.response.data);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={login}>
                <label>
                    Username:
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

export default Login;
