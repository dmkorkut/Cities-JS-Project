import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import "./CreateAccount.css";

const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [info, setInfo] = useState('');
    const navigate = useNavigate();

    // Function to sanitize input using HTML entity encoding
    const sanitizeInput = (input) => {
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#96;' // Escapes backticks
        };

        return input.replace(/[&<>"'`]/g, (char) => entityMap[char]);
    };

    const handleSignup = async () => {
        try {
            // Sanitize inputs before sending to the server
            const sanitizedEmail = sanitizeInput(email);
            const sanitizedPassword = sanitizeInput(password);
            const sanitizedNickname = sanitizeInput(nickname);

            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: sanitizedEmail, password: sanitizedPassword, username: sanitizedNickname }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setInfo(responseData.message);
                console.log('Account Created Successfully:', responseData.message);
            } else {
                const errorData = await response.json();
                setInfo(errorData.message || 'An error occurred.');
                console.error('Error creating account:', errorData.message);
            }
        } catch (error) {
            console.error('Creation of Account Has Failed:', error);
            setInfo('Creation of Account Has Failed.');
        }
    };

    return (
        <Layout>
            <div className='auth-container'>
                <form onSubmit={(e) => e.preventDefault()}>
                    <h2>Create Account</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                    />
                    <input
                        type="text"
                        placeholder="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(sanitizeInput(e.target.value))}
                    />
                    <button onClick={handleSignup}>Sign Up</button>
                </form>
            </div>
            <p>{info}</p>
        </Layout>
    );
};

export default CreateAccount;
