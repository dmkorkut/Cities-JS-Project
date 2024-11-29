import React from 'react';
import { useState, useEffect } from "react";
import Layout from './Layout';
import "./Home.css";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [expandedList, setExpandedList] = useState(null);

    // Toggle function to expand/retract the details
    const toggleExpand = (name) => {
        setExpandedList(prev => (prev === name ? null : name)); // Toggle expand/retract
    };

    // Manage search parameters
    const [searchParams, setSearchParams] = useState({
        destination: '',
        region: '',
        country: '',
    });

    const [searchResults, setSearchResults] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState([]);
    const [publicDestinationLists, setPublicDestinationLists] = useState([]);

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

    useEffect(() => {
        // Fetch the user's lists when the component mounts
        fetchPublicDestinationLists();
    }, []);

    // Handle changes in the search input fields with sanitization
    const handleChange = (e) => {
        const sanitizedValue = sanitizeInput(e.target.value); // Sanitize input
        setSearchParams({
            ...searchParams,
            [e.target.name]: sanitizedValue, // Use sanitized value
        });
    };

    const fetchPublicDestinationLists = async () => {
        try {
            const response = await fetch('/api/publicDestLists');
            if (response.ok) {
                const data = await response.json();
                setPublicDestinationLists(data);
            } else {
                console.error('Failed to fetch public destination lists');
            }
        } catch (error) {
            console.error('Failed to fetch', error);
        }
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

    const handleViewDetails = async (destination) => {
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
    };

    

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
            <h2>Search Results</h2>
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
                            <p>Approximate Annual Tourists: {selectedDestination.approximateAnnualTourists}</p>
                            <p>Currency: {selectedDestination.currency}</p>
                            <p>Majority Religion: {selectedDestination.majorityReligion}</p>
                            <p>Famous Foods: {selectedDestination.famousFoods}</p>
                            <p>Language: {selectedDestination.language}</p>
                            <p>Best Time to Visit: {selectedDestination.bestTimeToVisit}</p>
                            <p>Cost of Living: {selectedDestination.costOfLiving}</p>
                            <p>Safety: {selectedDestination.safety}</p>
                            <p>Cultural Significance: {selectedDestination.culturalSignificance}</p>
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
          <div>
      <h2>Public Destination Lists</h2>
      <ul>
        {publicDestinationLists.map((list) => (
          <li key={list.name}>
            <div>
              <h3>{list.name}</h3>
              <p>Last Modified Date: {new Date(list.lastEditedTime).toLocaleString()}</p>
              <p>Creator: {list.creatorName}</p>
              <p>Number of Destinations: {list.numberOfDestination}</p>
              <p>Average Rating: {list.averageRating}</p>
            </div>
            <div>
  <h3 onClick={() => toggleExpand(list.name)} style={{ cursor: 'pointer' }}>
    Expand
    {expandedList === list.name ? ' ▼' : ' ►'} {/* Add expand/retract indicator */}
  </h3>
  {expandedList === list.name && (
    <div>
      <p>Description: {list.description}</p>
      <p>Destinations: {list.destinationCollection.join(', ')}</p>
      <p>Countries: {list.countryCollection.join(', ')}</p>
      <p>Regions: N/A</p>
      <br />
      
      <h2>Reviews</h2>
      {list.reviews && list.reviews.length > 0 ? (
        list.reviews
          .filter(review => !review.hidden) // Filter out hidden reviews
          .map((review, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd' }}>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Reviewed by:</strong> {review.reviewUser}</p>
              <p><strong>Comment:</strong> {review.comment || 'No comment provided'}</p>
              <p><strong>Created on:</strong> {new Date(review.creationDate).toLocaleString()}</p>
              <p><strong>Hidden:</strong> {review.hidden ? 'Yes' : 'No'}</p>
            </div>
          ))
      ) : (
        <p>No reviews available</p>  // Handle the case when reviews are not defined or empty
      )}
    </div>
  )}
</div>


          </li>
        ))}
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
        <h3>Contact Info For Sending Notices of Infringement</h3>
        <p>Phone: 905-555-5555
          <br></br>
          Email: admin@uwo.ca
        </p>
    </section>
        </div>
        </div>
        </Layout>
    )
}

export default Home;