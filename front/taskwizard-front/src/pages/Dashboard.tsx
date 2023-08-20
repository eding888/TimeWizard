import React, { useEffect } from 'react';
import '../index.css';
import { Image, Flex, Button, Heading, Box } from '@chakra-ui/react';
import NavBar2 from '../components/NavBar2';
import SignupButton from '../components/SignupButton';
import { checkToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
function Dashboard () {
  return (
    <>
      <NavBar2/>

    </>
  );
}

export default Dashboard;
