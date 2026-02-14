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

    const addNewStudent = async (newStudentNumber, newFirstName, newLastName, newProgram) => {
        const newStudent = {
            studentNumber: newStudentNumber,
            firstName: newFirstName,
            lastName: newLastName,
            program: newProgram,
        };

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
    };

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
    };

    const fetchStudents = async () => {
        fetch(`/api/students`)
            .then(res => res.json())
            .then(data => {
                setStudents(data);
                console.log('Fetched students:', data);
            })
            .catch(error => console.error('Error fetching students:', error));
    };

    useEffect(() => {
        if (!user) {
            navigate('/admin');
            return null; // Return null to prevent rendering the dashboard while redirecting
        }

        fetchStudents();
    }, [user, navigate]);

    return (
        <>
            <div>This is the admin dashboard page.</div>
            
            <button onClick={() => setView('yourStudents')}>View Your Students</button>
            <button onClick={() => setView('otherStudents')}>View Other Students</button>
            {view === 'yourStudents' && <YourStudents students={students} functions={{ addNewStudent, editStudent, deleteStudent }} />}
            {view === 'otherStudents' && <OtherStudents />}
        </>
    )
}

function YourStudents({ students, functions }) {

    const { addNewStudent, editStudent, deleteStudent } = functions;

    // New row-exclusive state
    const [newStudentNumber, setNewStudentNumber] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newProgram, setNewProgram] = useState('');

    // State to track editing
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
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Program</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.studentNumber}>
                            {editingStudentNumber === student.studentNumber ? (
                                <>
                                    <td><input type="text" value={editedStudent.studentNumber} onChange={(e) => handleInputChange('studentNumber', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.program} onChange={(e) => handleInputChange('program', e.target.value)} /></td>
                                    <td><button onClick={handleSaveClick}>Save</button></td>
                                    <td><button onClick={() => setEditingStudentNumber(null)}>Cancel</button></td>
                                </>
                            ) : (
                                <>
                                    <td>{student.studentNumber}</td>
                                    <td>{student.firstName}</td>
                                    <td>{student.lastName}</td>
                                    <td>{student.program}</td>
                                    <td><button onClick={() => handleEditClick(student)}>Edit</button></td>
                                    <td><button onClick={() => deleteStudent(student)}>Delete</button></td>
                                </>
                            )}
                        </tr>
                    ))}
                    <tr>
                        <td><input type="text" placeholder="Student Number" onChange={(e) => setNewStudentNumber(e.target.value)} /></td>
                        <td><input type="text" placeholder="First Name" onChange={(e) => setNewFirstName(e.target.value)} /></td>
                        <td><input type="text" placeholder="Last Name" onChange={(e) => setNewLastName(e.target.value)} /></td>
                        <td><input type="text" placeholder="Program" onChange={(e) => setNewProgram(e.target.value)} /></td>
                        <td><button onClick={() => addNewStudent(newStudentNumber, newFirstName, newLastName, newProgram)}>Add</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

function OtherStudents() {

    const [studentNo, setStudentNo] = useState('');

    const [students, setStudents] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Fetch students for the entered student number
        await fetch(`/api/students/${studentNo}`)
            .then(res => res.json())
            .then(data => setStudents(data));
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Enter Student Number:</label>
                <input type="text" value={studentNo} onChange={(e) => setStudentNo(e.target.value)} required />
                <button type="submit">View Student</button>
            </form>
            <table border="1">
                <thead>
                    <tr>
                        <th>Student Number</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Program</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.studentNumber}>
                            <td>{student.studentNumber}</td>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{student.program}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}