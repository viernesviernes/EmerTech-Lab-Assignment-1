import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function StudentLogin() {

    const navigate = useNavigate();
    const { user, SaveUser } = useContext(AuthContext);

    // State for form inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {

        event.preventDefault();

        try {
                const response = await fetch(`http://localhost:3000/signin/student`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password: password }),
            });
            
            if (response.ok) {
                const { student } = await response.json();
                await SaveUser(student);
                console.log('Login successful:', student);
                navigate('/students');
            } else {
                console.error('Login failed:', response.statusText);
                const data = await response.json();
                window.alert(data.message);
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
                <h1>Student Login</h1>
                <form onSubmit={handleLogin}>
                    <label>Student Number:</label>
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

export default StudentLogin