import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import CourseUpdate from "./CourseUpdate";
import CourseAdd from "./CourseAdd";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';


// display list of courses with link to edit or delete a course
//  button for adding new course

function CoursesView() {

  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/courses`,
        {
          method: "GET",
          headers: {
            "Authorization": sessionStorage.getItem("jwt"),
          }
        });
      if (response.ok) {
        const courses = await response.json();
        setCourses(courses);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);



  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
      });
      if (response.ok) {
        setMessage("Course deleted");
        fetchCourses();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const onDelete = (courseId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Do you really want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteCourse(courseId),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const headers = ["CourseId", "Title", "Credits", "", ""];

  return (
    <div class="bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(https://wallpapers.com/images/hd/anime-school-background-dh3ommnxthw4nln7.jpg)] bg-cover bg-center h-screen items-center flex flex-col justify-center text-white">
      <h1 className="text-4xl font-bold mb-6">Courses</h1>
      <Messages response={message} />
      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-75 rounded-lg shadow-xl overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              {headers.map((s, idx) => (
                <th key={idx} className="px-6 py-3 text-center font-semibold text-gray-200 uppercase tracking-wider">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {courses.map((c) => (
              <tr key={c.courseId} className="even:bg-gray-700 odd:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">{c.courseId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">{c.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">{c.credits}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                  <CourseUpdate editCourse={c} onClose={fetchCourses} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                  <button onClick={() => onDelete(c.courseId)} className="!bg-red-800 text-white font-bold py-1.5 px-3 rounded-md transition duration-300 ease-in-out ">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CourseAdd onClose={fetchCourses} />
    </div>
  );
}
export default CoursesView;
