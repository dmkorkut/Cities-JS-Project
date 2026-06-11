import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';
import { useUser } from './UserContext';

function Layout ({children}) {
    const navigate = useNavigate();
    const navigateHome = () => navigate('/');
    const navigateLogin = () => navigate('/Login');
    const navigateCreateAccount = () => navigate('/CreateAccount');
    const lab3Functionality = () => navigate('/lab3');
    const navigateAdminPortal = () => navigate('/Admin');
    const navigateUpdatePassword = () => navigate('/UpdatePassword');
    const navigateAuthUser = () => navigate('/AuthUser');
    const { logoutUser } = useUser(); // Access logoutUser from context
      
        const handleLogout = () => {
          logoutUser();  // Clear user data from context
          localStorage.removeItem('token');  // Remove token from localStorage
          navigate('/login');  // Redirect to login page
        };


    return (
        <div className="container">
            <h1>Destinations Project</h1>
            <div className="nav-links">
                <a href="#" onClick={navigateHome}>Home</a>
                <a href="#" onClick={lab3Functionality}>Lab 3 Functionality</a>
                <a href="#" onClick={navigateAuthUser}>Authenticated User</a>
                <a href="#" onClick={navigateAdminPortal}>Admin Portal</a>
                <a href="#" onClick={navigateUpdatePassword}>Update Password</a>
                <a href="#" onClick={navigateLogin}>Log In</a>
                <button onClick={handleLogout}>Log Out</button>
            </div>
            <div className="cartButtonStyle">
                    <a href="#" className="buttonTextStyle" onClick={navigateCreateAccount}>
                        Create Account
                    </a>
                </div>
                <main className="main-content">
                {children}
            </main>
            </div>

        
    )
}

export default Layout;