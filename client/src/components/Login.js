import React, { useState } from 'react';
import { useUser } from './UserContext'; // Import useUser hook
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Layout from './Layout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [info, setInfo] = useState('');
  const { loginUser } = useUser(); // Access loginUser from context
  const navigate = useNavigate();

  // Function to sanitize input using HTML entity encoding
  const sanitizeInput = (input) => {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#96;', // Escapes backticks
    };

    return input.replace(/[&<>"'`]/g, (char) => entityMap[char]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Ensure both email and password are provided
    if (!email || !password) {
      setInfo('Please enter both email and password.');
      return;
    }

    try {
      // Make a login request to the Express backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizeInput(email),
          password: sanitizeInput(password),
        }),
      });

      if (response.ok) {
        // Assuming your backend sends user data, token, and priv in the response
        const { user, token, priv } = await response.json();

        // Store the token and priv in localStorage
        localStorage.setItem('key', token);
        localStorage.setItem('priv', priv);

        console.log('Login successful:', user);

        // Store user info in context for global access
        loginUser(user);

        // Redirect to dashboard or protected page after successful login
        navigate('/AuthUser');
      } else {
        // Handle login failure
        const responseData = await response.json();
        setInfo(responseData.message || 'Login failed, please try again.');
      }
    } catch (error) {
      // Handle error during the fetch
      console.error('Login failed:', error);
      setInfo('Account login failed. Please try again.');
    }
  };

  const handleCreateAccount = () => {
    navigate('/CreateAccount'); // Navigates to CreateAccount page
  };

  return (
    <Layout>
      <div>
        <form onSubmit={handleLogin}>
          <label>Log In:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(sanitizeInput(e.target.value))}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(sanitizeInput(e.target.value))}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
        {info && <p>{info}</p>}

        {/* Label and Button for Create Account */}
        <div>
          <label>Don't Have An Account? </label>
          <button onClick={handleCreateAccount}>Create Account</button>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
