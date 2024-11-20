const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const Storage = require('node-storage');
const store = new Storage('./data/db.json');


app.use('/se3316-lab3-dkorkut8390', express.static(path.join(__dirname, '../client')));

app.get('/se3316-lab3-dkorkut8390', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// Path of CSV file
const csvFilePath = path.join(__dirname, 'data', 'europe-destinations.csv');

// Global variable to store JSON data after parsing CSV
let destinations = [];

// To parse CSV data
function parseCSV(data) {
  const rows = data.split('\n');
  const headers = rows[0].split(',');
  return rows.slice(1).map((row, index) => {
    const values = row.split(',');
    const destination = { id: index + 1 }; // Add an ID based on index
    headers.forEach((header, i) => {
      destination[header.trim()] = values[i] ? values[i].trim() : '';
    });
    return destination;
  });
}

// Read and parse CSV on server startup
fs.readFile(csvFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading CSV file:', err);
  } else {
    destinations = parseCSV(data); // Store parsed data in destinations array
    console.log('CSV data successfully loaded');
  }
});

app.get('/api/destinations', (req, res) => {
  console.log(`GET request for ${req.url}`);
  res.send(destinations);
})

// Route to retrieve destination by ID (Req 1)
app.route('/api/destination/:id')
  .get((req, res) => {
    const id = parseInt(req.params.id, 10); // Parse ID from request params
    console.log(`GET request for ${req.url}`);
    
    const destination = destinations.find(d => d.id === id);
    if (destination) {
      res.json(destination);
    } else {
      res.status(404).send(`Destination with ID ${id} was not found`);
    }
  });

//Get the geographical coordinates (latitude/longitude) of a given dest ID (Req 2)
app.route('/api/destinationCoordinates/:id')
  .get((req, res) => {
    const id = parseInt(req.params.id, 10); // Parse ID from request params
    console.log(`GET request for ${req.url}`);

    const destination = destinations.find(d => d.id === id);
    if (destination){
      const {Latitude, Longitude} = destination;
      if(Latitude && Longitude){
        res.json ({Latitude, Longitude});
      }else{
        res.status(404).send(`Coordinates for destination with ID ${id} were not found`);
      }
    }else{
      res.status(404).send(`Destination with ID ${id} was not found`);
    }
  });


//Get all available county names (Req 3)
app.get('/api/countries', (req, res) => {
  console.log(`GET request for ${req.url}`);
  const countries = [...new Set(destinations.map((d) => d.Country))];
  res.send(countries);
});

app.get('/api/match', (req, res) => {
  console.log(`GET request for ${req.url}`);

  // Query params
  const { field, pattern, n } = req.query;
  
  const matchingDestinations = [];
  
  for (const destination of destinations) {
    if (destination[field] && destination[field].toLowerCase().includes(pattern.toLowerCase())) {
      matchingDestinations.push(destination); // Store the entire destination object
      
      
      if (n > 0 && matchingDestinations.length >= parseInt(n)) {
        break;
      }
    }
  }
  
  res.send(matchingDestinations);
});



//Create a new list
app.route('/api/list/:list/:region/:country/:latitude/:longitude/:currency/:language')
  .post((req, res) => {
    console.log(`POST request for ${req.url}`);
    const list = req.params.list;
    const existingList = store.get(list);
    const region = req.params.region;
    const country = req.params.country;
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;
    const currency = req.params.currency;
    const language = req.params.language;
    if(existingList !== undefined){
      return res.status(400).send(`List ${list} already exists`);
    }else{
      store.put(list, [{"Destination":`${list}`, "Region": `${region}`, "Country": `${country}`, "Latitude":`${latitude}`, "Longitude":`${longitude}`, "Currency":`${currency}`, "Language":`${language}`}]); // Store the default structure
      res.send(req.body);
    }
  });
  
  //get list
  app.route('/api/list/:list')
  .get((req, res) => {
    console.log(`GET request for ${req.url}`);
    const list = req.params.list;
    
    //Retrieve destination ID
    const destinations = store.get(list);
    if(destinations == null){
      return res.status(404).send(`List ${list} was not found`);
    }else{
      res.send(destinations);
    }
  })//delete list
  .delete((req, res) => {
    console.log(`DELETE request for ${req.url}`);
    const list = req.params.list;
    const existingList = store.get(list);
    if (existingList == undefined || existingList == null){
      return res.status(404).send(`List ${list} was not found`);
    }else{
      store.remove(list);
      res.send(`List ${list} was deleted`);
    }
  });

  //update destID
  app.post('/api/destID/:list/:id', (req, res) => {
    console.log(`POST request for ${req.url}`);
    const list = req.params.list;
    const ids = req.params.id.split(','); 

    const existingData = store.get(list);
    if (existingData == null || existingData == undefined) {
        return res.status(404).send(`List ${list} was not found`);
    }

    if (!existingData.ids) {
        existingData.ids = []; 
    }
    existingData.ids = []; // Clear existing IDs

    for (const id of ids) {
        const destinationId = parseInt(id);
        const destination = destinations.find(dest => dest.id === destinationId);

        if (destination) {
            existingData.ids.push(destinationId);
        } else {
            return res.status(404).send(`Destination ID ${id} was not found`);
        }
    }
    store.put(list, existingData); 
    res.send({ message: `Destination IDs updated for list ${list}`, ids: existingData.ids });
});



//get destID
app.get('/api/destID/:list', (req, res) => {
  console.log(`GET request for ${req.url}`);
  const list = req.params.list;
  const dest = store.get(list);

  if (dest == null || dest == undefined) {
      return res.status(404).send(`List ${list} is not found`);
  }
  const responseData = {
      ids: dest.ids || []
  };
  res.send(responseData);
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.route('/api/list')
  .get((req, res) => {
    console.log(`GET request for ${req.url}`);
    res.send(store);
  });

