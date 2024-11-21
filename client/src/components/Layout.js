import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';


function Layout ({children}) {
    const navigate = useNavigate();
    const navigateHome = () => navigate('/');
    const navigateLogin = () => navigate('/Login');
    const navigateCreateAccount = () => navigate('/CreateAccount');
    const navigateAuthPortal = () => navigate('/lab3');
    const navigateAdminPortal = () => navigate('/Admin');
    const navigateUpdatePassword = () => navigate('/UpdatePassword');


    function handleLogout(){
        
    }


    return (
        <div className="container">
            <h1>SE3316 dkorkut Lab 4</h1>
            <div className="nav-links">
                <a href="#" onClick={navigateHome}>Home</a>
                <a href="#" onClick={navigateAuthPortal}>Authenticated User Portal</a>
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