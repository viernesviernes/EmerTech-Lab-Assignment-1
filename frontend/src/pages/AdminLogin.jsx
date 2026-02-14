import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {

    const navigate = useNavigate();

    // State for form inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {

        event.preventDefault();

        const response = await fetch(`/api/admin`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            navigate('/students');
        } else {
            console.error('Login failed:', response.statusText);
        }
    };

    return (
        <div>
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <label>Name:</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <br />
                <label>Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default AdminLogin