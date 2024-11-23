import React from 'react';
import { useState, useEffect } from "react";
import Layout from './Layout';
import "./Home.css";
import { useNavigate } from 'react-router-dom';


const Home = () => {

    const navigate = useNavigate();
  
  // Manage search parameters
  const [searchParams, setSearchParams] = useState({
    destination: '',
    region: '',
    country: '',
  });

  const [searchResults, setSearchResults] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  

  // Handle changes in the search input fields
  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  // Perform search when the search button is clicked
  const searchByAll = async () => {
    try {
      // Create query string from search parameters
      const queryString = Object.entries(searchParams)
        .filter(([key, value]) => value !== '')  // Exclude empty fields
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      // Fetch the data from the backend
      const response = await fetch(`/api/searchDest?${queryString}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Search failed', error);
    }
  };

    const handleViewDetails = async(destination) =>{
      try {
        const response = await fetch(`/api/searchDest/${destination}`);
        if (response.ok) {
          const data = await response.json();
          setSelectedDestination(data);
        } else {
          console.error(`Failed to fetch details for destination with ID ${destination}`);
        }
      } catch (error) {
        console.error(`Failed to fetch details for destination with ID ${destination}`, error);
      }
      
    }

    

    return (
        <Layout>
            <div class ="description">
            <p>Welcome to my lab 4! Currently you are on the homepage. On this homepage we offer few pieces of functionaility. To get full use of the site please create an account, then login.</p>
            </div>
            <div className="search-groups">
            <input type="search" placeholder="Search by name" name="destination" value={searchParams.destination} onChange={handleChange} />
            <input type="search" placeholder="Search by region" name ="region" value={searchParams.region}  onChange={handleChange}/>
            <input type="search" placeholder="Search by country" name ="country" value={searchParams.country}  onChange={handleChange}/>
            <button type="submit" onClick={searchByAll}>Enter</button>
          </div>
          <div>
            <h3>Search Results</h3>
            <ul className='search-results-list'>
                {searchResults.map((destination) => (
                    <li key = {destination.id}>
                        <div>
                            {destination.destination}, {destination.country}{' '}
                            <button className='all-details' onClick={() => handleViewDetails(destination.destination)}>All Information</button>
                        </div>
                        {selectedDestination && selectedDestination.destination === destination.destination && (
                            <div className='all-details'>
                            <h4>{selectedDestination.destination} All Information:</h4>
                            <p>Destination: {selectedDestination.destination}</p>
                            <p>Region: {selectedDestination.region}</p>
                            <p>Country: {selectedDestination.country}</p>
                            <p>Category: {selectedDestination.category}</p>
                            <p>Latitude: {selectedDestination.latitude}</p>
                            <p>Longitude: {selectedDestination.longitude}</p>
                            <p>Approximate Annual Tourists: {selectedDestination["Approximate Annual Tourists"]}</p>
                            <p>Currency: {selectedDestination.currency}</p>
                            <p>Majority Religion: {selectedDestination["Majority Religion"]}</p>
                            <p>Famous Foods: {selectedDestination["Famous Foods"]}</p>
                            <p>Language: {selectedDestination.language}</p>
                            <p>Best Time to Visit: {selectedDestination["Best Time to Visit"]}</p>
                            <p>Cost of Living: {selectedDestination["Cost of Living"]}</p>
                            <p>Safety: {selectedDestination.safety}</p>
                            <p>Cultural Significance: {selectedDestination["Cultural Significance"]}</p>
                            <p>Description: {selectedDestination.description}</p>
                            <button onClick={() => window.open(selectedDestination.ddgButton, '_blank')}>
                                DDG Search
                            </button>
                            </div>
                        )}
                    </li>
                )) }
            </ul>
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