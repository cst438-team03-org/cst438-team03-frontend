import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentAdd = ({ onClose, secNo }) => {

  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({ title: '', dueDate: '' });
  const dialogRef = useRef();

  /*
   *  dialog for add assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment({ ...assignment, secNo: secNo, title: '', dueDate: '' });
    // to be implemented.  invoke showModal() method on the dialog element.
     dialogRef.current.showModal();
  };

  const saveAssignment = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(assignment),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage('Assignment added successfully');
        dialogRef.current.close();
        onClose(); // Call parent to refresh assignments list
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
      <button id="addAssignmentButton" onClick={editOpen}>Add Assignment</button>
      <dialog ref={dialogRef} >
        <h2>Add Assignment</h2>
        <Messages response={message} />
        <input 
          type="text" 
          placeholder="Assignment title" 
          onChange={(e) => setAssignment({...assignment, title: e.target.value})}
        />
        <input 
          type="date" 
          onChange={(e) => setAssignment({...assignment, dueDate: e.target.value})}
        />
        <button onClick={() => dialogRef.current.close()}>Close</button>
        <button onClick={saveAssignment}>Save</button>
      </dialog>
    </>
  )
}

export default AssignmentAdd;
