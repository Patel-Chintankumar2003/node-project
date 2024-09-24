import React, { useState } from 'react';
import axios from 'axios';
import "./App.css"

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const loginUser = async () => {
    try {
      console.log("api before ok")
     axios.defaults.withCredentials = true;
     console.log("api after ok2")
     const response = await axios.post('http://localhost:5000/api/users/login', { email , password },{
      
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // This ensures cookies are included in the request
      });
      console.log("ok 3")
      setMessage(`Logged in! Token: ${response.data.token}`);
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  return (
    <div className="login-container">
    <h1>Login</h1>
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
    <button onClick={loginUser}>Login</button>
    <p>{message}</p>
</div>


  );
};

export default App;
