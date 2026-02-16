import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function StudentDashboard() {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);

    const enrollCourse = async (courseCode, section) => {
        try {
            const response = await fetch(`/api/student/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: Number(courseCode), section: Number(section) }),
            });
            if (response.ok) {
                fetchCourses();
            } else {
                const err = await response.json();
                console.error(err.message || 'Failed to enroll');
            }
        } catch (error) {
            console.error('Error enrolling:', error);
        }
    };

    const changeSection = async (courseCode, section) => {
        const response = await fetch(`/api/student/courses/${courseCode}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section: Number(section) }),
        });
        if (response.ok) {
            fetchCourses();
        } else {
            const err = await response.json();
            throw new Error(err.message || 'Failed to change section');
        }
    };

    const dropCourse = async (course) => {
        const response = await fetch(`/api/student/courses`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: course.code, section: course.section }),
        });
        if (response.ok) {
            setCourses((prev) => prev.filter((c) => c.id !== course.id));
        } else {
            console.error('Failed to drop course:', response.statusText);
        }
    }

    const fetchCourses = async () => {
        fetch(`/api/student/courses`)
            .then(res => res.json())
            .then(data => {
                setCourses(data.data);
                console.log('Fetched courses for student:',  data);
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
            <YourCourses courses={courses} functions={{ changeSection, dropCourse, enrollCourse }} />
        </>
    )
}

function formatSection(section) {
    return String(section ?? '').padStart(3, '0');
}

function YourCourses({ courses, functions }) {

    const { changeSection, dropCourse, enrollCourse } = functions;

    const [enrollCode, setEnrollCode] = useState('');
    const [enrollSection, setEnrollSection] = useState('');
    const [changingSectionCode, setChangingSectionCode] = useState(null);
    const [sectionDraft, setSectionDraft] = useState('');

    const handleChangeSectionClick = (course) => {
        setChangingSectionCode(course.code);
        setSectionDraft(String(course.section ?? ''));
    };

    const handleSectionSubmit = async (courseCode) => {
        try {
            await changeSection(courseCode, sectionDraft);
            setChangingSectionCode(null);
        } catch (e) {
            window.alert(e.message || 'Failed to change section');
        }
    };

    const handleEnroll = () => {
        if (!enrollCode.trim() || !enrollSection.trim()) return;
        enrollCourse(enrollCode, enrollSection);
        setEnrollCode('');
        setEnrollSection('');
    };

    return (
        <>
            <div className="enrollSection">
                <div className="enrollSectionInner">
                    <h2 className="enrollSectionTitle">Enroll in Course</h2>
                    <div className="enrollSectionRow">
                        <input
                            type="text"
                            className="enrollSectionInput"
                            placeholder="Course code"
                            value={enrollCode}
                            onChange={(e) => setEnrollCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleEnroll()}
                        />
                        <input
                            type="text"
                            className="enrollSectionInput"
                            placeholder="Section"
                            value={enrollSection}
                            onChange={(e) => setEnrollSection(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleEnroll()}
                        />
                        <button type="button" onClick={handleEnroll}>Enroll</button>
                    </div>
                </div>
            </div>

            <table border="1" id="courseTable">
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Section</th>
                        <th>Semester</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{formatSection(course.section)}</td>
                            <td>{course.semester}</td>
                            <td>
                                {changingSectionCode === course.code ? (
                                    <div className="changeSectionRow">
                                        <input
                                            type="text"
                                            value={sectionDraft}
                                            onChange={(e) => setSectionDraft(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSectionSubmit(course.code)}
                                        />
                                        <button type="button" onClick={() => handleSectionSubmit(course.code)}>Change</button>
                                        <button type="button" onClick={() => setChangingSectionCode(null)}>Cancel</button>
                                        <button type="button" onClick={() => dropCourse(course)}>Drop</button>
                                    </div>
                                ) : (
                                    <>
                                        <button type="button" onClick={() => handleChangeSectionClick(course)}>Change Section</button>
                                        <button type="button" onClick={() => dropCourse(course)}>Drop</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}