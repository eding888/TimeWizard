import React, { useEffect, useState } from 'react';
import '../index.css';
import { Image, Flex, Button, Heading, Box, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import NavBar2 from '../components/NavBar2';
import { AddIcon } from '@chakra-ui/icons';
import SignupButton from '../components/SignupButton';
import { checkToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import NewTask from '../components/NewTask';
import { newSession, getTasks } from '../utils/routing';
function Dashboard () {
  const [isNotLoaded, setIsNotLoaded] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      const res = await newSession();
      console.log(await getTasks());
      if (res !== 'OK') {
        window.localStorage.setItem('logged', 'false');
        navigate('/');
      }
    };
    checkSession();
  }, []);
  const handleLoad = () => {
    setIsNotLoaded(false);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <NavBar2/>
      <Button onClick={onOpen}><AddIcon mr ='3'></AddIcon>New Task</Button>

      <NewTask isOpen={isOpen} onClose= {onClose}></NewTask>

    </>
  );
}

export default Dashboard;
