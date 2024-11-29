import React, { useState } from 'react';
import "./UpdatePassword.css";
import Layout from './Layout';

const UpdatePassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [info, setInfo] = useState('');

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

    const handleUpdatePassword = async (e) => {
        e.preventDefault(); // Prevent form reload

        try {
            const response = await fetch('/api/updatePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: sanitizeInput(email),
                    password: sanitizeInput(password),
                    newPassword: sanitizeInput(newPassword),
                })
            });

            const data = await response.json();

            if (response.ok) {
                setInfo(data.message);
            } else {
                console.error(data.message);
                setInfo(data.message);
            }
        } catch (error) {
            console.error('Error occurred while updating password:', error);
        }
    };

    return (
        <Layout>
            <div className="update-container">
                <form id="update-form" className="form" onSubmit={handleUpdatePassword}>
                    <h2>Update Password</h2>

                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Account email"
                        value={email}
                        onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                    />

                    <label>Current Password:</label>
                    <input
                        type="password"
                        placeholder="Account password"
                        value={password}
                        onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                    />

                    <label>New Password:</label>
                    <input
                        type="password"
                        placeholder="Choose a new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(sanitizeInput(e.target.value))}
                    />

                    <button type="submit">Update Password</button>
                    {info && <p className="info-message">{info}</p>} {/* Feedback message */}
                </form>
            </div>
        </Layout>
    );
};

export default UpdatePassword;
