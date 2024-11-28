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

    const handleSignup = async () => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username: nickname }),
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
            <form>
            <h2>Create Account</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
            </form>
            </div>
            <p>{info}</p>
        </Layout>
    );
};

export default CreateAccount;