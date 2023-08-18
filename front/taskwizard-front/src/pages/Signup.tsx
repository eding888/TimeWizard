import React, { useState, useEffect } from 'react';
import '../index.css';

import { FormControl, Input, FormLabel, FormHelperText, Flex, Heading, Image, useMediaQuery } from '@chakra-ui/react';
import DarkModeToggle from '../components/DarkModeToggle';
import NavBar1 from '../components/NavBar1';
function Signup () {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  useEffect(() => {
    console.log('hi');
  }, [screenCutoff]);
  return (
    <>
      <NavBar1/>
      <Flex alignItems='center' justifyContent='center' direction={screenCutoff ? 'row-reverse' : 'column'} height = 'calc(82vh - 95px)' gap = '20px'>
        <Image
          src= 'https://cdn-icons-png.flaticon.com/512/477/477103.png'
          height="clamp(200px, 20%, 300px)"
          animation="wiggle 2s ease-in-out infinite"
        />
        <Flex justifyContent='center' direction='column' width = 'clamp(100px, 50%, 300px)'>
          <Heading mb = '5' textAlign='right'>Sign Up</Heading>
          <FormControl>
              <FormLabel>Email</FormLabel>
              <Input mb = '5' type='email' />
              <FormLabel>Password</FormLabel>
              <Input type='password' />
          </FormControl>
        </Flex>
      </Flex>
    </>
  );
}

export default Signup;
