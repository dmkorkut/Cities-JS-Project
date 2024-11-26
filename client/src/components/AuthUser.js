import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext'; // Import useUser hook
import Layout from './Layout';
import { Link } from 'react-router-dom';


const AuthUser = () => {
  const { user } = useUser(); // Get user data from context
  const [loading, setLoading] = useState(true);

  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newDestinationCollection, setNewDestinationCollection] = useState('');
  const [newCountryCollection, setNewCountryCollection] = useState('');
  const [newVisibility, setNewVisibility] = useState('private');
  const [info, setInfo] = useState('');

  const [editListName, setEditListName] = useState('');
  const [editListDescription, setEditListDescription] = useState('');
  const [editDestinationCollection, setEditDestinationCollection] = useState('');
  const [editCountryCollection, setEditCountryCollection] = useState('');
  const [editVisibility, setEditVisibility] = useState('private');
  const [editInfo, setEditInfo] = useState('');
  const [userLists, setUserLists] = useState([]);

  useEffect(() => {
    fetchUserLists();
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const createList = async () => {
    try {
        // Trim and split destination collection
        const trimmedDestCollection = newDestinationCollection.trim();
        const splitCollection = trimmedDestCollection.split(',').map(id => id.trim());

        // Trim and split country collection
        const trimmedCountryCollection = newCountryCollection.trim();
        const splitCountryCollection = trimmedCountryCollection.split(',').map(country => country.trim());

        console.log('Split Destination Collection:', splitCollection);
        console.log('Split Country Collection:', splitCountryCollection);

        // Validate destination collection
        if (
            splitCollection.length === 0 || 
            splitCollection.some(id => typeof id !== 'string' || id.trim() === '')
        ) {
            console.error('Invalid Destination Collection');
            setInfo('Destination Collection must be a comma-separated list of valid strings.');
            return;
        }

        // Validate country collection
        if (
            splitCountryCollection.length === 0 || 
            splitCountryCollection.some(country => typeof country !== 'string' || country.trim() === '')
        ) {
            console.error('Invalid Country Collection');
            setInfo('Country Collection must be a comma-separated list of valid strings.');
            return;
        }

        // Ensure both collections have the same number of items
        if (splitCollection.length !== splitCountryCollection.length) {
            console.error('Mismatched Collections');
            setInfo('Destination Collection and Country Collection must have the same number of items.');
            return;
        }

        const response = await fetch('/api/createPublicList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newListName,
                description: newListDescription,
                destinationCollection: splitCollection.map(String), // Ensure all items are strings
                countryCollection: splitCountryCollection.map(String), // Ensure all items are strings
                visibility: newVisibility,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setInfo(data.message);
            setNewListName('');
            setNewListDescription('');
            setNewDestinationCollection('');
            setNewCountryCollection('');
            setNewVisibility('private');
            fetchUserLists();
        } else {
            const errorData = await response.json();
            setInfo(errorData.message || 'Failed to create list.');
        }
    } catch (error) {
        console.error('Failed to create list', error);
    }
};

const editList = async() => {
    try {
      // Trim and split destination collection
      const trimmedDestCollection = editDestinationCollection.trim();
      const splitCollection = trimmedDestCollection.split(',').map(id => id.trim());

      // Trim and split country collection
      const trimmedCountryCollection = editCountryCollection.trim();
      const splitCountryCollection = trimmedCountryCollection.split(',').map(country => country.trim());

      console.log('Split Destination Collection:', splitCollection);
      console.log('Split Country Collection:', splitCountryCollection);

      // Validate destination collection
      if (
        splitCollection.length === 0 || 
        splitCollection.some(id => typeof id !== 'string' || id.trim() === '')
      ) {
        console.error('Invalid Destination Collection');
        setEditInfo('Destination Collection must be a comma-separated list of valid strings.');
        return;
      }

      // Validate country collection
      if (
        splitCountryCollection.length === 0 || 
        splitCountryCollection.some(country => typeof country !== 'string' || country.trim() === '')
      ) {
        console.error('Invalid Country Collection');
        setEditInfo('Country Collection must be a comma-separated list of valid strings.');
        return;
      }

      // Ensure both collections have the same number of items
      if (splitCollection.length !== splitCountryCollection.length) {
        console.error('Mismatched Collections');
        setEditInfo('Destination Collection and Country Collection must have the same number of items.');
        return;
      }

      const response = await fetch(`/api/editList/${editListName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editListName,
          description: editListDescription,
          destinationCollection: splitCollection.map(String), // Ensure all items are strings
          countryCollection: splitCountryCollection.map(String), // Ensure all items are strings
          visibility: editVisibility,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setEditInfo(data.message);
        setEditListName('');
        setEditListDescription('');
        setEditDestinationCollection('');
        setEditCountryCollection('')
        setEditVisibility('private');
        fetchUserLists();
      } else {
        const errorData = await response.json();
        setEditInfo(errorData.message || 'Failed to update list.');
      }
    } catch (error) {
      console.error('Failed to edit list', error);
      setEditInfo('An error occurred while updating the list.');
    }
  };

const handleListSelect = (selectedListName) => {
  const selectedList = userLists.find((list) => list.name === selectedListName);
  setEditListDescription(selectedList.description || '');
  setEditDestinationCollection(selectedList.destinationCollection.join(', ') || ''); 
  setEditCountryCollection(selectedList.countryCollection.join(', ') || ''); 
  setEditVisibility(selectedList.visibility || 'private');
}

const fetchUserLists = async () => {
  try {
    const response = await fetch(`/api/getList`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUserLists(data.lists);
    } else {
      console.error('Failed to fetch user lists');
    }
  } catch (error) {
    console.error('Failed to fetch user lists', error);
  }
};



  

  if (!user) {
    return (
      <div>
        <p>You must be logged in to view this page.</p>
        <Link to="/">Go back to Home</Link>
        {/* Optionally, you could redirect the user to the login page */}
      </div>
    );
  }

  return (
    <Layout>
      <h2>Welcome, {user.email}!</h2> {/* Display user info */}
      <div>
        <form id="create-a-list">
        <h3>Create List</h3>
          <input
          type = "text"
          id="listName"
          name = "listName"
          value={newListName}
          placeholder='Type a new list name'
          onChange={(e) => setNewListName(e.target.value)}
          required
          />
          <input
          type = "text"
          id="listDescription"
          name = "listDescription"
          value={newListDescription}
          placeholder='Type a new list description'
          onChange={(e) => setNewListDescription(e.target.value)}
          required
          />
          <input
          type = "text"
          id="destinationCollection"
          name = "destinationCollection"
          value={newDestinationCollection}
          placeholder='Type in Destinations'
          onChange={(e) => setNewDestinationCollection(e.target.value)}
          required
          />
          <input
          type = "text"
          id="countryCollection"
          name = "countryCollection"
          value={newCountryCollection}
          placeholder='Type in Country based on destination above'
          onChange={(e) => setNewCountryCollection(e.target.value)}
          required
          />
          <label htmlFor="visibility">Visibility:</label>
            <select
              id="visibility"
              name="visibility"
              value={newVisibility}
              onChange={(e) => setNewVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <br></br>
            <br></br>

            <button type="button" onClick={createList}>
              Create New List
            </button>
          </form>

          
          <p>{info}</p>
        </div>
        <div>
        <form id="edit-a-list">
          <h3>Edit List</h3>
          <label htmlFor="editList">Select List to Edit:</label>
            <select
              id="editList"
              name="editList"
              value={editListName}
              onChange={(e) => {
                setEditListName(e.target.value);
                handleListSelect(e.target.value);
              }}
              required
            >
              <option value="" disabled>Select a List</option>
              {userLists.map((list) => (
                <option key={list.name} value={list.name}>{list.name}</option>
              ))}
            </select>
            <input
              type = "text"
              id="editListDescription"
              name = "editListDescription"
              value={editListDescription}
              placeholder='Type a new list description'
              onChange={(e) => setEditListDescription(e.target.value)}
              required
          />
            <input
              type = "text"
              id="editDestinationCollection"
              name = "editDestinationCollection"
              value={editDestinationCollection}
              placeholder='Type in New Destinations'
              onChange={(e) => setEditDestinationCollection(e.target.value)}
              required
            />
            <input
              type = "text"
              id="editCountryCollection"
              name = "editCountryCollection"
              value={editCountryCollection}
              placeholder='Type in new Country based on destination above'
              onChange={(e) => setEditCountryCollection(e.target.value)}
              required
            />
            <label htmlFor="editVisibility">Visibility:</label>
              <select
                  id="editVisibility"
                  name="editVisibility"
                  value={editVisibility}
                  onChange={(e) => setEditVisibility(e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
              </select>
              <br></br>
                    <br></br>
              <button type="button" onClick={editList}>
              Edit List
            </button>

          </form>
          <p>{editInfo}</p>
        </div>
    </Layout>
  );
};

export default AuthUser;
