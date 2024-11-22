import React, { useState, useEffect } from 'react';
import './lab3.css';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';



const lab3 = () => {

function sanitizeInput(input) {
    // Mapping of characters to their HTML entity equivalents
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;' // Escapes backticks
    };

    // Replace each character in the map with its corresponding HTML entity
    return input.replace(/[&<>"'`]/g, (char) => entityMap[char]);
}

//Search by name function
const searchByName = async () => {
    const input = document.getElementById('search-by-name');
    const term = sanitizeInput(input.value);
    const values = document.getElementById('number').value || 10;

    try {
        // Fetch matching destinations from the backend
        const response = await fetch(`/api/match?field=Destination&pattern=${term}&n=${values}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Display results
        const displayResultData = document.getElementById("results");

        // Display only necessary fields
        const formattedData = data.map(dest => ({
            id: dest.id,
            Destination: dest.Destination,
            Region: dest.Region,
            Country: dest.Country,
            Category: dest.Category,
            Latitude: dest.Latitude,
            Longitude: dest.Longitude,
            "Approximate Annual Tourists": dest["Approximate Annual Tourists"],
            Currency: dest.Currency,
            "Majority Religion": dest["Majority Religion"],
            "Famous Foods": dest["Famous Foods"],
            Language: dest.Language,
            "Best Time to Visit": dest["Best Time to Visit"],
            "Cost of Living": dest["Cost of Living"],
            Safety: dest.Safety,
            "Cultural Significance": dest["Cultural Significance"],
            Description: dest.Description,
        }));

        displayResultData.textContent = JSON.stringify(formattedData, null, 2);

        // If there's a result, update the map to the first match
        if (formattedData.length > 0) {
            const { Latitude, Longitude } = formattedData[0];

            // Set new map coordinates in iframe
            const mapIframe = document.querySelector("#mapContainer iframe");
            mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${Longitude}%2C${Latitude}%2C${Longitude}%2C${Latitude}&layer=mapnik&marker=${Latitude}%2C${Longitude}&zoom=16`;
        } else {
            console.log("No results found.");
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = 'Error fetching data. Please try again.';
    }
};


//Search by region function
const searchByRegion = async () => {
    const input = document.getElementById('search-by-region');
    const term = sanitizeInput(input.value);
    const values = document.getElementById('number');
    const vals = values.value;

    try {
        // Fetch matching regions from the backend
        const response = await fetch(`/api/match?field=Region&pattern=${term}&n=${vals}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Display results
        const displayResultData = document.getElementById("results");

        // Display selected fields from the data returned by the API
        const formattedData = data.map(dest => ({
            id: dest.id,
            Destination: dest.Destination,
            Region: dest.Region,
            Country: dest.Country,
            Category: dest.Category,
            Latitude: dest.Latitude,
            Longitude: dest.Longitude,
            "Approximate Annual Tourists": dest["Approximate Annual Tourists"],
            Currency: dest.Currency,
            "Majority Religion": dest["Majority Religion"],
            "Famous Foods": dest["Famous Foods"],
            Language: dest.Language,
            "Best Time to Visit": dest["Best Time to Visit"],
            "Cost of Living": dest["Cost of Living"],
            Safety: dest.Safety,
            "Cultural Significance": dest["Cultural Significance"],
            Description: dest.Description,
        }));

        displayResultData.textContent = JSON.stringify(formattedData, null, 2);

        // Update the map if there are results
        if (formattedData.length > 0) {
            const { Latitude, Longitude } = formattedData[0];

            // Set new map coordinates in iframe
            const mapIframe = document.querySelector("#mapContainer iframe");
            mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${Longitude}%2C${Latitude}%2C${Longitude}%2C${Latitude}&layer=mapnik&marker=${Latitude}%2C${Longitude}&zoom=16`;
        } else {
            console.log("No results found.");
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = 'Error fetching data. Please try again.';
    }
};


//Search by country function
const searchByCountry = async () => {
    const input = document.getElementById('search-by-country');
    const term = sanitizeInput(input.value);
    const values = document.getElementById('number');
    const vals = values.value;

    try {
        // Fetch matching countries from the backend
        const response = await fetch(`/api/match?field=Country&pattern=${term}&n=${vals}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Display results
        const displayResultData = document.getElementById("results");

        // Format and display selected fields from the data returned by the API
        const formattedData = data.map(dest => ({
            id: dest.id,
            Destination: dest.Destination,
            Region: dest.Region,
            Country: dest.Country,
            Category: dest.Category,
            Latitude: dest.Latitude,
            Longitude: dest.Longitude,
            "Approximate Annual Tourists": dest["Approximate Annual Tourists"],
            Currency: dest.Currency,
            "Majority Religion": dest["Majority Religion"],
            "Famous Foods": dest["Famous Foods"],
            Language: dest.Language,
            "Best Time to Visit": dest["Best Time to Visit"],
            "Cost of Living": dest["Cost of Living"],
            Safety: dest.Safety,
            "Cultural Significance": dest["Cultural Significance"],
            Description: dest.Description,
        }));

        displayResultData.textContent = JSON.stringify(formattedData, null, 2);

        // Update the map if there are results
        if (formattedData.length > 0) {
            const { Latitude, Longitude } = formattedData[0];

            // Set new map coordinates in iframe
            const mapIframe = document.querySelector("#mapContainer iframe");
            mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${Longitude}%2C${Latitude}%2C${Longitude}%2C${Latitude}&layer=mapnik&marker=${Latitude}%2C${Longitude}&zoom=16`;
        } else {
            console.log("No results found.");
        }
    } catch (error) {
        console.error('Error fetching data:', error);

        // Update UI with an error message
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = 'Error fetching data. Please try again.';
    }
};


//Sort by destination
const sortName = async () => {
    try {
        // Fetch destination data
        const response = await fetch('/api/list');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Access and flatten the store property
        const allDestinations = Object.values(data.store).flat();

        // Sort the destinations alphabetically by name
        allDestinations.sort((dest1, dest2) => {
            const val1 = sanitizeInput(dest1.Destination.toLowerCase());
            const val2 = sanitizeInput(dest2.Destination.toLowerCase());

            return val1.localeCompare(val2);
        });

        // Display the sorted results
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(allDestinations, null, 2);

    } catch (error) {
        console.error('Error fetching or processing data:', error);

        // Update UI with an error message
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = 'Error fetching or sorting data. Please try again.';
    }
};





//Sort by region
const sortRegion = async () => {
    try {
        // Fetch destination data
        const response = await fetch('/api/list');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Access and flatten the store property
        const allDestinations = Object.values(data.store).flat();

        // Sort the destinations alphabetically by Region
        allDestinations.sort((reg1, reg2) => {
            const val1 = sanitizeInput(reg1.Region.toLowerCase());
            const val2 = sanitizeInput(reg2.Region.toLowerCase());

            return val1.localeCompare(val2);
        });

        // Display the sorted results
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(allDestinations, null, 2);

    } catch (error) {
        console.error('Error fetching or processing data:', error);

        // Update UI with an error message
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = 'Error fetching or sorting data. Please try again.';
    }
};



//Sort by Country
const sortCountry = async () => {
    try {
        // Fetch the list of destinations
        const response = await fetch('/api/list');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Access the store property and flatten the data
        const allDestinations = Object.values(data.store).flat();

        // Sort the destinations by Country field
        allDestinations.sort((count1, count2) => {
            const val1 = sanitizeInput(count1.Country.toLowerCase());
            const val2 = sanitizeInput(count2.Country.toLowerCase());

            return val1.localeCompare(val2);
        });

        // Display the sorted destinations
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(allDestinations, null, 2);

    } catch (error) {
        console.error('Error fetching or processing data:', error);

        // Display an error message to the user
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = 'Error fetching or sorting data. Please try again.';
    }
};


const searchDestination = async () => {
    try {
        const input = document.getElementById('search-by-dest');
        const term = sanitizeInput(input.value);

        // Fetch destination data from the backend API
        const response = await fetch(`/api/destination/${term}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Display the fetched data in the results container
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(data, null, 2);
        
    } catch (error) {
        console.error('Error fetching destination data:', error);

        // Display error message if fetch fails
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = 'Error fetching destination data. Please try again.';
    }
};


const searchCoordinates = async () => {
    try {
        const input = document.getElementById('search-by-coordiantes');
        const term = sanitizeInput(input.value);

        // Fetch destination coordinates from the backend API
        const response = await fetch(`/api/destinationCoordinates/${term}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Display the fetched data in the results container
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
        console.error('Error fetching coordinates:', error);

        // Display error message if fetch fails
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = 'Error fetching destination coordinates. Please try again.';
    }
};



// Create to list to be added to db.json
const createNewList = async () => {
    const input = document.getElementById('create-list');
    const regionInput = document.getElementById('create-region');
    const countryInput = document.getElementById('create-country');
    const latitudeInput = document.getElementById('create-latitude');
    const longitudeInput = document.getElementById('create-longitude');
    const currencyInput = document.getElementById('create-currency');
    const languageInput = document.getElementById('create-language');

    const term = sanitizeInput(input.value);
    const region = sanitizeInput(regionInput.value);
    const country = sanitizeInput(countryInput.value);
    const latitude = sanitizeInput(latitudeInput.value);
    const longitude = sanitizeInput(longitudeInput.value);
    const currency = sanitizeInput(currencyInput.value);
    const language = sanitizeInput(languageInput.value);

    const drop = document.getElementById('list-drop');
    const displayResultData = document.getElementById('results');

    // Validate input
    if (!term) {
        displayResultData.textContent = 'Enter a valid list name';
        return;
    }

    // Check if the list already exists
    if ([...drop.options].some(option => option.value === term)) {
        displayResultData.textContent = 'List already exists';
        return;
    }

    try {
        // POST request to add a new list
        const response = await fetch(`/api/list/${term}/${region}/${country}/${latitude}/${longitude}/${currency}/${language}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // Add new list to dropdown
            const listOption = document.createElement('option');
            listOption.value = term;
            listOption.textContent = term;
            drop.append(listOption); // Add new option to dropdown
            
            displayResultData.textContent = `List ${term} has been added`;

            // Clear input fields
            input.value = '';
            regionInput.value = '';
            countryInput.value = '';
            latitudeInput.value = '';
            longitudeInput.value = '';
            currencyInput.value = '';
            languageInput.value = '';

            // Fetch and populate the dropdown after successful list creation
            fetchAndPopulateDropdown();
        } else {
            displayResultData.textContent = 'Failed to add list';
        }
    } catch (error) {
        console.error('Error:', error);
        displayResultData.textContent = 'Failed to add list';
    }
};

// Fetch and populate the dropdown options on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    fetchAndPopulateDropdown();
});

//Keep populated even if page reload
const fetchAndPopulateDropdown = async () => {
    try {
        // Fetch data from the API
        const res = await fetch('/api/list');
        const data = await res.json();

        // Get the dropdown element
        const drop = document.getElementById('list-drop');
        drop.innerHTML = '<option value="" disabled selected>Choose a list</option>'; 

        // Populate the dropdown with the lists
        Object.keys(data.store).forEach(key => {
            data.store[key].forEach(item => {
                const listOption = document.createElement('option');
                listOption.value = sanitizeInput(item.Destination); 
                listOption.textContent = sanitizeInput(item.Destination);
                drop.append(listOption);
            });
        });
    } catch (error) {
        // Handle any errors that occur during the fetch
        console.error('Error fetching lists:', error);
    }
};

// Call the function to populate the dropdown
fetchAndPopulateDropdown();



const getAllCountry = async () => {
    const displayResultData = document.getElementById("results");

    try {
        const res = await fetch('/api/countries');
        const data = await res.json();

        // Display the fetched data in a formatted way
        displayResultData.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        // Handle any errors during the fetch request
        console.error('Error fetching countries:', error);
        displayResultData.textContent = 'Failed to load countries.';
    }
};


//Show List
const getList = async () => {
    const drop = document.getElementById('list-drop');
    const term = sanitizeInput(drop.value);
    const displayResultData = document.getElementById('results');

    if (!term) {
        displayResultData.textContent = 'Please select a value from the dropdown.';
        return;
    }

    try {
        // Fetch data for the selected list
        const res = await fetch(`/api/list/${term}`);
        
        if (!res.ok) {
            throw new Error('Failed to fetch list');
        }

        const data = await res.json();

        // Display the fetched data
        displayResultData.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        // Display a user-friendly error message
        console.error('Error:', error);
        displayResultData.textContent = 'An error occurred while fetching the list. Please try again.';
    }
};



const getListID = async () => {
    const drop = document.getElementById('list-drop');
    const term = sanitizeInput(drop.value);
    const displayResultData = document.getElementById('results');

    if (!term) {
        displayResultData.textContent = 'Please select a value from the dropdown.';
        return;
    }

    try {
        // Fetch data for the selected list ID
        const res = await fetch(`/api/destID/${term}`);

        if (!res.ok) {
            throw new Error('Failed to fetch destination ID');
        }

        const data = await res.json();

        // Display the fetched data
        displayResultData.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        // Display a user-friendly error message
        console.error('Error:', error);
        displayResultData.textContent = 'An error occurred while fetching the destination ID. Please try again.';
    }
};


const deleteList = async () => {
    const drop = document.getElementById('list-drop');
    const term = sanitizeInput(drop.value);
    const displayResultData = document.getElementById('results');

    // Check if a list is selected
    if (!term) {
        displayResultData.textContent = 'Please select a list from the dropdown to delete.';
        return;
    }

    try {
        // Perform DELETE request to remove the list
        const res = await fetch(`/api/list/${term}`, { method: 'DELETE' });

        if (res.ok) {
            // If the list is successfully deleted
            displayResultData.textContent = `List ${term} has been deleted!`;

            // Remove the deleted list option from the dropdown
            const sOption = drop.querySelector(`option[value="${term}"]`);
            if (sOption) {
                drop.removeChild(sOption);
            }
        } else if (res.status === 404) {
            // If the list was not found
            displayResultData.textContent = `List ${term} not found.`;
        } else {
            // For any other errors
            displayResultData.textContent = 'Failed to delete the list. Please try again later.';
        }
    } catch (error) {
        // Handle any fetch or network errors
        console.error('Error:', error);
        displayResultData.textContent = 'An error occurred while deleting the list. Please try again later.';
    }
};


const updateList = async() => {
    const input = document.getElementById('get-search');
    const term = sanitizeInput(input.value); // Get input search term
    const drop = document.getElementById('list-drop');
    const term2 = drop.value; // Get selected list
    const displayResultData = document.getElementById('results');

    // Check if both destination IDs and list are provided
    if (!term || !term2) {
        displayResultData.textContent = "Please provide both destination IDs and select a list.";
        return;
    }

    // Convert the input destination IDs into an array of integers
    const idArray = term.split(',').map(id => parseInt(id.trim(), 10));

    // Validate that all IDs are valid positive integers
    const valid = idArray.every(id => !isNaN(id) && id >= 0);

    if (!valid) {
        displayResultData.textContent = "Invalid IDs provided. Please ensure all IDs are valid numbers.";
        return;
    }

    try {
        // Send the request to update the list with the provided IDs
        const res = await fetch(`/api/destID/${term2}/${idArray.join(',')}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(idArray)
        });

        if (res.ok) {
            const data = await res.json(); // Parse the response as JSON
            displayResultData.textContent = `List ${term2} has been successfully updated.`;
            input.value = ''; // Clear input field
        } else {
            throw new Error('Failed to update the list. Please try again later.');
        }
    } catch (error) {
        console.error('Error:', error);
        displayResultData.textContent = `Error: ${error.message}`; // Show error message to user
    }
}


return (
    <Layout>
        <div>
          <div className="get-group">
            <h2>Get Information, Geographical Coordinates, Country Names</h2>
            <input type="search" placeholder="Give Destination ID For All Info" id="search-by-dest" />
            <button type="submit" onClick={() => searchDestination()} id="get-dest">Enter</button>
            <input type="search" placeholder="Give Destination ID for Latitude/Longitude" id="search-by-coordiantes" />
            <button type="submit" onClick={() => searchCoordinates()} id="get-coor">Enter</button>
            <button type="submit" onClick={() => getAllCountry()} id="get-count">Get All Countries</button>
          </div>
        </div>
        <div className="search">
          <h3>Searches</h3>
          <div className="search-group">
            <input type="search" placeholder="Search by name" id="search-by-name" />
            <button type="submit" onClick={() => searchByName()}>Enter</button>
            <input type="search" placeholder="Search by region" id="search-by-region" />
            <button type="submit" onClick={() => searchByRegion()}>Enter</button>
            <input type="search" placeholder="Search by country" id="search-by-country" />
            <button type="submit" onClick={() => searchByCountry()}>Enter</button>
          </div>
          <input type="search" placeholder="Number" id="number" className="value" />
        </div>
        <div className="functions">
          <h5>Lists</h5>
          <div className="create-function">
            <input type="search" placeholder="Create new list" id="create-list" />
            <input type="search" placeholder="Region" id="create-region" />
            <input type="search" placeholder="Country" id="create-country" />
            <input type="search" placeholder="Latitude" id="create-latitude" />
            <input type="search" placeholder="Longitude" id="create-longitude" />
            <input type="search" placeholder="Currency" id="create-currency" />
            <input type="search" placeholder="Language" id="create-language" />
            <button type="submit" onClick={() => createNewList()} id="create-button">Enter</button>
          </div>
          <div className="drop-bar">
            <select name="drop-lists" id="list-drop">
              <option value="" selected disabled>Choose a list</option>
            </select>
          </div>
          <div className="manage-list">
            <button type="submit" onClick={() => getList()} id="get-button">Show List</button>
            <button type="submit" onClick={() => getListID()} id="get-button">Show List ID</button>
            <div>
              <input type="search" placeholder="Create new Destination ID" id="get-search" />
              <button type="submit" onClick={() => updateList()} id="get-button">Update List</button>
            </div>
            <button type="submit" onClick={() => deleteList()} id="get-button">Delete List</button>
          </div>
        </div>
        <div className="sort">
          <h4>Sorts</h4>
          <button type="submit" onClick={() => sortName()}>By Name</button>
          <button type="submit" onClick={() => sortRegion()}>By Region</button>
          <button type="submit" onClick={() => sortCountry()}>By Country</button>
        </div>
        <div className="iframe" id="mapContainer">
          <iframe
            width="425"
            height="350"
            src="https://www.openstreetmap.org/export/embed.html?bbox=12.4964%2C41.9028%2C12.4964%2C41.9028&layer=mapnik&marker=41.9028%2C12.4964&zoom=16"
            style={{ border: "1px solid black" }}
          />
          <br />
          <small>
            <a href="https://www.openstreetmap.org/#map=16/41.9028/12.4964">Open Full Map</a>
          </small>
        </div>
        <div>
          <pre id="results"></pre>
        </div>
    </Layout>
  );



}

export default lab3;







