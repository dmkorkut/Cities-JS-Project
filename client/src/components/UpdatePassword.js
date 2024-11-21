import React, { useState } from 'react';
import "./UpdatePassword.css";
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';


const UpdatePassword = () =>{


    return (
        <Layout>
            <div className="update-container">
            <form id="login-form" className="form">
                    <h2>Update Password</h2>
                    
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Account email"
                        required
                    />
                    
                    <label htmlFor="password">Current Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Account password"
                        required
                    />

                    <label htmlFor="password">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Choose a new password"
                        required
                    />
                    <button type="submit">Log In</button>
                    </form>
            </div>
        </Layout>
    )
}

export default UpdatePassword;