import { useState, useContext } from 'react';
import { useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_STUDENTS,
  GET_COURSES,
  ADD_STUDENT,
  UPDATE_STUDENT,
  DELETE_STUDENT,
  ADD_COURSE,
  UPDATE_COURSE,
  DELETE_COURSE,
} from '../graphql/queries';

import CourseCard from '../components/CourseCard';

export default function AdminDashboard() {

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    // General state
    const [view, setView] = useState('');

    const { data, refetch: refetchStudents } = useQuery(GET_STUDENTS);
    const students = data?.students ?? [];

    const [addStudentMutation] = useMutation(ADD_STUDENT);
    const [updateStudentMutation] = useMutation(UPDATE_STUDENT);
    const [deleteStudentMutation] = useMutation(DELETE_STUDENT);

    const addNewStudent = async (payload) => {
        try {
            await addStudentMutation({ variables: payload });
            refetchStudents();
        } catch (e) {
            console.error(e);
            window.alert('Failed to add student');
        }
    };

    const editStudent = async (student) => {
        const { password, ...body } = student;
        try {
            await updateStudentMutation({ variables: { id: student._id, ...body } });
            refetchStudents();
        } catch (e) {
            console.error(e);
            window.alert('Failed to update student');
        }
    };

    const deleteStudent = async (student) => {
        try {
            await deleteStudentMutation({ variables: { id: student._id } });
            refetchStudents();
        } catch (e) {
            console.error(e);
            window.alert('Failed to delete student');
        }
    };

    const { data: coursesData, refetch: refetchCourses } = useQuery(GET_COURSES);
    const courses = coursesData?.courses ?? [];

    const [addCourseMutation] = useMutation(ADD_COURSE);
    const [updateCourseMutation] = useMutation(UPDATE_COURSE);
    const [deleteCourseMutation] = useMutation(DELETE_COURSE);

    const addNewCourse = async (newCourseCode, newCourseName, newSection, newSemester) => {
        const newCourse = {
            code: Number(newCourseCode),
            name: String(newCourseName),
            section: Number(newSection),
            semester: Number(newSemester),
        };
        try {
            await addCourseMutation({ variables: newCourse });
            refetchCourses();
        } catch (e) {
            console.error(e);
            window.alert('Failed to add course');
        }
    };

    const editCourse = async (course) => {
        try {
            await updateCourseMutation({ variables: { id: course._id ?? course.id, code: course.code, name: course.name, section: course.section, semester: course.semester } });
            refetchCourses();
        } catch (e) {
            console.error(e);
            window.alert('Failed to update course');
        }
    };

    const deleteCourse = async (course) => {
        try {
            await deleteCourseMutation({ variables: { id: course._id ?? course.id } });
            refetchCourses();
        } catch (e) {
            console.error(e);
            window.alert('Failed to delete course');
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/admin');
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

function validateNewStudent(f) {
    if (!String(f.studentNumber ?? '').trim()) return 'Student number is required';
    const sn = Number(f.studentNumber);
    if (isNaN(sn)) return 'Student number must be a number';
    if (!String(f.firstName ?? '').trim()) return 'First name is required';
    if (!String(f.lastName ?? '').trim()) return 'Last name is required';
    if (!String(f.username ?? '').trim()) return 'Username is required';
    if (!String(f.password ?? '')) return 'Password is required';
    if (f.password.length <= 6) return 'Password must be longer than 6 characters';
    if (!String(f.address ?? '').trim()) return 'Address is required';
    if (!String(f.city ?? '').trim()) return 'City is required';
    if (!String(f.phoneNumber ?? '').trim()) return 'Phone number is required';
    if (!String(f.email ?? '').trim()) return 'Email is required';
    if (!/.+@.+\..+/.test(f.email.trim())) return 'Please enter a valid email address';
    if (!String(f.program ?? '').trim()) return 'Program is required';
    if (String(f.yearOfStudy ?? '').trim() === '') return 'Year of study is required';
    const year = Number(f.yearOfStudy);
    if (isNaN(year) || year < 1) return 'Year of study must be a valid number (1 or more)';
    if (String(f.gpa ?? '').trim() === '') return 'GPA is required';
    const gpa = Number(f.gpa);
    if (isNaN(gpa) || gpa < 0 || gpa > 4) return 'GPA must be a number between 0 and 4';
    return null;
}

function StudentTable({ students, functions }) {

    const [newStudentNumber, setNewStudentNumber] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [newCity, setNewCity] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newProgram, setNewProgram] = useState("");
    const [newYearOfStudy, setNewYearOfStudy] = useState("");
    const [newGpa, setNewGpa] = useState("");

    // For importing functions from AdminDashboard
    const { addNewStudent, editStudent, deleteStudent } = functions;

    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editedStudent, setEditedStudent] = useState({});

    const handleEditClick = (student) => {
        setEditingStudentId(student._id ?? student.studentNumber);
        setEditedStudent({ ...student });
    };

    const handleInputChange = (field, value) => {
        setEditedStudent((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveClick = () => {
        editStudent(editedStudent);
        setEditingStudentId(null);
    };

    return (
        <>
            <table border="1" id="studentTable">
                <thead>
                    <tr>
                        <th>Student Number</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Program</th>
                        <th>Year of Study</th>
                        <th>GPA</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student._id ?? student.studentNumber}>
                            {editingStudentId === (student._id ?? student.studentNumber) ? (
                                <>
                                    <td><input type="text" value={editedStudent.studentNumber ?? ''} onChange={(e) => handleInputChange('studentNumber', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.firstName ?? ''} onChange={(e) => handleInputChange('firstName', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.lastName ?? ''} onChange={(e) => handleInputChange('lastName', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.username ?? ''} onChange={(e) => handleInputChange('username', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.address ?? ''} onChange={(e) => handleInputChange('address', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.city ?? ''} onChange={(e) => handleInputChange('city', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.phoneNumber ?? ''} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.email ?? ''} onChange={(e) => handleInputChange('email', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.program ?? ''} onChange={(e) => handleInputChange('program', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.yearOfStudy ?? ''} onChange={(e) => handleInputChange('yearOfStudy', e.target.value)} /></td>
                                    <td><input type="text" value={editedStudent.gpa ?? ''} onChange={(e) => handleInputChange('gpa', e.target.value)} /></td>
                                    <td><button onClick={handleSaveClick}>Save</button></td>
                                    <td><button onClick={() => setEditingStudentId(null)}>Cancel</button></td>
                                </>
                            ) : (
                                <>
                                    <td>{student.studentNumber}</td>
                                    <td>{student.firstName}</td>
                                    <td>{student.lastName}</td>
                                    <td>{student.username}</td>
                                    <td>{student.address}</td>
                                    <td>{student.city}</td>
                                    <td>{student.phoneNumber}</td>
                                    <td>{student.email}</td>
                                    <td>{student.program}</td>
                                    <td>{student.yearOfStudy}</td>
                                    <td>{student.gpa}</td>
                                    <td><button onClick={() => handleEditClick(student)}>Edit</button></td>
                                    <td><button onClick={() => deleteStudent(student)}>Delete</button></td>
                                </>
                            )}
                        </tr>
                    ))}
                    <tr>
                        <td><input type="text" placeholder="Student Number" value={newStudentNumber} onChange={(e) => setNewStudentNumber(e.target.value)} /></td>
                        <td><input type="text" placeholder="First Name" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} /></td>
                        <td><input type="text" placeholder="Last Name" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} /></td>
                        <td><input type="text" placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} /></td>
                        <td><input type="text" placeholder="Address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} /></td>
                        <td><input type="text" placeholder="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} /></td>
                        <td><input type="text" placeholder="Phone Number" value={newPhoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} /></td>
                        <td><input type="text" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /></td>
                        <td><input type="text" placeholder="Program" value={newProgram} onChange={(e) => setNewProgram(e.target.value)} /></td>
                        <td><input type="text" placeholder="Year of Study" value={newYearOfStudy} onChange={(e) => setNewYearOfStudy(e.target.value)} /></td>
                        <td><input type="text" placeholder="GPA" value={newGpa} onChange={(e) => setNewGpa(e.target.value)} /></td>
                        <td></td>
                        <td><button onClick={() => {
                            const raw = {
                                studentNumber: newStudentNumber,
                                firstName: newFirstName,
                                lastName: newLastName,
                                username: newUsername,
                                password: newPassword,
                                address: newAddress,
                                city: newCity,
                                phoneNumber: newPhoneNumber,
                                email: newEmail,
                                program: newProgram,
                                yearOfStudy: newYearOfStudy,
                                gpa: newGpa,
                            };
                            const err = validateNewStudent(raw);
                            if (err) {
                                window.alert(err);
                                return;
                            }
                            const payload = {
                                studentNumber: Number(newStudentNumber),
                                firstName: newFirstName.trim(),
                                lastName: newLastName.trim(),
                                username: newUsername.trim(),
                                password: newPassword,
                                address: newAddress.trim(),
                                city: newCity.trim(),
                                phoneNumber: newPhoneNumber.trim(),
                                email: newEmail.trim(),
                                program: newProgram.trim(),
                                yearOfStudy: Number(newYearOfStudy),
                                gpa: Number(newGpa),
                            };
                            addNewStudent(payload);
                            setNewStudentNumber(''); setNewPassword(''); setNewFirstName(''); setNewLastName(''); setNewUsername(''); setNewAddress(''); setNewCity(''); setNewPhoneNumber(''); setNewEmail(''); setNewProgram(''); setNewYearOfStudy(''); setNewGpa('');
                        }}>Add</button></td>
                    </tr>
                    <tr>
                        <td colSpan="13" style={{ padding: '6px 8px' }}>
                            Password for new student: <input type="password" placeholder="Password (min 7 characters)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

function CourseTable({ courses, functions }) {

    const [expandedCourseKey, setExpandedCourseKey] = useState(null);
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
                        <CourseCard
                            key={course.id ?? course._id}
                            course={course}
                            functions={{ editCourse, deleteCourse }}
                            expandedCourseKey={expandedCourseKey}
                            onToggleExpand={setExpandedCourseKey}
                        />
                    ))
                }
            </div>
        </>
    );
}

