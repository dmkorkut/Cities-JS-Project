const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const Storage = require('node-storage');
const store = new Storage('./data/db.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const validator = require('validator');
const jwt = require('jsonwebtoken');


mongoose.connect('mongodb+srv://dkorkut:danielwestern@cluster0.xxodj.mongodb.net/Lab4Work', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
      console.log('DB Connected');
  })
  .catch((e) => {
      console.log('DB not Connected', e);
  })

app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

const User = mongoose.model('User', {
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  username: {type: String, required: true},
  salt: {type: String, required: true},
  disabled: {type: Boolean, default: false},
  verified: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false},
  list: {
    type:[{
    name: {type: String, unique: true, required: true},
    description: { type: String },
    destinationCollection: { type: [String], required: true },
    countryCollection: {type: [String], required: true},
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    lastEditedTime: { type: Date, default: Date.now },
    reviews: [{
      rating: {type: Number, required: true},
      reviewUser: {type: String, required: true},
      comment: {type: String},
      creationDate: {type: Date, default: Date.now()},
      hidden: {type: Boolean, default: false}
    }]
    }],
    default: []
  }
})

passport.use(new LocalStrategy({usernameField: 'email', passReqToCallback: true}, async function verify(req, email, password, cb) {
  console.log(`${email} and ${password}`);
  host = req.host;
  console.log(host);

  try{
    const user = await User.findOne({email});

    if(!user){
      return cb(null, false, {message: 'Incorrect email or password'});
    }
    if (user.disabled === true){
      return cb (null, false, {message: 'Contact site Admin'});
    }
    if(!user.verified){
      console.log("unverified");
      const verificationLink = `http://${req.headers.host}/api/verify/${email}/${user._id}`
      return cb(null, false, {message: `Verify your email ${verificationLink}`});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch){
      console.log('Passwords do not Match');
      return cb (null, false, {message: 'Incorrect Email or Password'});
    }

    console.log("Authenticated");
    return cb(null, user, {message: 'Valid User'});
  }catch(error) {
    console.log(error);
    return cb(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    if(!user){
      return done(null, false, {message: 'User not found.'});
    }
    return done(null, user);
  }catch (error){
    console.error('Error finding user by ID', error);
    return done(error);
  }
});


app.post('/api/signup', async(req, res) => {
  try{
    const {email, password, username} = req.body;

    if(!validator.isEmail(email) || password.length < 6){
      return res.status(400).json({message: 'Invalid email or password format'});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(409).json({message: 'Email already exists'});
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      salt
    });

    await newUser.save();
    const verificationLink = `http://${req.headers.host}/api/verify/${email}/${newUser._id}`

    return res.status(201).json({message: `Registeration Success. Use Verification Link ${verificationLink} to verify account`});
  }catch(error){
    console.error(error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
});




app.get('/api/verify/:email/:userId', async (req, res) => {
  const {email, userId} = req.params;

  try{
    const user = await User.findOne({email});
    if(!user || !userId){
      return res.status(400).json({message: 'Invalid verification link'});
    }
    user.verified = true;
    await user.save();

    res.json({message: 'Email address verified successfully'});
  }catch (error){
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});


app.post('/api/login', async (req, res, next) => {
  try {
    const host = req.headers.host;
    req.host = host;

    passport.authenticate('local', { host }, async (err, user, info) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!user) {
        const message = info && info.message ? info.message : 'Authentication failed';
        return res.status(401).json({ message });
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        const priv = user.isAdmin;
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '24h' });
        return res.status(200).json({ message: 'Login successful', user, token, priv });
      });
    })(req, res, next);
  } catch (error) {
    console.error('Error during authentication:', error);
    const errorMessage = error && error.info ? error.info.message : 'Authentication failed';
    return res.status(401).json({ message: errorMessage });
  }
});


