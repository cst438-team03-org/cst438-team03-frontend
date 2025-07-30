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
        setMessage("");
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
<div class="px-4 py-8">
  <div class="max-w-full mx-auto">
    <h3 class="text-3xl font-semibold mb-6 text-white text-center">Assignments</h3>
    <Messages response={message} class="text-lg text-gray-200 mb-6" />

    <div class="mb-8 flex justify-center">
      <SelectTerm buttonText="Get Assignments" onClick={fetchData} />
    </div>

    {assignments.length > 0 ? (
      <div class="bg-gray-800/75 shadow-md rounded-lg mb-6">
        <table class="w-full table-auto divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" class="px-6 py-3 text-center text-base font-medium text-gray-200 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            {assignments.map((a, idx) => (
              <tr key={idx} class="even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{a.courseId}</td>
                <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{a.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{a.dueDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">
                  {a.score != null ? a.score : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p class="text-xl text-gray-300 text-center bg-gray-800/75 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        No assignments to display.
      </p>
    )}
  </div>
</div>
    </>
  );
}

export default AssignmentsStudentView;