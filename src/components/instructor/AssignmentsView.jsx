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

  const handleDelete = async (assignmentId) =>
  {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this assignment?',
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

      <p>To be implemented. Display a table. Column headings are as givin in headers.
        For each row, show the id, title, due date of the assignment
        along with buttons to edit and delete the assignment </p>

      <table className="table table-striped">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index}>
              <td>{assignment.id}</td>
              <td>{assignment.title}</td>
              <td>{assignment.dueDate}</td>
              <td>
                <AssignmentGrade assignment={assignment} onClose={fetchAssignments} />
              </td>
              <td>
                <AssignmentUpdate assignment={assignment} onClose={fetchAssignments} />
              </td>
              <td>
                <button onClick={() => handleDelete(assignment.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AssignmentAdd secNo={secNo} onClose={fetchAssignments} />
    </div>
  );
}

export default AssignmentsView;
