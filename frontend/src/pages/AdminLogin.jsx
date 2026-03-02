import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import AuthContext from '../context/AuthContext';
import { SIGN_IN_ADMIN } from '../graphql/queries';

function AdminLogin() {

    const navigate = useNavigate();
    const { user, SaveUser } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [signInAdmin] = useMutation(SIGN_IN_ADMIN);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const result = await signInAdmin({
                variables: { username, password },
            });
            const admin = result?.data?.signInAdmin;
            if (admin) {
                SaveUser(admin);
                navigate('/admin-dashboard');
            }
        } catch (error) {
            console.error(error);
            window.alert('Login failed');
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/admin-dashboard');
        }
    }, [user, navigate]);

    if (user) {
        return null;
    }

    else {
        return (
            <div>
                <h1>Admin Login</h1>
                <form onSubmit={handleLogin}>
                    <label>Admin Username:</label>
                    <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <br />
                    <label>Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
            </div>
        )
    }
}

export default AdminLogin