app.put('/api/updatePassword', async (req, res) =>{
  try{
    const{email, password, newPassword} = req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({message: 'User cannot be found'});
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if(!passMatch){
      return res.status(401).json({message: 'Not correct password'});
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    console.log("Password Updated");
    await user.save();

    return res.status(200).json({message: 'Password has been updated'});
  }catch(error){
    console.error(error);
    return res.status(500).json({message: 'Internal Server Error'});

  }
});
  
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





app.get('/api/searchDest', (req, res) => {
  console.log(`GET request for ${req.url}`);
  const { destination, region, country } = req.query;
  const matchingDestinations = [];

  const removeWhiteSpace = str => str.replace(/\s/g, '').toLowerCase();

  const softMatch = (str1, str2) => {
    if (str1 === str2 || str1.startsWith(str2)) {
      return true;
    }
    if (str2.length > 3) {
      const minLength = str2.length;
      let diffCount = 0;
      for (let i = 0; i < minLength; i++) {
        if (str1[i] !== str2[i]) {
          diffCount++;
          if (diffCount > 2 || str1.length < 2) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  };

  for (const dest of destinations) {
    // Ensure destination, region, and country are being properly checked
    const isDestMatch = !destination || softMatch(removeWhiteSpace(dest.Destination), removeWhiteSpace(destination));
    const isRegionMatch = !region || (dest.Region && softMatch(removeWhiteSpace(dest.Region), removeWhiteSpace(region)));
    const isCountryMatch = !country || (dest.Country && softMatch(removeWhiteSpace(dest.Country), removeWhiteSpace(country)));

    if (isDestMatch && isRegionMatch && isCountryMatch) {
      // Push both destination and country to the results
      matchingDestinations.push({
        destination: dest.Destination,
        country: dest.Country,
        region: dest.Region,
      });
    }
  }

  console.log(matchingDestinations); // Debugging: log the results before sending
  res.send(matchingDestinations);
});


app.get('/api/searchDest/:destination', (req, res) => {
  console.log(`GET request for ${req.url}`);

  // Use lowercase 'destination' as that's how it's defined in the route param
  const destName = req.params.destination.toLowerCase();

  // Find the destination by matching the name (case-insensitive)
  const destination = destinations.find(d => d.Destination.toLowerCase() === destName);

  if (destination) {
    const destinationInfo = {
      destination: destination.Destination,
      region: destination.Region,
      country: destination.Country,
      category: destination.Category,
      latitude: destination.Latitude,
      longitude: destination.Longitude,
      approximateAnnualTourists: destination["Approximate Annual Tourists"],
      currency: destination.Currency,
      majorityReligion: destination["Majority Religion"],
      famousFoods: destination["Famous Foods"],
      language: destination.Language,
      bestTimeToVisit: destination["Best Time to Visit"],
      costOfLiving: destination["Cost of Living"],
      safety: destination.Safety,
      culturalSignificance: destination["Cultural Significance"],
      description: destination.Description
    };

    // Create a DuckDuckGo search URL using the destination name
    const ddgSearchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(destination.Destination)}`;
    destinationInfo.ddgButton = ddgSearchUrl;

    res.send(destinationInfo);
  } else {
    res.status(404).send(`Destination ${destName} was not found`);
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
  app.post('/api/destID/:list/:id',  (req, res) => {
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


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }

      // Attach the decoded user ID to the request object
      req.userId = decoded.userId;
      next();
  });
};


app.post('/api/createPublicList', verifyToken, async (req, res) => {
  try {
    // Get user ID from the request object (set by the verifyToken middleware)
    const userId = req.userId;

    const { name, description, destinationCollection, countryCollection, visibility } = req.body;

    // Validate destinationCollection and countryCollection
    if (!Array.isArray(destinationCollection) || !Array.isArray(countryCollection)) {
      return res.status(400).json({ message: 'Destination and Country Collections must exist and be arrays' });
    }

    // Check if both arrays have the same length
    if (destinationCollection.length !== countryCollection.length) {
      return res.status(400).json({ message: 'Destination and Country Collections must have the same number of items' });
    }

    // Validate list name
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'List name cannot be empty' });
    }

    // Find the logged-in user using the userId from the decoded token
    const user = await User.findById(userId);  // Use userId from the token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has already reached the maximum number of lists
    if (user.list.length >= 20) {
      return res.status(400).json({ message: 'You cannot create more than 20 lists' });
    }

    // Check for duplicate list name
    const existingList = user.list.some((list) => list.name === name.trim());
    if (existingList) {
      return res.status(409).json({ message: 'List name already exists' });
    }

    // Create new list
    const newList = {
      name: name.trim(),
      description: description || '',
      destinationCollection: destinationCollection.map(String), // Ensure each item is a string
      countryCollection: countryCollection.map(String), // Ensure each item is a string
      visibility: visibility || 'private', // Default to private if not provided
      lastEditedTime: new Date(),
    };

    // Save the new list to the user's list array in the database
    user.list.push(newList);
    await user.save(); // Save the updated user document with the new list

    // Respond with a success message and the new list
    res.status(201).json({ message: 'List created successfully', list: newList });
  } catch (error) {
    console.error('Error creating public list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.put('/api/editList/:listName', verifyToken, async (req, res) => {
  try {
    // Get user ID from the request object (set by the verifyToken middleware)
    const userId = req.userId;

    const { listName } = req.params;
    const { description, destinationCollection, countryCollection, visibility } = req.body;

    // Validate destinationCollection and countryCollection
    if (!Array.isArray(destinationCollection) || !Array.isArray(countryCollection)) {
      return res.status(400).json({ message: 'Destination and Country Collections must exist and be arrays' });
    }

    // Check if both arrays have the same length
    if (destinationCollection.length !== countryCollection.length) {
      return res.status(400).json({ message: 'Destination and Country Collections must have the same number of items' });
    }

    // Find the user using the userId from the decoded token
    const user = await User.findById(userId);  // Use the userId from the token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the list by name
    const listIndex = user.list.findIndex((list) => list.name === listName);
    if (listIndex === -1) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Edit the list
    user.list[listIndex].description = description || '';
    user.list[listIndex].destinationCollection = destinationCollection.map(String);
    user.list[listIndex].countryCollection = countryCollection.map(String);
    user.list[listIndex].visibility = visibility || 'private';
    user.list[listIndex].lastEditedTime = new Date();

    await user.save(); // Save the updated user document with the edited list

    res.status(200).json({ message: 'List edited successfully', list: user.list[listIndex] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/api/getList', verifyToken, async (req, res) => {
  try {
    // Get user ID from the request object (set by the verifyToken middleware)
    const userId = req.userId;

    // Find the user using the userId from the decoded token
    const user = await User.findById(userId);  // Use userId from the token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has any lists
    if (!user.list || user.list.length === 0) {
      return res.status(404).json({ message: 'No lists found' });
    }

    // Respond with the user's lists
    res.status(200).json({ lists: user.list });
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.delete('/api/deleteList/:listName', verifyToken, async (req, res) => {
  try {
    // Get user ID from the request object (set by the verifyToken middleware)
    const userId = req.userId;
    const { listName } = req.params;

    // Find the user using the userId from the decoded token
    const user = await User.findById(userId);  // Use userId from the token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the list to delete
    const listIndex = user.list.findIndex(list => list.name === listName);
    if (listIndex === -1) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Log the list deletion
    console.log(`Deleting list: ${user.list[listIndex].name}`);

    // Remove the list from the user's list array
    user.list.splice(listIndex, 1);

    // If the user list is empty, reset it to an empty array
    if (user.list.length === 0) {
      console.log("User list is now empty, resetting to an empty array.");
      user.list = [];
    }

    // Save the updated user document
    await user.save();
    console.log("User list after deletion:", user.list);

    // Respond with success message and updated list
    res.status(200).json({ message: 'List deleted successfully', list: user.list });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/api/searchList/:listName', verifyToken, async (req, res) => {
  try {
    // Get user ID from the request object (set by the verifyToken middleware)
    const userId = req.userId;
    const { listName } = req.params;

    // Use lowercase listName for case-insensitive matching
    const searchName = listName.toLowerCase();

    // Find the user using the userId from the token
    const user = await User.findById(userId);  // Use userId from the token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the list that matches the list name (case-insensitive)
    const list = user.list.find(l => l.name.toLowerCase() === searchName);

    if (list) {
      // Return the details of the found list
      const listDetails = {
        name: list.name,
        description: list.description,
        destinationCollection: list.destinationCollection,
        countryCollection: list.countryCollection,
        visibility: list.visibility,
        lastEditedTime: list.lastEditedTime,
      };

      // Respond with the list details
      res.status(200).json(listDetails);
    } else {
      // If the list is not found, respond with a 404 error
      res.status(404).json({ message: `List "${searchName}" not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/api/addReview/:listName', verifyToken, async (req, res) => {
  try {
    const { listName } = req.params; // Get the list name from params
    const { rating, comment } = req.body; // Get the rating and comment from body
    const userId = req.userId; // Get the userId from the JWT token

    // Validate the rating
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating. Rating must be between 0 and 5.' });
    }

    // Find the authenticated user (who is leaving the review)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find a user who has the list with the given name
    const targetUser = await User.findOne({
      "list.name": listName // Search for a user who has a list with the given name
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'List not found in any user\'s account' });
    }

    // Find the index of the list in the target user's list array
    const listIndex = targetUser.list.findIndex((list) => list.name === listName);

    if (listIndex === -1) {
      return res.status(404).json({ message: 'List not found in target user\'s account' });
    }

    // Create the review object
    const createNewReview = {
      rating,
      reviewUser: user.username, // The username of the authenticated user leaving the review
      comment: comment || '',
      creationDate: Date.now()
    };

    // Add the review to the target list
    targetUser.list[listIndex].reviews.push(createNewReview);

    // Save the updated target user's list
    await targetUser.save();

    // Return a success response
    res.status(201).json({
      message: 'Review added successfully',
      review: createNewReview
    });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




const calcAvgRating = (reviews) => {
  if(reviews.length === 0){
    return 0;
  }

  let sumOfRatings = 0;

  for(let i =0; i < reviews.length; i++){
    sumOfRatings += reviews[i].rating;
  }


  const avgRating = sumOfRatings / reviews.length;

  return Math.round(avgRating * 100) / 100;
}


app.get('/api/publicDestLists', async(req, res) => {
  try{
    const publicUsers = await User.find(
      {'list.visibility': 'public'},
      {username: 1, list: 1}

    );

    const pubLists = publicUsers
      .map(user => {
        const userLists = user.list.filter(list => list.visibility === 'public');
        return userLists.map(listDetails => ({
          name: listDetails.name,
          creatorName: user.username,
          numberOfDestination: listDetails.destinationCollection.length,
          averageRating: listDetails.reviews.length > 0 ? calcAvgRating(listDetails.reviews) : 'No reviews',
        }));

      })
      .flat();

      pubLists.sort((a,b) => b.lastEditedTime - a.lastEditedTime);

      const recentLists = pubLists.slice(0,10);

      res.status(200).json(recentLists);
  }catch(error){
    console.log(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});












app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.route('/api/list')
  .get((req, res) => {
    console.log(`GET request for ${req.url}`);
    res.send(store);
  });

