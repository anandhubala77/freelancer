import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Dashboard from './admin/Dashboard';
import ManageProjects from './admin/ManageProjects';
import ManageUsers from './admin/ManageUsers';
import PaymentLogs from './admin/PaymentLogs';
import FraudReports from './admin/FraudReports';
import ResolveQueries from './admin/ResolveQueries';
import PrivateRoutes from './routes/PrivateRoutes';
import AdminRoutes from './routes/AdminRoutes';
import HiringPersonDashboard from './pages/HiringPersonDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UpdatePassword from './components/Updatepassword';
import HiringUpdateProfile from  './pages/HiringUpdateProfile'





import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './store/slices/authSlice';
import { ViewProfile } from './pages/ViewProfile';
import  UpdateProfile  from './pages/UpdateProfile';
import AdminProfile from './admin/AdminProfile';

function App() {

   const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/Login" element={<Login />} /> 
      <Route path="/Register" element={<Register />} /> 
      

      <Route path="/admin" element={<PrivateRoutes />}>
        <Route path="" element={<AdminRoutes />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="payments" element={<PaymentLogs />} />
          <Route path="fraud" element={<FraudReports />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>

       <Route path="/user" element={<PrivateRoutes />}>
        <Route path="hiring" element={<HiringPersonDashboard />} />
        <Route path="jobseeker" element={<JobSeekerDashboard />} />
        <Route path="profile/view" element={<ViewProfile />} />
        <Route path="profile/edit" element={<UpdateProfile />} />  
        <Route path="update-password" element={<UpdatePassword />} />
        <Route path='updateHiringprofile' element={<HiringUpdateProfile/>}/> 
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;

