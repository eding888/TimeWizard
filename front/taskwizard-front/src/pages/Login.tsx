import React, { useState, useEffect } from 'react';
import '../index.css';

import { Button, FormControl, Input, FormLabel, FormHelperText, Flex, Heading, Image, useMediaQuery } from '@chakra-ui/react';
import DarkModeToggle from '../components/DarkModeToggle';
import NavBar1 from '../components/NavBar1';
function Login () {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  useEffect(() => {
    console.log('');
  }, [screenCutoff]);
  return (
    <>
      <NavBar1/>
      <Flex alignItems='center' justifyContent='center' direction={screenCutoff ? 'row' : 'column'} height = 'calc(82vh - 95px)' gap = '30px'>
        <Image
          src= 'https://cdn-icons-png.flaticon.com/512/477/477103.png'
          height={!screenCutoff ? 'clamp(50px, 25%, 300px)' : 'clamp(100px, 40%, 300px)'}
          animation="bounce 2s ease-in-out infinite"
        />
        <Flex justifyContent='center' direction='column' width = 'clamp(100px, 50%, 300px)'>
          <Heading mb = '5' textAlign='left'>Login</Heading>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input mb = '5' type='email' />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type='password' />
            </FormControl>
            <Button colorScheme='purple' mt = '5' w='100%' type='submit'>Login</Button>
            <Button mt = '5' w='100%'>Forgot Password?</Button>
        </Flex>
      </Flex>
    </>
  );
}

export default Login;
