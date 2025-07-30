import { Outlet, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssignmentsView from "./AssignmentsView";
import EnrollmentsView from "./EnrollmentsView";
import InstructorSectionsView from "./InstructorSectionsView";
import Logout from "../../Logout";

export const InstructorRouter = ({ logout }) => {

  return (
    <div className="App class bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(https://wallpapers.com/images/hd/bright-anime-classroom-47m0khjt8s0p7c2s.jpg)] bg-cover bg-center h-screen items-center flex flex-col pt-30 text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InstructorLayout />}>
            <Route index element={<InstructorSectionsView />} />
            <Route path="assignments" element={<AssignmentsView />} />
            <Route path="enrollments" element={<EnrollmentsView />} />
            <Route path="logout" element={<Logout logout={logout} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const InstructorLayout = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[#253529] p-4 shadow-lg z-50">
        <div className="container mx-auto flex justify-center items-center space-x-6">
          <Link id="homeLink" to="/" className="!text-white text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#e8757e]">Home</Link>
          <Link id="logoutLink" to="/logout" className="!text-white text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#e8757e]">Logout</Link>
        </div>
      </nav>
      <div class="flex flex-col justify-center bg-[#9B4C5A]/70 rounded-lg p-6">
        <h2 class="text-6xl font-bold mb-2 text-white">Instructor Home</h2>
        <p class="text-2xl text-gray-200">Manage assignments and grades.</p>
      </div>
      <Outlet />
    </>
  );
};



export default InstructorLayout;
