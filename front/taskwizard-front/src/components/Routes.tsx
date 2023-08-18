import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
export default () => (
  <Routes>
    <Route path="/login" element={<LoginPage/>} />
    <Route path="/*" element={<Home/>} />
  </Routes>
);

function LoginPage () {
  return <Login />;
}
