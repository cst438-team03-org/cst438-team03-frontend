import { Outlet, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScheduleView from "./ScheduleView";
import Transcript from "./Transcript";
import CourseEnroll from "./CourseEnroll";
import AssignmentsStudentView from "./AssignmentsStudentView";
import Logout from "../../Logout";

export const StudentRouter = ({ logout }) => {

  return (
    <div className="App class bg-[linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(https://image.lexica.art/full_webp/5b864385-9d52-4125-97e6-7848fcecaa4f)] bg-cover bg-center h-screen items-center flex flex-col pt-30 text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StudentLayout />}>
            <Route index element={<StudentHome />} />
            <Route path="studentAssignments" element={<AssignmentsStudentView />} />
            <Route path="schedule" element={<ScheduleView />} />
            <Route path="addCourse" element={<CourseEnroll />} />
            <Route path="transcript" element={<Transcript />} />
            <Route path="logout" element={<Logout logout={logout} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export const StudentHome = () => {
  return (
    <div class="flex items-center h-75">
      <div class="bg-[#003366]/30 p-8 rounded-lg shadow-xl text-center">
        <h2 class="text-7xl font-extrabold text-white">Student Home</h2>
        <p class="mt-5 text-xl">Add/drop courses and view your schedule, assignments, and transcript</p>
      </div>
    </div>
  );
};

export const StudentLayout = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[#152941] p-4 shadow-lg z-50">
        <div className="container mx-auto flex justify-center items-center space-x-6">
          <Link to="/" className="!text-white text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#8a6e19]">Home</Link>
          <Link id="scheduleLink" to="/schedule" className="!text-white text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#8a6e19]">View Class Schedule</Link>
          <Link id="addCourseLink" to="/addCourse" className="!text-white text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#8a6e19]">Enroll in a class</Link>
          <Link id="viewAssignmentsLink" to="/studentAssignments" className="!text-white text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#8a6e19]">View Assignments</Link>
          <Link id="transcriptLink" to="/transcript" className="!text-white text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#8a6e19]">View Transcript</Link>
          <Link id="logoutLink" to="/logout" className="!text-white text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-[#8a6e19]">Logout</Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
};