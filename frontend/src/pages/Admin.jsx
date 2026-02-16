import { useState, useContext } from 'react';
import { useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import CourseCard from '../components/CourseCard';

export default function AdminDashboard() {

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    // General state
    const [view, setView] = useState('');

    // For students view
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
            const response = await fetch(`/api/students`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            } else {
                console.error('Failed to fetch students:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    const addNewStudent = async (newStudentNumber, newPassword, newFirstName, newLastName, newAddress, newCity, newPhoneNumber, newEmail, newFavoriteTopic, newStrongestSkill) => {
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
        };
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
        }
    }

    const editStudent = async (student) => {
        console.log('Edit student:', student);
        const response = await fetch(`/api/students/${student.studentNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        });
        if (response.ok) {
            console.log('Student updated successfully:', student);
            fetchStudents(); // Refresh the students list after editing a student
        } else {
            console.error('Failed to update student:', response.statusText);
        }
    }

    const deleteStudent = async (student) => {
        const response = await fetch(`/api/students/${student.studentNumber}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log('Student deleted successfully:', student);
            fetchStudents(); // Refresh the students list after deleting a student
        } else {
            console.error('Failed to delete student:', response.statusText);
        }
    }

    // For courses view
    const [courses, setCourses] = useState([]);

    const fetchCourses = async () => {
        try {
            const response = await fetch(`/api/courses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCourses(data.data ?? data);
            } else {
                console.error('Failed to fetch courses:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    const addNewCourse = async (newCourseCode, newCourseName, newSection, newSemester) => {
        const newCourse = {
            code: Number(newCourseCode),
            name: String(newCourseName),
            section: Number(newSection),
            semester: Number(newSemester),
        };
        try {
            const response = await fetch(`/api/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCourse),
            });
            if (response.ok) {
                fetchCourses();
            } else {
                const err = await response.json().catch(() => ({}));
                window.alert(err.message || 'Failed to add course');
            }
        } catch (e) {
            window.alert('Failed to add course');
        }
    }

    const editCourse = async (course) => {
        console.log('Edit course:', course);
        const response = await fetch(`/api/courses/${course.code}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
        });
        if (response.ok) {
            fetchCourses();
        } else {
            const err = await response.json().catch(() => ({}));
            window.alert(err.message || 'Failed to update course');
        }
    }

    const deleteCourse = async (course) => {
        const response = await fetch(`/api/courses/${course.code}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            fetchCourses();
        } else {
            const err = await response.json().catch(() => ({}));
            window.alert(err.message || 'Failed to delete course');
        }
    }

    useEffect(() => {
        if (!user) {
            navigate('/admin');
        } else {
            fetchStudents();
            fetchCourses();
        }
    }, [navigate, user]);

    if (!user) {
        return null;
    }

    return (
        <>
        <div>This is the admin dashboard page.</div>
        <button onClick={() => setView('students')}>View Students</button>
        <button onClick={() => setView('courses')}>View Courses</button>
        {view === 'students' && <StudentTable students={students} functions={{ addNewStudent, editStudent, deleteStudent }} />}
        {view === 'courses' && <CourseTable courses={courses} functions={{ addNewCourse, editCourse, deleteCourse }} />}
        </>
    )
}

function StudentTable({ students, functions }) {

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

    // For importing functions from AdminDashboard
    const { addNewStudent, editStudent, deleteStudent } = functions;

    const [editingStudentNumber, setEditingStudentNumber] = useState(null);
    const [editedStudent, setEditedStudent] = useState({});

    const handleEditClick = (student) => {
        setEditingStudentNumber(student.studentNumber);
        setEditedStudent({ ...student });
    };

    const handleInputChange = (field, value) => {
        setEditedStudent((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveClick = () => {
        editStudent(editedStudent);
        setEditingStudentNumber(null);
    };

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
                            {editingStudentNumber === student.studentNumber ? (
                                <>
                                    <td><input type="text" value={editedStudent.studentNumber} onChange={(e) => handleInputChange('studentNumber', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.password} onChange={(e) => handleInputChange('password', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.address} onChange={(e) => handleInputChange('address', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.city} onChange={(e) => handleInputChange('city', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.email} onChange={(e) => handleInputChange('email', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.favoriteTopic} onChange={(e) => handleInputChange('favoriteTopic', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.strongestSkill} onChange={(e) => handleInputChange('strongestSkill', e.target.value)} /></td>
                                    <td><button onClick={handleSaveClick}>Save</button></td>
                                    <td><button onClick={() => setEditingStudentNumber(null)}>Cancel</button></td>
                                </>
                            ) : (
                                <>
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
                                    <td><button onClick={() => handleEditClick(student)}>Edit</button></td>
                                    <td><button onClick={() => deleteStudent(student)}>Delete</button></td>
                                </>
                            )}
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

function CourseTable({ courses, functions }) {

    const [newCourseCode, setNewCourseCode] = useState("");
    const [newCourseName, setNewCourseName] = useState("");
    const [newSection, setNewSection] = useState("");
    const [newSemester, setNewSemester] = useState("");

    // For importing functions from AdminDashboard
    const { addNewCourse, editCourse, deleteCourse } = functions;

    const handleAddCourse = () => {
        addNewCourse(newCourseCode, newCourseName, newSection, newSemester);
        setNewCourseCode("");
        setNewCourseName("");
        setNewSection("");
        setNewSemester("");
    };

    return (
        <>
            <div className="add-course-section">
                <h2>Add New Course</h2>
                <div className="add-course-inputs">
                    <input 
                        type="text" 
                        placeholder="Course Code" 
                        value={newCourseCode}
                        onChange={(e) => setNewCourseCode(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Course Name" 
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Section" 
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Semester" 
                        value={newSemester}
                        onChange={(e) => setNewSemester(e.target.value)} 
                    />
                    <button onClick={handleAddCourse}>Add Course</button>
                </div>
            </div>
            <div className="courses-container">
                {
                    courses.map((course) => (
                        <CourseCard key={course.id ?? course._id} course={course} functions={{ editCourse, deleteCourse }} />
                    ))
                }
            </div>
        </>
    );
}

