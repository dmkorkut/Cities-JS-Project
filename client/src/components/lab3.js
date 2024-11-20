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
function searchByName() {
    const input = document.getElementById('search-by-name');
    const term = sanitizeInput(input.value);
    const values = document.getElementById('number').value || 10;

    // Fetch matching destinations from the backend
    fetch(`/api/match?field=Destination&pattern=${term}&n=${values}`)
        .then(res => res.json())
        .then(data => {
            const displayResultData = document.getElementById("results");

            // Display only necessary fields: Destination, Latitude, and Longitude
            const formattedData = data.map(dest => ({
                id : dest.id,
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
                Description: dest.Description
                
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
        })
        .catch(error => console.error('Error fetching data:', error));
}

//Search by region function
function searchByRegion() {
    const input = document.getElementById('search-by-region');
    const term = sanitizeInput(input.value);
    const values = document.getElementById('number');
    const vals = values.value;

    // Fetch matching regions from the backend
    fetch(`/api/match?field=Region&pattern=${term}&n=${vals}`)
        .then(res => res.json())
        .then(data => {
            const displayResultData = document.getElementById("results");

            // Display selected fields from the data returned by the API
            const formattedData = data.map(dest => ({
                id : dest.id,
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
                Description: dest.Description
            }));

            // Display the formatted data
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
        })
        .catch(error => console.error('Error fetching data:', error));
}


//Search by country function
function searchByCountry() {
    const input = document.getElementById('search-by-country');
    const term = sanitizeInput(input.value);
    const values = document.getElementById('number');
    const vals = values.value;

    // Fetch matching countries from the backend
    fetch(`/api/match?field=Country&pattern=${term}&n=${vals}`)
        .then(res => res.json())
        .then(data => {
            const displayResultData = document.getElementById("results");

            // Display selected fields from the data returned by the API
            const formattedData = data.map(dest => ({
                id : dest.id,
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
                Description: dest.Description
            }));

            // Display the formatted data
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
        })
        .catch(error => console.error('Error fetching data:', error));
}


function showMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.style.display = 'flex'; // Make the map visible
    }
}

//Sort by destination
function sortName() {
    fetch('/api/list')
    .then(res => res.json())
    .then(data => {
        // Access the store property
        const allDestinations = Object.values(data.store).flat();

        // Sort the destinations
        allDestinations.sort((dest1, dest2) => {
            const val1 = sanitizeInput(dest1.Destination.toLowerCase());
            const val2 = sanitizeInput(dest2.Destination.toLowerCase());
        
            if (val1 < val2) {
                return -1;
            }
            if (val1 > val2) {
                return 1;
            }
            return 0;
        });

        // Display the sorted results
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(allDestinations, null, 2);
    })
    .catch(error => console.error('Error fetching data:', error)); // Handle any errors
}




//Sort by region
function sortRegion() {
    fetch('/api/list')
    .then(res => res.json())
    .then(data => {
        // Access the store property
        const allDestinations = Object.values(data.store).flat();

        // Sort the destinations
        allDestinations.sort((reg1, reg2) => {
            const val1 = sanitizeInput(reg1.Region.toLowerCase());
            const val2 = sanitizeInput(reg2.Region.toLowerCase());
        
            if (val1 < val2) {
                return -1;
            }
            if (val1 > val2) {
                return 1;
            }
            return 0;
        });

        // Display the sorted results
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(allDestinations, null, 2);
    })
    .catch(error => console.error('Error fetching data:', error)); // Handle any errors
}


//Sort by Country
function sortCountry() {
    fetch('/api/list')
    .then(res => res.json())
    .then(data => {
        // Access the store property
        const allDestinations = Object.values(data.store).flat();

        // Sort the destinations
        allDestinations.sort((count1, count2) => {
            const val1 = sanitizeInput(count1.Country.toLowerCase());
            const val2 = sanitizeInput(count2.Country.toLowerCase());
        
            if (val1 < val2) {
                return -1;
            }
            if (val1 > val2) {
                return 1;
            }
            return 0;
        });

        // Display the sorted results
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(allDestinations, null, 2);
    })
    .catch(error => console.error('Error fetching data:', error)); // Handle any errors
}

function searchDestination(){
    const input = document.getElementById('search-by-dest');
    const term = sanitizeInput(input.value);

    //fetch destination
    fetch(`/api/destination/${term}`)
    .then(res => res.json())
    .then(data => {
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(data, null, 2);
    });
}

function searchCoordinates(){
    const input = document.getElementById('search-by-coordiantes');
    const term = sanitizeInput(input.value);

    //fetch destination Coordinates
    fetch(`/api/destinationCoordinates/${term}`)
    .then(res => res.json())
    .then(data => {
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(data, null, 2);
    });
}


// Create to list to be added to db.json
function createNewList() {
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

    // POST request to add a new list
    fetch(`/api/list/${term}/${region}/${country}/${latitude}/${longitude}/${currency}/${language}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        if (res.ok) {
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

            fetchAndPopulateDropdown();
        } else {
            displayResultData.textContent = 'Failed to add list';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayResultData.textContent = 'Failed to add list';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndPopulateDropdown();
});

//Keep populated even if page reload
function fetchAndPopulateDropdown() {
    fetch('/api/list')
        .then(res => res.json())
        .then(data => {
            const drop = document.getElementById('list-drop');
            drop.innerHTML = '<option value="" disabled selected>Choose a list</option>'; 

            // Populate dropdown with existing lists
            Object.keys(data.store).forEach(key => {
                data.store[key].forEach(item => {
                    const listOption = document.createElement('option');
                    listOption.value = sanitizeInput(item.Destination); 
                    listOption.textContent = sanitizeInput(item.Destination);
                    drop.append(listOption);
                });
            });
        })
        .catch(error => console.error('Error fetching lists:', error));
}
fetchAndPopulateDropdown();

function getAllCountry(){
    //fetch all countries
    fetch(`/api/countries`)
    .then(res => res.json())
    .then(data => {
        const displayResultData = document.getElementById("results");
        displayResultData.textContent = JSON.stringify(data, null, 2);
    });
}

//Show List
function getList(){
    const drop = document.getElementById('list-drop');
    const term = sanitizeInput(drop.value);
    const displayResultData = document.getElementById('results');
    if(term){
        fetch(`/api/list/${term}`)
        .then(res => res.json())
        .then(data => {
            displayResultData.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }else{
        displayResultData.textContent = ('Please select a value from drop')
    }
}


function getListID(){
    const drop = document.getElementById('list-drop');
    const term = sanitizeInput(drop.value);
    const displayResultData = document.getElementById('results');
    if(term){
        fetch(`/api/destID/${term}`)
        .then(res => res.json())
        .then(data => {
            displayResultData.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }else{
        displayResultData.textContent = ('Please select a value from drop')
    }
}

function deleteList() {
    const drop = document.getElementById('list-drop');
    const term = sanitizeInput(drop.value);
    const displayResultData = document.getElementById('results');
    
    if (term) {
        fetch(`/api/list/${term}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (res.status === 200) {
                    displayResultData.textContent = `List ${term} has been deleted!`;

                    // Fix the query selector to correctly find the option
                    const sOption = drop.querySelector(`option[value="${term}"]`);
                    if (sOption) {
                        drop.removeChild(sOption); // Remove the option from the dropdown
                    }
                } else if (res.status === 404) {
                    displayResultData.textContent = `List ${term} is not found.`;
                } else {
                    console.log('Could not delete list');
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    } else {
        displayResultData.textContent = 'Select a value from the dropdown for deletion.';
    }
}

function updateList() {
    const input = document.getElementById('get-search');
    const term = sanitizeInput(input.value); 
    const drop = document.getElementById('list-drop');
    const term2 = drop.value;
    const displayResultData = document.getElementById('results');

    if (term && term2) { 
        
        const idArray = term.split(',').map(id => parseInt(id, 10));
        const valid = idArray.every(id => !isNaN(id) && id >= 0);

        if (valid) {
            // Prepare the request to send IDs
            fetch(`/api/destID/${term2}/${idArray.join(',')}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(idArray) 
            })
            .then(res => {
                if (res.ok) { 
                    return res.json(); 
                } else {
                    throw new Error('Failed to update the list'); 
                }
            })
            .then(data => {
                displayResultData.textContent = `List ${term2} has been updated`;
                input.value = ''; 
            })
            .catch(error => {
                console.error('Error', error);
                displayResultData.textContent = `Error: ${error.message}`; // Display error message
            });
        } else {
            displayResultData.textContent = "Invalid IDs provided";
        }
    } else {
        displayResultData.textContent = "Please provide both destination IDs and a list";
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







