import { Outlet, Link } from "react-router-dom";
import UsersView from "./UsersView";
import CoursesView from "./CoursesView";
import SectionsView from "./SectionsView";
import Logout from "../../Logout";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Routes, home page and nav bar for admin type user

export const AdminRouter = ({ logout }) => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<UsersView />} />
            <Route path="courses" element={<CoursesView />} />
            <Route path="sections" element={<SectionsView />} />
            <Route path="logout" element={<Logout logout={logout} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export const AdminHome = () => {
  return (
    <div class="bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(https://wallpapers.com/images/hd/anime-school-background-dh3ommnxthw4nln7.jpg)] bg-cover bg-center h-screen items-center flex flex-col justify-center text-white">
      <div class="bg-[#003366]/60 p-9 rounded-xl shadow-lg flex flex-col items-center space-y-6">
        <h2 className="text-8xl font-bold mb-2">Admin Home</h2>
        <p class="text-4xl">Manage users, courses and sections.</p>
      </div>
    </div>
  );
};

export const AdminLayout = () => {
  return (
    <>
      <nav className="bg-[#003366] p-4 shadow-lg">
        <div className="container mx-auto flex justify-center items-center space-x-6">
          <Link to="/" className="!text-white text-lg font-medium hover:text-blue-100 transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#56BDA2]">Home</Link>
          <Link to="/users" className="!text-white text-lg font-medium hover:text-blue-100 transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#56BDA2]">Users</Link>
          <Link to="/courses" className="!text-white text-lg font-medium hover:text-blue-100 transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#56BDA2]">Courses</Link>
          <Link to="/sections" className="!text-white text-lg font-medium hover:text-blue-100 transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#56BDA2]">Sections</Link>
          <Link to="/logout" className="!text-white text-lg font-medium hover:text-blue-100 transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#56BDA2]">Logout</Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
};
