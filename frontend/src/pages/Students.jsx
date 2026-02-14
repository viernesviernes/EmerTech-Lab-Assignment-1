import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function StudentDashboard() {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    // General state
    const [view, setView] = useState('');
    const [courses, setCourses] = useState([]);

    const addNewCourse = async (newCourseCode, newCourseName, newCourseSection, newCourseSemester) => {
        const newCourse = {
            courseCode: newCourseCode,
            courseName: newCourseName,
            section: newCourseSection,
            semester: newCourseSemester,
            students: [user.studentNumber]
         };

         try {
            console.log('Adding new course:', newCourse);
            const response = await fetch(`/api/courses`, 
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCourse),
            });
            if (response.ok) {
                console.log('New course added successfully:', newCourse);
                fetchCourses(); // Refresh the courses list after adding a new course
            } else {
                console.error('Failed to add new course:', response.statusText);
            }
         } catch (error) {
            console.error('Error adding new course:', error);
         }
    };

    const editCourse = async (course) => {
        console.log('Edit course:', course);
        const response = await fetch(`/api/courses/${course.courseCode}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
        });
        if (response.ok) {
            console.log('Course updated successfully:', course);
            fetchCourses(); // Refresh the courses list after editing a course
        } else {
            console.error('Failed to update course:', response.statusText);
        }
    };

    const deleteCourse = async (course) => {
        const response = fetch(`/api/courses/${course.courseCode}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log('Course deleted successfully:', course);
            fetchCourses(); // Refresh the courses list after deleting a course
        } else {
            console.error('Failed to delete course:', response.statusText);
        }
    }

    const fetchCourses = async () => {
        fetch(`/api/students/${user.studentNumber}/courses`)
            .then(res => res.json())
            .then(data => {
                setCourses(data);
                console.log('Fetched courses for student:', user.studentNumber, data);
            })
            .catch(error => console.error('Error fetching courses:', error));
    }

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return null; // Return null to prevent rendering the dashboard while redirecting
        }

        fetchCourses();
    }, [user, navigate]);

    return (
        <>
            <div>This is the student dashboard page.</div>
            
            <button onClick={() => setView('yourCourses')}>View Your Courses</button>
            <button onClick={() => setView('otherCourses')}>View Other Student's Courses</button>
            {view === 'yourCourses' && <YourCourses courses={courses} functions={{ addNewCourse, editCourse, deleteCourse }} />}
            {view === 'otherCourses' && <OtherCourses />}
        </>
    )
}

function YourCourses({ courses, functions }) {

    const { addNewCourse, editCourse, deleteCourse } = functions;

    // New row-exclusive state
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseSection, setNewCourseSection] = useState('');
    const [newCourseSemester, setNewCourseSemester] = useState('');

    // State to track editing
    const [editingCourseCode, setEditingCourseCode] = useState(null);
    const [editedCourse, setEditedCourse] = useState({});

    const handleEditClick = (course) => {
        setEditingCourseCode(course.courseCode);
        setEditedCourse({ ...course });
    };

    const handleInputChange = (field, value) => {
        setEditedCourse((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveClick = () => {
        editCourse(editedCourse);
        setEditingCourseCode(null);
    };

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
                            {editingCourseCode === course.courseCode ? (
                                <>
                                    <td><input type="text" value={editedCourse.courseCode} onChange={(e) => handleInputChange('courseCode', e.target.value)} /></td>
                                    <td><input type="text" value={editedCourse.courseName} onChange={(e) => handleInputChange('courseName', e.target.value)} /></td>
                                    <td><input type="text" value={editedCourse.section} onChange={(e) => handleInputChange('section', e.target.value)} /></td>
                                    <td><input type="text" value={editedCourse.semester} onChange={(e) => handleInputChange('semester', e.target.value)} /></td>
                                    <td><button onClick={handleSaveClick}>Save</button></td>
                                    <td><button onClick={() => setEditingCourseCode(null)}>Cancel</button></td>
                                </>
                            ) : (
                                <>
                                    <td>{course.courseCode}</td>
                                    <td>{course.courseName}</td>
                                    <td>{course.section}</td>
                                    <td>{course.semester}</td>
                                    <td><button onClick={() => handleEditClick(course)}>Edit</button></td>
                                    <td><button onClick={() => deleteCourse(course)}>Delete</button></td>
                                </>
                            )}
                        </tr>
                    ))}
                    <tr>
                        <td><input type="text" placeholder="Course Code" onChange={(e) => setNewCourseCode(e.target.value)} /></td>
                        <td><input type="text" placeholder="Course Name" onChange={(e) => setNewCourseName(e.target.value)} /></td>
                        <td><input type="text" placeholder="Section" onChange={(e) => setNewCourseSection(e.target.value)} /></td>
                        <td><input type="text" placeholder="Semester" onChange={(e) => setNewCourseSemester(e.target.value)} /></td>
                        <td><button onClick={() => addNewCourse(newCourseCode, newCourseName, newCourseSection, newCourseSemester)}>Add</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

function OtherCourses() {

    const [studentNo, setStudentNo] = useState('');

    const [courses, setCourses] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Fetch courses for the entered student number
        await fetch(`/api/students/${studentNo}/courses`)
            .then(res => res.json())
            .then(data => setCourses(data));
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Enter Student Number:</label>
                <input type="text" value={studentNo} onChange={(e) => setStudentNo(e.target.value)} required />
                <button type="submit">View Courses</button>
            </form>
            <table border="1">
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
    )
}