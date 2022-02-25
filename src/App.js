import { Route, Routes, Navigate } from 'react-router-dom';

// import components
import Dashboard from './components/Dashboard.component';
import Login from './components/Login.component';
import Profile from './components/Profile.component';
import Hackathon from './components/Hackathon.component';
import ProblemStatements from './components/ProblemStatements.component';
import MyTeam from './components/MyTeam.component';
import PublicTeams from './components/PublicTeams.component';
import Requests from './components/Requests.component';
import MyRegistrations from './components/MyRegistrations.component';
import NotFound from './components/NotFound.component';
import ProtectedRoute from './ProtectedRoute';
import SearchTeam from './components/SearchTeam.component';
import ChangePassword from './components/ChangePassword.component';
import ForgotPassword from './components/ForgotPassword.component';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <h1 className="text-lg">Home</h1>
        }/>
        <Route path="/login" element={<Login />} />
        <Route path="/user/forgot" element={<ForgotPassword />} />
        <Route path="/user/changePassword/:confirmationCode" element={<ChangePassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/myReg" element={<MyRegistrations />} />
          <Route path="/user/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate replace to="profile" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="hackathon" element={<Hackathon />} />
            <Route path="problemStatements" element={<ProblemStatements />} />
            <Route path="myTeam" element={<MyTeam />} />
            <Route path="publicTeams" element={<PublicTeams />} />
            <Route path="searchTeam" element={<SearchTeam />} />
            <Route path="requests" element={<Requests />} />
          </Route>
        </Route>        

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
