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

  const saveAssignment = async () =>
  {
    try
    {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(assignment),
      });
      if (response.ok)
      {
        const data = await response.json();
        setMessage('Assignment updated successfully');
        dialogRef.current.close();
        onClose();
      } else
      {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err)
    {
      setMessage(err);
    }
  };

  return (
    <>
      <button onClick={editOpen}>Edit</button>
      <dialog ref={dialogRef} >
        <p>To be implemented.  Show the id, title and due date of the assignemnt.
          Allow user to edit the title and due date.
          Buttons for Close and Save.
        </p>

        <h2>{`Editing Assignment ID: ${editAssignment.id}`}</h2>
        <Messages response={message} />
        <input
          type="text"
          placeholder="Assignment title"
          value={assignment.title || ''}
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
        />
        <input
          type="date"
          value={assignment.dueDate || ''}
          onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
        />
        <button onClick={() => dialogRef.current.close()}>Close</button>
        <button onClick={saveAssignment}>Save</button>

      </dialog>
    </>
  )
}

export default AssignmentUpdate;
