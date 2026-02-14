import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function AdminLogin() {

    const navigate = useNavigate();
    const { user, SaveUser } = useContext(AuthContext);

    // State for form inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {

        console.log('Attempting login with username:', username, password);

        event.preventDefault();

        try {
                const response = await fetch(`/api/admin`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const { admin } = await response.json();
                await SaveUser(admin);
                console.log('Login successful:', admin);
                navigate('/admin-dashboard');
            } else {
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    if (user) {
        navigate('/students');
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