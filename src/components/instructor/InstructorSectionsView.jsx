import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { GRADEBOOK_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';


const InstructorSectionsView = () => {

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');


  const fetchSections = async (term) => {

    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections?year=${term.year}&semester=${term.semester}`,
        {
          method: 'GET',
          headers: {
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSections(data);
        setMessage("")
      } else {
        const rc = await response.json();
        setMessage("")
        setMessage(rc);
      }
    } catch (err) {
      setMessage("")
      setMessage(err);
    }
  }

  const headers = ['secNo', 'course id', 'sec id', 'building', 'room', 'times', '', ''];

  return (
    <>
      <div class="px-4 py-8">
        <div class="max-w-7xl mx-auto"> 
          <div class="mb-8 flex flex-col sm:flex-row items-center sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <SelectTerm onClick={fetchSections} buttonText="Get Sections"/>
          </div>
          <Messages response={message} class="text-lg text-gray-200" />
          <h3 class="text-3xl font-semibold mb-6 text-white">Sections</h3>

          <div class="bg-gray-800/75 shadow-md rounded-lg overflow-hidden">
            <table class="w-full table-auto divide-y divide-gray-700">
              <thead class="bg-gray-700">
                <tr>
                  {headers.map((s, idx) => (
                    <th key={idx} scope="col" class="px-6 py-3 text-center text-base font-medium text-gray-200 uppercase tracking-wider w-auto"> {s} </th>
                  ))}
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                {sections.map((s) => (
                  <tr key={s.secNo} class="even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600 transition-colors duration-200">
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{s.secNo}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100 min-w-[120px]">
                      {s.courseId}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100 min-w-[100px]">
                      {s.secId}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{s.building}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{s.room}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{s.times}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-base font-medium">
                      <Link id="enrollmentsLink" to="/enrollments" state={s} class="!text-[#AAF0D1] transition-colors duration-200">Enrollments</Link>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-base font-medium">
                      <Link id="assignmentsLink" to="/assignments" state={s} class="!text-[#CFEDFE] transition-colors duration-200">Assignments</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default InstructorSectionsView;

