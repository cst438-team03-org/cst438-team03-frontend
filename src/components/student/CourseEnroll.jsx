import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';

const CourseEnroll = (props) => {

  // student adds a course to their schedule

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = async () => {
    // get a list of open sections for enrollment
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections/open`,
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
        setSections(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchSections();
  }, []);

  //  Enrolls the student in the selected section
  const enrollInSection = async (sectionNo) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/sections/${sectionNo}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        setMessage("Enrolled in section " + sectionNo);
        await fetchSections();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (error) {
      setMessage(error.toString());
    }
  }

  //  Brings up an alert message to confirm/deny enrollment in section
  const handleAddClick =  (courseId, sectionNo) => {
    confirmAlert({
      title: "Confirm Enrollment",
      message: "Are you sure you want to add " + courseId + " section " + sectionNo + " to your schedule?",
      buttons: [
        {
          label: "Yes",
          onClick: () => enrollInSection(sectionNo)
        },
        {
          label: "No"
        }
      ]
    })
  }



  const headers = ['section No', 'year', 'semester', 'course Id', 'section', 'title', 'building', 'room', 'times', 'instructor', ''];

  return (
    <div>
      <Messages response={message} />
      <h3>Open Sections Available for Enrollment</h3>
      <table>
        <thead>
          <tr>
            {headers.map((column, idx) => (<th key={idx}>{column}</th>))}
          </tr>
        </thead>
        <tbody>
        {sections.map((sectionHeader, index) => (
            <tr key={index}>
              <td>{sectionHeader.secNo}</td>
              <td>{sectionHeader.year}</td>
              <td>{sectionHeader.semester}</td>
              <td>{sectionHeader.courseId}</td>
              <td>{sectionHeader.secId}</td>
              <td>{sectionHeader.title}</td>
              <td>{sectionHeader.building}</td>
              <td>{sectionHeader.room}</td>
              <td>{sectionHeader.times}</td>
              <td>{sectionHeader.instructorName}</td>
              <td>
                <button onClick={() => handleAddClick(
                    sectionHeader.courseId, sectionHeader.secNo)}>
                  Add</button>
              </td>
            </tr>
            ))
        }
        </tbody>
      </table>

    </div>
  );
}

export default CourseEnroll;