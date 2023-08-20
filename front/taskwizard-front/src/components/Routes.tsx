import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import ConfirmAccount from '../pages/ConfirmAccount';
export default () => (
  <Routes>
    <Route path="/login" element={<LoginPage/>} />
    <Route path="/signup" element={<Signup/>} />
    <Route path="/confirm" element={<ConfirmAccount/>} />
    <Route path="/*" element={<ConfirmAccount/>} />
  </Routes>
);

function LoginPage () {
  return <Login />;
}
