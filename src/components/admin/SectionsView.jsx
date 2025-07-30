import { useState } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import SectionUpdate from "./SectionUpdate";
import SectionAdd from "./SectionAdd";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';

// display a list of sections for year, semester and courseId.
//  courseId can be partial.  Example, "cs" will display all sections for courses beginning with "cs"
//  links to edit and delete a section
//  button to add a new section

function SectionsView() {

  const [sections, setSections] = useState([]);
  const [search, setSearch] = useState({ courseId: "", year: "", semester: "", });
  const [message, setMessage] = useState("");

  const fetchSections = async () => {
    if (search.courseId === "" || search.year === "" || search.semester === "") {
      setMessage("Enter search parameters");
    } else {
      try {
        const response = await fetch(
          `${REGISTRAR_URL}/courses/${search.courseId}/sections?year=${search.year}&semester=${search.semester}`,
          {
            method: "GET",
            headers: {
              "Authorization": sessionStorage.getItem("jwt"),
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSections(data);
          setMessage('');
        } else {
          const data = await response.json();
          setMessage(data);
        }
      } catch (err) {
        setMessage(err);
      }
    }
  };

  const deleteSection = async (secNo) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections/${secNo}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
      });
      if (response.ok) {
        setMessage("Section deleted");
        fetchSections();
      } else {
        const data = await response.json();
        setMessage(data);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const editChange = (event) => {
    setSearch({ ...search, [event.target.name]: event.target.value });
  };

  const onDelete = (e) => {
    const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
    const secNo = sections[row_idx].secNo;
    confirmAlert({
      title: "Confirm to delete",
      message: "Do you really want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteSection(secNo),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const headers = ["SecNo", "CourseId", "SecId", "Year", "Semester", "Building", "Room", "Times", "", "",];

  return (
    <div class="bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(https://wallpapers.com/images/hd/anime-school-background-dh3ommnxthw4nln7.jpg)] bg-cover bg-center h-screen items-center flex flex-col justify-center text-white">
      <h1 className="text-4xl font-bold mb-6">Sections</h1>
      <h3 class="text-2xl text-[#FCBCB8]"><Messages response={message} /></h3>

      {/* Search Form */}
      <div className="w-full max-w-xl bg-gray-800/75 rounded-lg shadow-xl p-6 mb-6">
        <h4 className="text-2xl font-semibold mb-4 text-center">Enter course prefix, year, semester.<br></br>Example: cst 2024 Spring</h4>
        <table className="w-full mb-4">
          <tbody>
            <tr className="border-b border-gray-700 last:border-b-0">
              <td className="py-2 pr-4 text-right text-gray-200">Course Prefix:</td>
              <td className="py-2">
                <input
                  type="text"
                  name="courseId"
                  placeholder="course id"
                  value={search.courseId}
                  onChange={editChange}
                  className="w-full p-2 rounded-md bg-gray-700 bg-opacity-90 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
              </td>
            </tr>
            <tr className="border-b border-gray-700 last:border-b-0">
              <td className="py-2 pr-4 text-right text-gray-200">Year:</td>
              <td className="py-2">
                <input
                  type="text"
                  name="year"
                  placeholder="year"
                  value={search.year}
                  onChange={editChange}
                  className="w-full p-2 rounded-md bg-gray-700 bg-opacity-90 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
              </td>
            </tr>
            <tr className="last:border-b-0">
              <td className="py-2 pr-4 text-right text-gray-200">Semester:</td>
              <td className="py-2">
                <input
                  type="text"
                  name="semester"
                  placeholder="semester"
                  value={search.semester}
                  onChange={editChange}
                  className="w-full p-2 rounded-md bg-gray-700 bg-opacity-90 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" onClick={fetchSections} className="rainbow-button w-full font-bold py-2.5 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
          Search for Sections
        </button>
      </div>

      {/* Sections Table */}
      <div className="w-full max-w-5xl bg-gray-800/75 rounded-lg shadow-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              {headers.map((s, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sections.map((s) => (
              <tr key={s.secNo} className="even:bg-gray-700 odd:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{s.secNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{s.courseId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{s.secId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{s.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{s.semester}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{s.building}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{s.room}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{s.times}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  <SectionUpdate editSection={s} onClose={fetchSections} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  <button onClick={onDelete} className="!bg-red-800 text-white font-bold py-1.5 px-3 rounded-md transition duration-300 ease-in-out text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SectionAdd onClose={fetchSections} />
    </div>
  );
}
export default SectionsView;
