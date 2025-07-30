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
      <div class="px-4 py-8">
        <div class="max-w-full mx-auto"> <Messages response={message} class="text-lg text-gray-200 mb-6" />

          <div class="mb-8 flex justify-center">
            <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />
          </div>

          <h3 class="text-3xl font-semibold mb-6 text-white text-center">My Schedule for {term.semester} {term.year}</h3>
          {enrollments.length === 0 ? (
            <p class="text-xl text-gray-300 text-center bg-gray-800/75 p-6 rounded-lg shadow-md max-w-lg mx-auto">
              No enrollments found for this term.
            </p>
          ) : (
            <div class="bg-gray-800/75 shadow-md rounded-lg mb-6">
              <table class="w-full table-auto divide-y divide-gray-700">
                <thead class="bg-gray-700">
                  <tr>
                    {headings.map((heading, idx) => (
                      <th
                        key={idx}
                        scope="col"
                        class="px-6 py-3 text-center text-base font-medium text-gray-200 uppercase tracking-wider"
                      >
                        {heading || 'Action'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                  {enrollments.map((e, idx) => (
                    <tr key={idx} class="even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600 transition-colors duration-200">
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{e.enrollmentId}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{e.sectionNo}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{e.courseId}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{e.sectionId}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{e.building}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{e.room}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{e.times}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">
                        <button onClick={() => handleDropClick(e.enrollmentId)} class="!bg-red-800 text-white font-bold py-1.5 px-3 rounded-md transition duration-300 ease-in-out text-base shadow-md">
                          Drop
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}

export default ScheduleView;