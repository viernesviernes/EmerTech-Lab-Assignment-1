import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import AuthContext from '../context/AuthContext';
import { SIGN_IN_STUDENT } from '../graphql/queries';

function StudentLogin() {

    const navigate = useNavigate();
    const { user, SaveUser } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [signInStudent] = useMutation(SIGN_IN_STUDENT);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const result = await signInStudent({
                variables: { username, password },
            });
            const student = result?.data?.signInStudent;
            if (student) {
                SaveUser(student);
                navigate('/students');
            }
        } catch (error) {
            console.error(error);
            window.alert('Login failed');
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/students');
        }
    }, [user, navigate]);

    if (user) {
        return null;
    }
    else {
        return (
            <div>
                <h1>Student Login</h1>
                <form onSubmit={handleLogin}>
                    <label>Username:</label>
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