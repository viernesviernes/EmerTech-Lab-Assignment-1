function formatSection(s) {
    return String(s ?? '').padStart(3, '0');
}

export default function CourseCard({ course, functions, expandedCourseKey, onToggleExpand }) {

    const { deleteCourse } = functions;

    const courseKey = `${course.code}-${course.section}`;
    const isExpanded = expandedCourseKey === courseKey;
    const students = course.students ?? [];

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
                </>
            )}
        </div>
    );
}