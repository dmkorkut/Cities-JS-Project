import React, { useState } from 'react';
import "./UpdatePassword.css";
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';


const UpdatePassword = () =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [info, setInfo] = useState('');


    const handleUpdatePassword = async() => {
        try{
            const response = await fetch('/api/updatePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password, newPassword})
            });

            const data = await response.json();

            if (response.ok){
                setInfo(data.message);
            }else{
                console.error(data.message);
            }
        }catch(error){
            console.error('Error happening while updating password', error);
        }
    };

    return (
        <Layout>
            <div className="update-container">
            <form id="login-form" className="form">
                    <h2>Update Password</h2>
                    
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Account email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <label>Current Password:</label>
                    <input
                        type="password"
                        placeholder="Account password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label>New Password:</label>
                    <input
                        type="password"
                        placeholder="Choose a new password"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={handleUpdatePassword}>Log In</button>
                    </form>
            </div>
        </Layout>
    )
}

export default UpdatePassword;