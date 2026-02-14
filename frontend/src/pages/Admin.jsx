import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminDashboard() {

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    // General state
    const [view, setView] = useState('');
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    const addNewStudent = async (newStudentNumber, newPassword, newFirstName, newLastName, newAddress, newCity, newPhoneNumber, newEmail, newFavoriteTopic, newStrongestSkill) => {
        // Implementation for adding a new student
        const newStudent = {
            studentNumber: newStudentNumber,
            password: newPassword,
            firstName: newFirstName,
            lastName: newLastName,
            address: newAddress,
            city: newCity,
            phoneNumber: newPhoneNumber,
            email: newEmail,
            favoriteTopic: newFavoriteTopic,
            strongestSkill: newStrongestSkill
        }

        try {
            console.log('Adding new student:', newStudent);
            const response = await fetch(`/api/students`, 
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent),
            });
            if (response.ok) {
                console.log('New student added successfully:', newStudent);
                fetchStudents(); // Refresh the students list after adding a new student
            } else {
                console.error('Failed to add new student:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding new student:', error);
        }
    };

    const fetchStudents = async () => {
        fetch(`/api/students/`)
            .then(res => res.json())
            .then(data => {
                setStudents(data);
                console.log('Fetched students:', data);
            })
            .catch(error => console.error('Error fetching students:', error));
    };

    const fetchCourses = async () => {
        fetch(`/api/courses/`)
            .then(res => res.json())
            .then(data => {
                setCourses(data);
                console.log('Fetched courses:', data);
            })
            .catch(error => console.error('Error fetching courses:', error));
    }

    useEffect(() => {
        if (!user) {
            navigate('/admin');
            return null; // Return null to prevent rendering the dashboard while redirecting
        }

        fetchStudents();
        fetchCourses();
    }, [user, navigate]);

    return (
        <>
        <div>This is the admin dashboard page.</div>
        <button onClick={() => setView('students')}>View Students</button>
        <button onClick={() => setView('courses')}>View Courses</button>
        {view === 'students' && <StudentTable students={students} functions={{addNewStudent}} />}
        {view === 'courses' && <CourseTable courses={courses} />}
        </>
    )
}

function StudentTable({ students, functions }) {

    const { addNewStudent } = functions;

    const [newStudentNumber, setNewStudentNumber] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [newCity, setNewCity] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newFavoriteTopic, setNewFavoriteTopic] = useState("");
    const [newStrongestSkill, setNewStrongestSkill] = useState("");
    
    return (
        <>
            <table border="1" id="studentTable">
                <thead>
                    <tr>
                        <th>Student Number</th>
                        <th>Password</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Favorite Topic</th>
                        <th>Strongest Skill</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.studentNumber}>
                            <td>{student.studentNumber}</td>
                            <td>{student.password}</td>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{student.address}</td>
                            <td>{student.city}</td>
                            <td>{student.phoneNumber}</td>
                            <td>{student.email}</td>
                            <td>{student.favoriteTopic}</td>
                            <td>{student.strongestSkill}</td>
                            <td><button>Edit</button></td>
                            <td><button>Delete</button></td>
                        </tr>
                    ))}
                    <tr>
                        <td><input type="text" placeholder="Student Number" onChange={(e) => setNewStudentNumber(e.target.value)} /></td>
                        <td><input type="text" placeholder="Password" onChange={(e) => setNewPassword(e.target.value)} /></td>
                        <td><input type="text" placeholder="First Name" onChange={(e) => setNewFirstName(e.target.value)} /></td>
                        <td><input type="text" placeholder="Last Name" onChange={(e) => setNewLastName(e.target.value)} /></td>
                        <td><input type="text" placeholder="Address" onChange={(e) => setNewAddress(e.target.value)} /></td>
                        <td><input type="text" placeholder="City" onChange={(e) => setNewCity(e.target.value)} /></td>
                        <td><input type="text" placeholder="Phone Number" onChange={(e) => setNewPhoneNumber(e.target.value)} /></td>
                        <td><input type="text" placeholder="Email" onChange={(e) => setNewEmail(e.target.value)} /></td>
                        <td><input type="text" placeholder="Favorite Topic" onChange={(e) => setNewFavoriteTopic(e.target.value)} /></td>
                        <td><input type="text" placeholder="Strongest Skill" onChange={(e) => setNewStrongestSkill(e.target.value)} /></td>
                        <td><button onClick={() => addNewStudent(newStudentNumber, newPassword, newFirstName, newLastName, newAddress, newCity, newPhoneNumber, newEmail, newFavoriteTopic, newStrongestSkill)}>Add</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

function CourseTable() {
    const [courses, setCourses] = useState([]);

    return (
        <>
            <table border="1" id="courseTable">
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Section</th>
                        <th>Semester</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.courseCode}>
                            <td>{course.courseCode}</td>
                            <td>{course.courseName}</td>
                            <td>{course.section}</td>
                            <td>{course.semester}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

