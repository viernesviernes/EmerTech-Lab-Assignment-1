import { useState, useEffect } from 'react';

function formatSection(s) {
    return String(s ?? '').padStart(3, '0');
}

export default function CourseCard({ course, functions, expandedCourseKey, onToggleExpand }) {

    const { deleteCourse } = functions;

    const courseKey = `${course.code}-${course.section}`;
    const isExpanded = expandedCourseKey === courseKey;

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isExpanded) return;
        setLoading(true);
        setStudents([]);
        fetch(`/api/courses/details?code=${course.code}&section=${course.section}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.data && data.data.students) {
                    setStudents(data.data.students);
                }
            })
            .catch(() => window.alert('Failed to load students'))
            .finally(() => setLoading(false));
    }, [isExpanded, course.code, course.section]);

    const handleToggle = () => {
        onToggleExpand(isExpanded ? null : courseKey);
    };

    return (
        <div className="course-card">
            <h3>{course.code} - {course.name}</h3>
            <button onClick={() => deleteCourse(course)}>Delete</button>
            <p>Section: {formatSection(course.section)}</p>
            <p>Semester: {course.semester}</p>
            <p>Enrolled Students:</p>
            <button type="button" onClick={handleToggle}>
                {isExpanded ? 'Hide students' : 'View students'}
            </button>
            {isExpanded && (
                <>
                    {loading && <p>Loading...</p>}
                    {!loading && (
                        <table border="1" style={{ marginTop: '8px' }}>
                            <thead>
                                <tr>
                                    <th>Student Code</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr><td colSpan="3">No students enrolled</td></tr>
                                ) : (
                                    students.map((s) => (
                                        <tr key={s._id ?? s.studentNumber}>
                                            <td>{s.studentNumber}</td>
                                            <td>{[s.firstName, s.lastName].filter(Boolean).join(' ')}</td>
                                            <td>{s.email}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
}