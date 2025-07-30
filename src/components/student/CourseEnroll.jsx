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
        <div class="px-4 py-8">
          <div class="max-w-full mx-auto">
            <h3 class="text-3xl font-semibold mb-6 text-white text-center">Open Sections Available for Enrollment</h3>

            <div class="bg-gray-800/75 shadow-md rounded-lg mb-6">
              <table class="w-full table-auto divide-y divide-gray-700">
                <thead class="bg-gray-700">
                  <tr>
                    {headers.map((column, idx) => (
                      <th
                        key={idx}
                        scope="col"
                        class="px-6 py-3 text-center text-base font-medium text-gray-200 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                  {sections.map((sectionHeader, index) => (
                    <tr key={index} class="even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600 transition-colors duration-200">
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.secNo}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.year}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.semester}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.courseId}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.secId}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.title}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.building}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.room}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.times}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{sectionHeader.instructorName}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">
                        <button onClick={() => handleAddClick(sectionHeader.courseId, sectionHeader.secNo)} class="!bg-green-700 text-white font-bold py-1.5 px-3 rounded-md transition duration-300 ease-in-out text-base shadow-md">
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  );
}

export default CourseEnroll;