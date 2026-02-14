import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the App</h1>
      <button onClick={() => navigate('/login')}>Login as Student</button>
      <button onClick={() => navigate('/admin')}>Login as Admin</button>
    </div>
  );
}

export default App;
