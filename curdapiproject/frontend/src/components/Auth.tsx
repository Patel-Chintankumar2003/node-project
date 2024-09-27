import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import api from '../api';

interface AuthProps {
    onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    axios.defaults.withCredentials = true;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = isLogin
                ? await api.post('http://localhost:5000/api/login', { email, password })
                : await api.post('http://localhost:5000/api/register', { username, email, password });

            localStorage.setItem('token', response.data.token);
            alert(isLogin ? 'Login successful' : 'Registration successful');

            // uthentication status
            if (isLogin) {
                onLogin();
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    alert('Error: ' + error.response.data.message);
                } else {
                    alert('Error: ' + error.message);
                }
            } else {
                alert('Unknown error');
            }

        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            {!isLogin && (
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4 w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
            >
                {isLogin ? 'Login' : 'Register'}
            </button>
        </form>
        <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
        >
            {isLogin ? 'Need to register?' : 'Already have an account?'}
        </button>
    </div>
    
    );
};

export default Auth;
