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
    <div class="px-4 py-8">
  <div class="max-w-full mx-auto">
    <h3 class="text-3xl font-semibold mb-6 text-white text-center">Transcript</h3>
    <Messages response={message} class="text-lg text-gray-200 mb-6" />

    {courses.length > 0 ? (
      <>
        <div class="text-center mb-6 bg-gray-800/75 p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <p class="text-xl text-gray-200 mb-2">Student ID: <span class="font-bold">{courses[0].studentId}</span></p>
          <p class="text-xl text-gray-200">Student Name: <span class="font-bold">{courses[0].name}</span></p>
        </div>

        <div class="bg-gray-800/75 shadow-md rounded-lg mb-6">
          <table class="w-full table-auto divide-y divide-gray-700">
            <thead class="bg-gray-700">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    class="px-6 py-3 text-center text-base font-medium text-gray-200 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              {courses.map((c, idx) => (
                <tr key={idx} class="even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600 transition-colors duration-200">
                  <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{c.year}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{c.semester}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{c.courseId}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{c.sectionNo}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{c.title}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{c.credits}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{c.grade ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ) : (
      <p class="text-xl text-gray-300 text-center bg-gray-800/75 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        No transcript data available.
      </p>
    )}
  </div>
</div>
    </>
  );
}

export default Transcript;