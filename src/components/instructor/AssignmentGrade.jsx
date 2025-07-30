import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentGrade = ({ assignment }) => {

  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const dialogRef = useRef();



  const editOpen = () => {
    setMessage('');
    setGrades([]);
    fetchGrades(assignment.id);
     dialogRef.current.showModal();
  };

  const editClose = () => {
    dialogRef.current.close();
  };

  const fetchGrades = async (assignmentId) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments/${assignmentId}/grades`,
        {
          method: 'GET',
          headers: {
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setGrades(data);
      } else {
        setMessage(data);
      }
    } catch (err) {
      setMessage(err);
    }
  }



  const headers = ['gradeId', 'student name', 'student email', 'score'];

  const handleScoreChange = (gradeId, newScore) => {
    // Convert empty string to null for proper handling
    const scoreValue = newScore === '' ? null : parseInt(newScore);
    
    setGrades(grades.map(grade => 
      grade.gradeId === gradeId 
        ? { ...grade, score: scoreValue }
        : grade
    ));
  };

  const handleSave = async () => {
    // Check for empty scores before saving
    const emptyScores = grades.filter(grade => 
      grade.score === '' || grade.score === null || grade.score === undefined
    );
    
    if (emptyScores.length > 0) {
      setMessage('Please enter scores for all students before saving');
      return;
    }

    // Validate that all scores are valid numbers within range
    const invalidScores = grades.filter(grade => {
      const score = parseFloat(grade.score);
      return grade.score !== '' && grade.score !== null && grade.score !== undefined && 
             (isNaN(score) || score < 0 || score > 100);
    });

    if (invalidScores.length > 0) {
      setMessage('All scores must be valid numbers between 0 and 100');
      return;
    }

    try {
      const response = await fetch(`${GRADEBOOK_URL}/grades`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(grades)
        }
      );
      
      if (response.ok) {
        setMessage('Grades saved successfully');
        setTimeout(() => {
          editClose();
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <>
      <button id="gradeButton" class="!bg-purple-800" onClick={editOpen}>Grade</button>
      <dialog ref={dialogRef}>
        <h2>Grade Assignment: {assignment.title}</h2>
        <Messages response={message} />
        
        <table className="table table-striped">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} style={{ padding: '10px 15px' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.gradeId}>
                <td style={{ padding: '10px 15px' }}>{grade.gradeId}</td>
                <td style={{ padding: '10px 15px' }}>{grade.studentName}</td>
                <td style={{ padding: '10px 15px' }}>{grade.studentEmail}</td>
                <td style={{ padding: '10px 15px' }}>
                  <input
                    type="number"
                    value={grade.score || ''}
                    onChange={(e) => handleScoreChange(grade.gradeId, e.target.value)}
                    min="0"
                    max="100"
                    step="1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleSave} style={{ marginRight: '10px' }}>Save</button>
          <button onClick={editClose}>Close</button>
        </div>
      </dialog>
    </>
  );
}

export default AssignmentGrade;