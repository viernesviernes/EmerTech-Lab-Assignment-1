import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_STUDENT_COURSES,
  ENROLL_COURSE,
  CHANGE_SECTION,
  DROP_COURSE,
} from '../graphql/queries';

export default function StudentDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { data, refetch: refetchCourses } = useQuery(GET_STUDENT_COURSES, {
        variables: { studentId: user?._id ?? '' },
        skip: !user?._id,
    });
    const courses = data?.studentCourses ?? [];

    const [enrollCourseMutation] = useMutation(ENROLL_COURSE);
    const [changeSectionMutation] = useMutation(CHANGE_SECTION);
    const [dropCourseMutation] = useMutation(DROP_COURSE);

    const enrollCourse = async (courseCode, section) => {
        if (!user?._id) return;
        try {
            await enrollCourseMutation({
                variables: { studentId: user._id, code: Number(courseCode), section: Number(section) },
            });
            refetchCourses();
        } catch (e) {
            console.error(e);
            window.alert('Failed to enroll');
        }
    };

    const changeSection = async (courseCode, section) => {
        if (!user?._id) return;
        try {
            await changeSectionMutation({
                variables: { studentId: user._id, courseCode: Number(courseCode), section: Number(section) },
            });
            refetchCourses();
        } catch (e) {
            console.error(e);
            throw new Error('Failed to change section');
        }
    };

    const dropCourse = async (course) => {
        if (!user?._id) return;
        try {
            await dropCourseMutation({
                variables: { studentId: user._id, code: course.code, section: course.section },
            });
            refetchCourses();
        } catch (e) {
            console.error(e);
            window.alert('Failed to drop course');
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
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