import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Lab3 from './components/lab3';
import CreateAccount from "./components/CreateAccount.js";
import Login from "./components/Login.js";
import UpdatePassword from './components/UpdatePassword.js';
import Home from './components/Home.js';
import Admin from './components/Admin.js';
import { UserProvider } from './components/UserContext.js';
import AuthUser from './components/AuthUser.js';

function App() {
  return (
    <Router>
      <UserProvider>
      <Routes>
        <Route path="/CreateAccount" element={<CreateAccount/>}/>
        <Route path="/Lab3" element={<Lab3/>}/>
        <Route path="/AuthUser" element={<AuthUser/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/UpdatePassword" element={<UpdatePassword/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/Admin" element={<Admin/>}/>
      </Routes>
      </UserProvider>
    </Router>
  )

}

export default App;
