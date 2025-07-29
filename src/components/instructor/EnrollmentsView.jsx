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
      <div class="px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <h3 class="text-3xl font-semibold mb-4 text-white">
      {courseId}-{secId} Enrollments
    </h3>
    <Messages response={message} class="text-lg text-gray-200 mb-6" />

    <div class="overflow-x-auto bg-gray-800/75 shadow-md rounded-lg mb-6">
      <table class="min-w-full divide-y divide-gray-700">
        <thead class="bg-gray-700">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                class="px-6 py-3 text-center text-base font-medium text-gray-200 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          {enrollments.map((enrollment, index) => (
            <tr key={index} class="even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{enrollment.enrollmentId}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{enrollment.studentId}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{enrollment.name}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{enrollment.email}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">
                <input
                  type="text"
                  onChange={(e) => handleGradeChange(index, e.target.value)}
                  placeholder="Enter grade"
                  class="p-2 w-32 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <button onClick={saveAllGrades} class="px-6 py-3 !bg-[#8aa35d] text-white font-semibold rounded-lg shadow-md focus:outline-none transition duration-300 ease-in-out">
      Save All Grades
    </button>
  </div>
</div>

    </>
  );
}

export default EnrollmentsView;
