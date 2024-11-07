import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import "./styles/App.scss";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import path from "./helpers/routerPath";
import SuperAdministratorPage from "./pages/SuperAdmin/SuperadminPage";
import UsersPage from "./pages/SuperAdmin/UsersPage";
import History from "./pages/SuperAdmin/History";
import AuthLogs from "./pages/SuperAdmin/AuthLogs";
import SlotHistory from "./pages/SuperAdmin/SlotHistory";
import GoogleSheets from "./pages/SuperAdmin/GoogleSheets";
import ManagerPage from "./pages/Manager/ManagerPage";
import PlanningPage from "./pages/Manager/PlanningPage";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/Footer/Footer";
import TeamCalendar from "./pages/SuperAdmin/TeamCalendar";
import CurrentMeetingsPage from "./pages/SuperAdmin/CurrentMeetingsPage";
import CurrentMeetingsPageList from "./pages/SuperAdmin/CurrentMeetingsPageList";
import CurrentMeetingsPageTable from "./pages/SuperAdmin/CurrentMeetingsPageTable";

const ProtectedRoute = ({ children }) => {
  const { managerId } = useParams();
  const loggedInUserId = useSelector((state) => state.auth.user.id);

  if (managerId !== String(loggedInUserId)) {
    return (
      <Navigate to={`/manager/${loggedInUserId}/planning/`} replace />
    );
  }

  return children;
};

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.user.role);
  const userId = useSelector((state) => state.auth.user.id);

  return (
    <>
      <Routes>
        {isAuthenticated ? (
          <>
            {userRole === 3 && (
              <>
                <Route path={path.manager} element={<ManagerPage />}>
                  
                  <Route path={path.planning} element={<PlanningPage />} />
                  
                </Route>
              </>
            )}
            {(userRole === 3) && (
              <>
                <Route path={path.teamCalendar} element={<TeamCalendar />} />
                
                <Route path={path.history} element={<History />}>
                  <Route path={path.authorization} element={<AuthLogs />} />
                  <Route path={path.slotHistory} element={<SlotHistory />} />
                  <Route path={path.googleSheets} element={<GoogleSheets />} />
                </Route>
                {/* <Route
                  path={path.currentManagers}
                  element={<CurrentMeetingsPage />}
                />
                <Route
                  path={path.currentManagersList}
                  element={<CurrentMeetingsPageList />}
                /> */}
                <Route
                  path={path.currentManagersTable}
                  element={<CurrentMeetingsPageTable />}
                />
                
                <Route
                  path={path.admin}
                  element={<Navigate to={path.users} />}
                />
                

                {userRole === 3 && (
                  <Route
                    path={path.all}
                    element={<Navigate to={path.superAdmin} />}
                  />
                )}
                <Route
                  path={path.superAdmin}
                  element={<Navigate to={path.users} />}
                />
                <Route
                  path={path.superAdmin}
                  element={<SuperAdministratorPage />}
                >
                  <Route path={path.users} element={<UsersPage />} />
                </Route>
              </>
            )}

            {userRole === 2 && (
              <>
                {userRole === 2 && (
                  <Route
                    path={path.all}
                    element={
                      <Navigate to={`manager/${userId}/planning/`} />
                    }
                  />
                )}
                <Route
                  path={path.manager}
                  element={
                    <ProtectedRoute>
                      <ManagerPage />
                    </ProtectedRoute>
                  }
                >
                  
                  <Route path={path.planning} element={<PlanningPage />} />
                </Route>
              </>
            )}
            

            
          </>
        ) : (
          <>
            <Route path={path.all} element={<Navigate to={path.home} />} />
            <Route path={path.home} element={<HomePage />} />
          </>
        )}
      </Routes>

          <Footer />
      
    </>
  );
};

export default App;
