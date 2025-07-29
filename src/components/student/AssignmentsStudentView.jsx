import { useState } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const AssignmentsStudentView = () => {

  const [message, setMessage] = useState('');
  const [assignments, setAssignments] = useState([]);

  const fetchData = async ({ year, semester }) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments?year=${year}&semester=${semester}`,
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
        setAssignments(data);
      } else {
        const rc = await response.json();
        setMessage(rc);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const headers = ['Course', 'Title', 'DueDate', 'Score'];

  return (
    <>
      <h3>Assignments</h3>
      <Messages response={message} />

      <SelectTerm buttonText="Get Assignments" onClick={fetchData} />

      {assignments.length > 0 ? (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: 'left', padding: '8px' }}>{a.courseId}</td>
                <td style={{ textAlign: 'left', padding: '8px' }}>{a.title}</td>
                <td style={{ textAlign: 'left', padding: '8px' }}>{a.dueDate}</td>
                <td style={{ textAlign: 'left', padding: '8px' }}>{a.score != null ? a.score : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No assignments to display.</p>
      )}


    </>
  );
}

export default AssignmentsStudentView;