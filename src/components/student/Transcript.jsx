import { useState, useEffect } from 'react';
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';


const Transcript = () => {

  const [message, setMessage] = useState('');
  const [courses, setCourses] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/transcripts`,
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
        setCourses(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const headers = ['Year', 'Semester', 'CourseId', 'Section', 'Title', 'Credits', 'Grade'];

  return (
    <>
      <h3>Transcript</h3>
      <Messages response={message} />
        {courses.length > 0 ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: '1em'}}>
            <p style={{ margin: '0' }}>Student ID: {courses[0].studentId}</p>
            <p style={{ margin: '0' }}>Student Name: {courses[0].name}</p>
          </div>

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
                {courses.map((c, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'left', padding: '8px' }}>{c.year}</td>
                    <td style={{ textAlign: 'left', padding: '8px' }}>{c.semester}</td>
                    <td style={{ textAlign: 'left', padding: '8px' }}>{c.courseId}</td>
                    <td style={{ textAlign: 'left', padding: '8px' }}>{c.sectionNo}</td>
                    <td style={{ textAlign: 'left', padding: '8px' }}>{c.title}</td>
                    <td style={{ textAlign: 'left', padding: '8px' }}>{c.credits}</td>
                    <td style={{ textAlign: 'left', padding: '8px' }}>{c.grade ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>No transcript data available.</p>
      )}
    </>
  );
}

export default Transcript;