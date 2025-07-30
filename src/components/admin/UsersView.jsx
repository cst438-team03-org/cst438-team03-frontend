import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import UserUpdate from "./UserUpdate";
import UserAdd from "./UserAdd";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';

// list all users with links to edit, delete each user
//  button to add new user

function UsersView() {

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/users`,
        {
          method: "GET",
          headers: {
            "Authorization": sessionStorage.getItem("jwt"),
          }
        }
      );
      if (response.ok) {
        const users = await response.json();
        setUsers(users);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
      });
      if (response.ok) {
        setMessage("User deleted");
        fetchUsers();
      } else {
        const body = await response.json();
        setMessage(getMessageDetails(body));
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const onDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Do you really want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteUser(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const headers = ["ID", "Name", "Email", "Type", "", ""];

  return (
    <>
      <div class="bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(https://wallpapers.com/images/hd/anime-school-background-dh3ommnxthw4nln7.jpg)] bg-cover bg-center h-screen items-center flex flex-col justify-center text-white">
        <h1 className="text-4xl font-bold mb-6">Users</h1>
        <Messages response={message}/>
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
              {users.map((user) => (
                <tr key={user.id} className="even:bg-gray-700 odd:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                    <UserUpdate editUser={user} onClose={fetchUsers} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                    <button onClick={() => onDelete(user.id)} className="!bg-red-800 text-white font-bold py-1.5 px-3 rounded-md transition duration-300 ease-in-out">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <UserAdd onClose={fetchUsers} />
      </div>
    </>
  );
}
export default UsersView;
