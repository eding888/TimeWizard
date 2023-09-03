import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import ConfirmAccount from '../pages/ConfirmAccount';
import Dashboard from '../pages/Dashboard';
import PassReset from '../pages/PassReset';
import ConfirmPasswordReset from '../pages/ConfirmPassReset';
import VisitorDashboard from '../pages/VisitorDashboard';
import Info from '../pages/Info';
export default () => (
  <Routes>
    <Route path="/login" element={<LoginPage/>} />
    <Route path="/signup" element={<Signup/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    <Route path="/dashboard/:username" element={<VisitorDashboard/>} />
    <Route path="/resetPassword" element={<PassReset/>} />
    <Route path="/confirm/:user" element={<ConfirmAccount/>} />
    <Route path="/confirmReset/:email" element={<ConfirmPasswordReset/>} />
    <Route path="/info" element={<Info/>} />
    <Route path="/*" element={<Home/>} />
  </Routes>
);

function LoginPage () {
  return <Login />;
}
