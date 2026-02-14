import { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);

    const SaveUser = (userData) => {
        const userJson = {
            ...userData
        };
        console.log('Saving user to context:', userJson);
        setUser(userJson);
    };

    return (
        <AuthContext.Provider value={{ user, SaveUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;