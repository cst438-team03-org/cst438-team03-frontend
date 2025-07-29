import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { GRADEBOOK_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import Messages from '../Messages';


const AssignmentsView = () => {

  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;


  const fetchAssignments = async () => {

    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/assignments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("jwt"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, []);

  const handleDelete = async (assignmentId ,assignmentTitle) =>
  {
    confirmAlert({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${assignmentTitle} assignment?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () =>
          {
            try
            {
              const response = await fetch(`${GRADEBOOK_URL}/assignments/${assignmentId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': sessionStorage.getItem('jwt'),
                },
              });
              if (response.ok)
              {
                setMessage('Assignment deleted successfully');
                fetchAssignments();
              } else
              {
                const errorText = await response.text();
                setMessage(`Error: ${errorText}`);
              }
            } catch (err)
            {
              setMessage(`Error: ${err.message}`);
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const headers = ['id', 'Title', 'Due Date', '', '', ''];

  return (
    <div>
      <Messages response={message} />
      <div class="px-4 py-8">
        <div class="max-w-4xl mx-auto">
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
                {assignments.map((assignment, index) => (
                  <tr key={index} class="even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600 transition-colors duration-200">
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{assignment.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{assignment.title}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">{assignment.dueDate}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">
                      <AssignmentGrade assignment={assignment} onClose={fetchAssignments} />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">
                      <AssignmentUpdate editAssignment={assignment} onClose={fetchAssignments} />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-base text-gray-100">
                      <button onClick={() => handleDelete(assignment.id, assignment.title)} class="bg-red-700 hover:bg-red-600 text-white font-bold py-1.5 px-3 rounded-md transition duration-300 ease-in-out text-base shadow-md"> Delete </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div class="mt-6 mb-8">
            <AssignmentAdd secNo={secNo} onClose={fetchAssignments} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentsView;
