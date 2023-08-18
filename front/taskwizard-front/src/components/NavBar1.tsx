import { Box, Image, Flex, Button, IconButton, useMediaQuery, useColorModeValue, Heading, Center, Spacer } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';
import DarkModeToggle from './DarkModeToggle';
import SignupButton from './SignupButton';
const NavBar1 = () => {
  const logoVariants = {
    small: 'https://i.ibb.co/bFJxNkL/logo-no-background.png',
    large: 'https://i.ibb.co/5F9p1T9/logo-no-background.png'
  };
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
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
          <Link to='/'>
            <Image
              src= {variant}
              objectFit='cover'
              height="50px"
            />
          </Link>
          <Flex gap="20px">
            <LoginButton color = "purple"/>
            <SignupButton color='purple' size='md'/>
            <DarkModeToggle/>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default NavBar1;
