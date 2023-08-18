import React, { useState, useEffect } from 'react';
import '../index.css';
import LoginButton from './LoginButton';
import { Box, Image, Flex, Button, IconButton, useMediaQuery, useColorModeValue, Heading, Center, Spacer } from '@chakra-ui/react';
import DarkModeToggle from './DarkModeToggle';

function Login () {
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
      <h1>hi</h1>
    </>
  );
}

export default Login;
