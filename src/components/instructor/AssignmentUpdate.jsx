import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentUpdate = ({ editAssignment, onClose }) => {


  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({});
  const dialogRef = useRef();

  /*
   *  dialog for edit of an assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment(editAssignment);
    dialogRef.current.showModal();
  };

  const saveAssignment = async () => {
    // Validate that due date is not empty
    if (!assignment.dueDate || assignment.dueDate.trim() === '') {
      setMessage('Can not submit empty date');
      return;
    }

    // Validate that title is not empty
    if (!assignment.title || assignment.title.trim() === '') {
      setMessage('Assignment title cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(assignment),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage('Assignment updated successfully');
        dialogRef.current.close();
        onClose();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <>
      <button class="!bg-indigo-800" onClick={editOpen}>Edit</button>
      <dialog ref={dialogRef} >
        <h2>{`Editing Assignment ID: ${editAssignment.id}`}</h2>
        <Messages response={message} />
        <input
          type="text"
          placeholder="Assignment title"
          value={assignment.title || ''}
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          style={{ margin: '10px' }}
        />
        <input
          type="date"
          value={assignment.dueDate || ''}
          onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
          style={{ margin: '10px' }}
        />
        <button onClick={() => dialogRef.current.close()} style={{ margin: '10px' }}>Close</button>
        <button onClick={saveAssignment} style={{ margin: '10px' }} >Save</button>

      </dialog>
    </>
  )
}

export default AssignmentUpdate;
