import { createContext, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // `user` object includes `isAdmin` property

    const loginUser = (userData) => {
        setUser(userData); // `userData` should have `{ email, isAdmin, ...otherProps }`
    };

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

// Protect routes based on user role
export const RequireAdmin = ({ children }) => {
    const { user } = useUser();

    if (!user) {
        // If not logged in, redirect to login or home page
        return <div>Access denied. Admins only.<Link to="/">Go back to Home</Link></div>;
    }

    if (!user.isAdmin) {
        // If not an admin, restrict access
        return <div>Access denied. Admins only.<Link to="/">Go back to Home</Link></div>;
    }

    // If user is admin, render the component
    return children;
};

export const RequireAuth = ({ children }) => {
    const { user } = useUser();

    if (!user) {
        // If not logged in, redirect to login or home page
        return <div>Access denied. Users only.<Link to="/">Go back to Home</Link></div>;
    }

    // If user is logged in, render the component
    return children;
};
