import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import VolunteerLogin from "./pages/VolunteerLogin";
import VolunteerSignup from "./pages/VolunteerSignup";
import NGOLogin from "./pages/NGOLogin";
import NGOSignup from "./pages/NGOSignup";
import VolunteerDashboard from "./pages/volunteer/Dashboard";
import VolunteerTasks from "./pages/volunteer/Tasks";
import VolunteerHistory from "./pages/volunteer/History";
import VolunteerGroupChat from "./pages/volunteer/GroupChat";
import VolunteerReportNeed from "./pages/volunteer/ReportNeed";
import NGODashboard from "./pages/ngo/Dashboard";
import NGORequests from "./pages/ngo/Requests";
import NGOHistory from "./pages/ngo/History";
import NGOReportedIssues from "./pages/ngo/ReportedIssues";
import NGOActiveNeeds from "./pages/ngo/ActiveNeeds";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/volunteer/login",
    Component: VolunteerLogin,
  },
  {
    path: "/volunteer/signup",
    Component: VolunteerSignup,
  },
  {
    path: "/ngo/login",
    Component: NGOLogin,
  },
  {
    path: "/ngo/signup",
    Component: NGOSignup,
  },
  {
    path: "/volunteer/dashboard",
    Component: VolunteerDashboard,
  },
  {
    path: "/volunteer/tasks",
    Component: VolunteerTasks,
  },
  {
    path: "/volunteer/history",
    Component: VolunteerHistory,
  },
  {
    path: "/volunteer/chat",
    Component: VolunteerGroupChat,
  },
  {
    path: "/volunteer/report",
    Component: VolunteerReportNeed,
  },
  {
    path: "/ngo/dashboard",
    Component: NGODashboard,
  },
  {
    path: "/ngo/requests",
    Component: NGORequests,
  },
  {
    path: "/ngo/history",
    Component: NGOHistory,
  },
  {
    path: "/ngo/issues",
    Component: NGOReportedIssues,
  },
  {
    path: "/ngo/needs",
    Component: NGOActiveNeeds,
  },
]);
