import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import "./Admin.css";
import { useUser } from './UserContext'; // Import useUser hook

const Admin = () => {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [action, setAction] = useState('');
    const [nonAdminEmails, setNonAdminEmails] = useState([]);
    const [info, setInfo] = useState('');
    const [publicDestinationLists, setPublicDestinationLists] = useState([]);
    const [selectedList, setSelectedList] = useState('');
    const [reviews, setReviews] = useState([]);
    const { user } = useUser();

    // Handle action perform
    const handlePerfomAction = () => {
        if (selectedUserId && action) {
            let endpoint;
            switch (action) {
                case 'makeAdmin':
                    endpoint = '/api/makeAdmin';
                    break;
                case 'disable':
                    endpoint = '/api/disableUser';
                    break;
                case 'enable':
                    endpoint = '/api/enableUser';
                    break;
                default:
                    return;
            }

            fetch(`${endpoint}/${selectedUserId}`, { method: 'PUT' })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setInfo(data.message); // Make sure 'message' exists in the response
                })
                .catch(error => console.error('Error', error));
        }
    };


    const toggleReviewVisibility = async (reviewId, currentHiddenStatus, event) => {
        // Prevent the default button action (in case it's inside a form, to prevent form submission)
        event.preventDefault();
    
        const hiddenStatus = !currentHiddenStatus; // Toggle the current visibility status
        const endpoint = `/api/reviews2/${selectedList}/${reviewId}`;
    
        console.log(`Making request to: ${endpoint}`); // Log the full URL
    
        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hidden: hiddenStatus }), // Toggle the visibility
            });
    
            const data = await response.json(); // Parse the response body
    
            if (response.ok) {
                // Update the reviews state to reflect the new visibility status
                setReviews((prevReviews) =>
                    prevReviews.map((review) =>
                        review._id === reviewId ? { ...review, hidden: hiddenStatus } : review
                    )
                );
                console.log('Review visibility updated successfully:', data);
            } else {
                console.error('Failed to update review visibility', data.message);
            }
        } catch (error) {
            console.error('Error updating review visibility', error);
        }
    };
    
    
    
    

    // Handle action change
    const handleActionChange = (event) => {
        setAction(event.target.value);
    };

    // Handle list change
    const handleListChange = async (event) => {
        const selectedList = event.target.value;
        setSelectedList(selectedList);
        await fetchReviews(selectedList);
    };

    // Fetch public destination lists
    const fetchPublicDestinationLists = async () => {
        try {
            const response = await fetch('/api/publicDestLists');
            if (response.ok) {
                const data = await response.json();
                setPublicDestinationLists(data);
            } else {
                console.error('Failed to fetch');
            }
        } catch (error) {
            console.error('Failed to fetch', error);
        }
    };

    // Fetch reviews based on selected list
    const fetchReviews = async (listName) => {
        try {
            const response = await fetch(`/api/reviews2/${listName}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews);
            } else {
                console.error(`Failed to fetch reviews for ${listName}`);
            }
        } catch (error) {
            console.error(`Failed to fetch reviews for ${listName}`, error);
        }
    };

    // Fetch non-admin emails
    const fetchNonAdminEmails = () => {
        fetch('/api/getAllNonAdminEmails')
            .then(response => response.json())
            .then(data => setNonAdminEmails(data.emails))
            .catch(error => console.error('Fetching non-admin user emails', error));
    };

    // Fetch non-admin emails and destination lists when component mounts
    useEffect(() => {
        fetchNonAdminEmails();
        fetchPublicDestinationLists();
    }, []);

    // Handle user change
    const handleUserChange = (event) => {
        setSelectedUserId(event.target.value);
    };

    return (
        <Layout>
            <div>
                <h2>Admin {user.username}</h2>
                <form>
                    <div>
                        <h3>Select User</h3>
                        <select onChange={handleUserChange} value={selectedUserId}>
                            <option value="">Select User</option>
                            {nonAdminEmails.map((email) => (
                                <option key={email} value={email}>
                                    {email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <h3>Actions</h3>
                        <div>
                            <input
                                type="radio"
                                id="disable"
                                name="action"
                                value="disable"
                                onChange={handleActionChange}
                            />
                            <label>Disable User Account</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="enable"
                                name="action"
                                value="enable"
                                onChange={handleActionChange}
                            />
                            <label>Enable User Account</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="makeAdmin"
                                name="action"
                                value="makeAdmin"
                                onChange={handleActionChange}
                            />
                            <label>Make User Admin</label>
                        </div>
                    </div>

                    <button type="button" onClick={handlePerfomAction}>Select</button>
                    <p>{info}</p>

                    <div>
                        <h3>Select Destination List</h3>
                        <select onChange={handleListChange}>
                            <option value="">Select Dest List</option>
                            {publicDestinationLists.map((list) => (
                                <option key={list.name} value={list.name}>
                                    {list.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>

                <div>
                    <form>
                    <h3>Reviews for {selectedList}</h3>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review, index) => (
    <li key={index}>
        {review.rating} {review.comment} by {review.reviewUser}
        <button 
            onClick={(event) => toggleReviewVisibility(review._id, review.hidden, event)}
        >
            {review.hidden ? 'Show' : 'Hide'} Review
        </button>
    </li>
))}
                        </ul>
                    ) : (
                        <p>No reviews available for the list {selectedList}</p>
                    )}
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Admin;
