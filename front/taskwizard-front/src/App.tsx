import React, { useState, useEffect } from 'react';
import './index.css';
import LoginButton from './components/LoginButton';
import { Box, Image, Flex, Button, IconButton, useMediaQuery, useColorMode, useColorModeValue, Heading, Center, Spacer } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

function App () {
  const logoVariants = {
    small: 'https://i.ibb.co/bFJxNkL/logo-no-background.png',
    large: 'https://i.ibb.co/5F9p1T9/logo-no-background.png'
  };
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const { colorMode, toggleColorMode } = useColorMode();
  const darkAndLightModeColor = useColorModeValue('white', 'gray.800');
  const darkAndLightModeBorderColor = useColorModeValue('gray.200', 'gray.800');
  const [variant, setVariant] = useState(logoVariants.large);
  useEffect(() => {
    if (screenCutoff) {
      if (variant !== logoVariants.large) {
        setVariant(logoVariants.large);
      }
    } else {
      if (variant !== logoVariants.small) {
        setVariant(logoVariants.small);
      }
    }
  }, [screenCutoff, variant]);
  return (
    <>
      <Box w='100%' p={4} mb={5} boxShadow='sm' bg={darkAndLightModeColor} color= 'white' borderBottom='1px' borderBottomColor= {darkAndLightModeBorderColor}>
        <Flex align="center" justifyContent="space-around">
          <Image
          src= {variant}
          objectFit='cover'
          height="50px"
          />
          <Flex gap="20px">
            <LoginButton color = "purple"/>
            <Button colorScheme='purple' size='md'>
              Sign Up
            </Button>
            <IconButton
              colorScheme='teal'
              aria-label='toggle dark/light mode'
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />} // Toggle sun/moon icon based on color mode
              onClick={toggleColorMode}
            />
          </Flex>
        </Flex>
      </Box>
      <Flex flexDirection='column' alignItems='center' justifyContent='center' gap='25px' height = 'calc(90vh - 83px)'>
        <Image
        src= 'https://cdn-icons-png.flaticon.com/512/477/477103.png'
        objectFit='cover'
        height= "30vh"
        animation="fadeInDelay2 2s ease-in-out forwards, wiggle 2s ease-in-out infinite"
        />
        <Flex ml={3} mr={3} flexDirection='column' alignItems='center' justifyContent='center' gap='10px'>
          <Heading textAlign='center' fontWeight='300' animation="fadeIn 1s ease-in-out forwards">Task management done simply yet effectively.</Heading>
          <Heading textAlign='center' animation="fadeInDelay1 2s ease-in-out forwards">Try TaskWizard for free!</Heading>
        </Flex>
        <Flex gap="20px">
          <Button colorScheme='purple' size='lg' animation="fadeInDelay2 2s ease-in-out forwards">
            Learn More
          </Button>
          <Button colorScheme='teal' size='lg' animation="fadeInDelay2 2s ease-in-out forwards">
            Sign Up
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export default App;
