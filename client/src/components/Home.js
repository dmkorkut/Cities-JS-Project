import React from 'react';
import { useState, useEffect } from "react";
import Layout from './Layout';
import "./Home.css";



const Home = () => {

    function searchByName(){

    }

    function searchByRegion(){

    }

    function searchByCountry(){

    }

    return (
        <Layout>
            <div class ="description">
            <p1>Welcome to my lab 4! Currently you are on the homepage. On this homepage we offer few pieces of functionaility. To get full use of the site please create an account, then login.</p1>
            </div>
            <div className="search-groups">
            <input type="search" placeholder="Search by name" id="search-by-name" />
            <button type="submit" onClick={() => searchByName()}>Enter</button>
            <input type="search" placeholder="Search by region" id="search-by-region" />
            <button type="submit" onClick={() => searchByRegion()}>Enter</button>
            <input type="search" placeholder="Search by country" id="search-by-country" />
            <button type="submit" onClick={() => searchByCountry()}>Enter</button>
          </div>
          <div class = "all">
          <div class ="security">
          <header>
        <h2>Security & Privacy Policy</h2>
    </header>
    <section>
        <h3>Introduction</h3>
        <p>We are committed to protecting your privacy and security. This policy outlines how we handle your personal information.</p>

        <h3>Data Collection</h3>
        <p>We collect personal information such as email, name, and password for user authentication and account management. We use encryption and other security measures to protect this data.</p>

        <h3>Data Usage</h3>
        <p>Your data is used only for the purposes of account creation, login, and service delivery. We will never share your personal information without your consent unless required by law.</p>

        <h3>Security Measures</h3>
        <p>We use industry-standard security protocols such as SSL/TLS encryption and secure database storage to protect your personal data.</p>
    </section>
          </div>

          <div class = "policy">
          <header>
        <h2>Acceptable Use Policy</h2>
    </header>
    <section>
        <h3>Introduction</h3>
        <p>By using our service, you agree to comply with this Acceptable Use Policy. We reserve the right to modify this policy at any time.</p>

        <h3>Prohibited Activities</h3>
            <li>Engaging in illegal activities.</li>
            <li>Harassment or abusive behavior towards other users.</li>
            <li>Uploading or distributing harmful content (e.g., viruses, malware).</li>
       

        <h3>Consequences</h3>
        <p>Any violation of this policy may result in account suspension or termination.</p>
    </section>
          </div>

        <div class = "DMCA">
        <header>
        <h2>DMCA Notice & Takedown Policy</h2>
    </header>
    <section>
        <h3>Introduction</h3>
        <p>We respect the intellectual property rights of others and take appropriate action when we receive valid claims of copyright infringement.</p>

        <h3>Notice of Infringement</h3>
        <p>If you believe that your copyrighted work has been infringed upon on our platform, please send us a DMCA notice with the following details:</p>
            <li>Your contact information (name, email, address).</li>
            <li>Identification of the copyrighted work and proof of ownership.</li>
            <li>Details of the allegedly infringing content.</li>
            <li>A statement that you believe in good faith that the use of the material is not authorized by the copyright owner.</li>
        

        <h3>Takedown Process</h3>
        <p>Upon receiving a valid DMCA notice, we will remove the infringing content from our platform within a reasonable time frame.</p>
    </section>
        </div>
        </div>
        </Layout>
    )
}

export default Home;