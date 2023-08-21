import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import ConfirmAccount from '../pages/ConfirmAccount';
import Dashboard from '../pages/Dashboard';
import PassReset from '../pages/PassReset';
export default () => (
  <Routes>
    <Route path="/login" element={<LoginPage/>} />
    <Route path="/signup" element={<Signup/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    <Route path="/resetPassword" element={<PassReset/>} />
    <Route path="/confirm/:user" element={<ConfirmAccount/>} />
    <Route path="/*" element={<Home/>} />
  </Routes>
);

function LoginPage () {
  return <Login />;
}
