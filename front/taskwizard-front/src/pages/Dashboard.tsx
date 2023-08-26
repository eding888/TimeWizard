import React, { useEffect, useState } from 'react';
import '../index.css';
import { Image, Flex, Button, Heading, Box, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import NavBar2 from '../components/NavBar2';
import { InfoIcon } from '@chakra-ui/icons';
import SignupButton from '../components/SignupButton';
import { checkToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import NewTask from '../components/NewTask';
function Dashboard () {
  const [isNotLoaded, setIsNotLoaded] = useState(true);
  const handleLoad = () => {
    setIsNotLoaded(false);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <NavBar2/>
      <Button onClick={onOpen}>Open Modal</Button>

      <NewTask isOpen={isOpen} onClose= {onClose}></NewTask>

    </>
  );
}

export default Dashboard;
