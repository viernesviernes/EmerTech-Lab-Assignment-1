import { useState, useEffect } from 'react';

export default function CourseCard({ course, functions, isEditing }) {

    const { editCourse, deleteCourse } = functions;

    const [studentNames, setStudentNames] = useState({});

    useEffect(() => {
        const fetchStudentNames = async () => {
            const names = {};
            for (const studentNumber of course.students || []) {
                try {
                    const response = await fetch(`/api/students/${studentNumber}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await response.json();
                    const { firstName, lastName } = data;
                    names[studentNumber] = `${firstName} ${lastName}`;
                } catch (error) {
                    console.error("Error fetching student:", error);
                    names[studentNumber] = "Unknown";
                }
            }
            setStudentNames(names);
        };
        
        fetchStudentNames();
    }, [course.students]);

    return (
        <div className="course-card">
            <h3>{course.code} - {course.name}</h3>
            <button onClick={() => deleteCourse(course)}>Delete</button>
            <p>Section: {course.section}</p>
            <p>Semester: {course.semester}</p>
            <p>Enrolled Students:</p>
            <ul>
                {course.students && course.students.length > 0 ? course.students.map((studentNumber) => (
                    <li key={studentNumber}>{studentNames[studentNumber] || 'Loading...'}</li>
                )) : <li>No students enrolled</li>}
            </ul>
        </div>
    )
}