import React from 'react';
import { useState, useEffect } from "react";
import Layout from './Layout';
import "./CreateAccount.css";





const CreateAccount = () => {

    function handleSignup(){

    }

    return (
        <Layout>
            <div className="auth-container">
                <form id="signup-form" className="form" onSubmit={(e) => handleSignup(e)}>
                    <h2>Create an Account</h2>
                    
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Choose a email"
                        required
                    />
                    
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Choose a password"
                        required
                    />
                    
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        placeholder="Choose a nickname"
                        required
                    />
                    
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </Layout>
    );
    
}

export default CreateAccount;