import React from 'react';
import '../index.css';
import { Image, Flex, Button, Heading } from '@chakra-ui/react';
import NavBar1 from './NavBar1';

function Home () {
  return (
    <>
      <NavBar1/>
      <Flex flexDirection='column' alignItems='center' justifyContent='center' gap='25px' height = 'calc(90vh - 83px)'>
        <Image
        src= 'https://cdn-icons-png.flaticon.com/512/477/477103.png'
        objectFit='cover'
        height= "40%"
        animation="fadeInDelay2 3s ease-in-out forwards, wiggle 2s ease-in-out infinite"
        />
        <Flex ml={3} mr={3} flexDirection='column' alignItems='center' justifyContent='center' gap='10px'>
          <Heading textAlign='center' fontWeight='300' animation="fadeIn 1s ease-in-out forwards">Allocating time for productivity is important,</Heading>
          <Heading textAlign='center' animation="fadeInDelay1 2.5s ease-in-out forwards">TaskWizard makes it easy.</Heading>
        </Flex>
        <Flex gap="20px">
          <Button colorScheme='purple' size='lg' animation="fadeInDelay2 3s ease-in-out forwards">
            Learn More
          </Button>
          <Button colorScheme='teal' size='lg' animation="fadeInDelay2 3s ease-in-out forwards">
            Sign Up
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export default Home;
