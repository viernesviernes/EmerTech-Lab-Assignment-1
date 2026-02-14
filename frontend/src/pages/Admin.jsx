import axios from 'axios';

export default function AdminDashboard() {
    
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('/api/courses')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the courses!', error);
            });
    }, []);

    return (

        <div>This is the courses dashboard page.</div>
    )
}