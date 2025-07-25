import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const EnrollmentsView = () => {

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/enrollments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const handleGradeChange = (index, newGrade) => {
    const updatedEnrollments = [...enrollments];
    updatedEnrollments[index].grade = newGrade;
    setEnrollments(updatedEnrollments);
  };

  const saveAllGrades = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/enrollments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(enrollments),
        }
      );
      if (response.ok) {
        setMessage('Grades saved successfully');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    fetchEnrollments()
  }, []);

  const headers = ['enrollment id', 'student id', 'name', 'email', 'grade'];

  return (
    <>
      <h3> {courseId}-{secId} Enrollments</h3>
      <Messages response={message} />
      
      <table style={{ borderSpacing: '15px 10px', borderCollapse: 'separate' }}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={{ padding: '10px', textAlign: 'left' }}>{header}</th>
            ))}
          </tr> 
        </thead>
        <tbody>
          {enrollments.map((enrollment, index) => (
            <tr key={index}>
              <td style={{ padding: '8px' }}>{enrollment.enrollmentId}</td>
              <td style={{ padding: '8px' }}>{enrollment.studentId}</td>
              <td style={{ padding: '8px' }}>{enrollment.name}</td>
              <td style={{ padding: '8px' }}>{enrollment.email}</td>
              <td style={{ padding: '8px' }}>
                <input
                  type="text"
                  onChange={(e) => handleGradeChange(index, e.target.value)}
                  placeholder="Enter grade"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={saveAllGrades} >
        Save All Grades
      </button>

    </>
  );
}

export default EnrollmentsView;
