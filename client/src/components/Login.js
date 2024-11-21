import React, { useState } from 'react';
import "./Login.css";
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

const Login = ({onClose}) =>{


    return (
        <Layout>
            <div className="login-container">
            <form id="login-form" className="form">
                    <h2>Log In</h2>
                    
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Account email"
                        required
                    />
                    
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Account password"
                        required
                    />
                    <button type="submit">Log In</button>
                    </form>
            </div>
        </Layout>
    )
}

export default Login;