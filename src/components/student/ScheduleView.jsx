import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const ScheduleView = () => {

  // student views their class schedule for a given term

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [term, setTerm] = useState({});

  const prefetchEnrollments = ({ year, semester }) => {
    setTerm({ year, semester });
    fetchEnrollments(year, semester);
  }

  const fetchEnrollments = async (year, semester) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`,
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
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const dropEnrollment = async (enrollmentId) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
      }
      )

      if (response.ok) {
        setMessage("Dropped class");
        fetchEnrollments(term.year, term.semester);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (error) {
      setMessage(error.toString());
    }
  }

  const handleDropClick = (enrollmentId) => {
    confirmAlert({
      title: "Confirm Drop",
      message: "Are you sure you want to drop this class?",
      buttons: [
        {
          label: "Yes",
          onClick: () => dropEnrollment(enrollmentId)
        },
        {
          label: "No"
        }
      ]
    })
  }


  const headings = ["enrollmentId", "secNo", "courseId", "secId", "building", "room", "times", ""];

  return (
    <div>
      <Messages response={message} />
      <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />
      <h3>My Schedule for {term.semester} {term.year}</h3>
      {enrollments.length === 0 ? (
          <p>No enrollments found.</p>
      ) : (
          <table>
            <thead>
            <tr>
              {headings.map((heading, idx) => (
                  <th key={idx}>{heading || 'Action'}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {enrollments.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.enrollmentId}</td>
                  <td>{e.sectionNo}</td>
                  <td>{e.courseId}</td>
                  <td>{e.sectionId}</td>
                  <td>{e.building}</td>
                  <td>{e.room}</td>
                  <td>{e.times}</td>
                  <td>
                    <button onClick={() => handleDropClick(e.enrollmentId)}>Drop</button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
      )}
    </div>
  );

}

export default ScheduleView;