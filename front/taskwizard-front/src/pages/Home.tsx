import React, { useEffect, useState } from 'react';
import '../index.css';
import { Image, Flex, Button, Heading, Box } from '@chakra-ui/react';
import NavBar1 from '../components/NavBar1';
import SignupButton from '../components/SignupButton';
import { checkToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
function Home () {
  const [isNotLoaded, setIsNotLoaded] = useState(true);
  const handleLoad = () => {
    setIsNotLoaded(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (checkToken()) {
      navigate('/dashboard');
    }
  }, []);
  return (
    <>
      {isNotLoaded && <Loader/>}
      <NavBar1/>
      <Flex overflow='auto' onLoad={handleLoad} flexDirection='column' alignItems='center' justifyContent='center' gap='25px' height = 'calc(85vh - 83px)'>
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
          <Box animation="fadeInDelay2 3s ease-in-out forwards">
            <SignupButton color='teal' padding = 'md' fontSize = 'md' size='lg'/>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export default Home;
