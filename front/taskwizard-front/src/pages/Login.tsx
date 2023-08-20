import React, { useState, useEffect, SyntheticEvent } from 'react';
import '../index.css';

import { useToast, Button, FormControl, Input, FormLabel, FormHelperText, Flex, Heading, Image, useMediaQuery } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import NavBar1 from '../components/NavBar1';
import { login } from '../utils/routing';
function Login () {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    ; // eslint-disable-line
  }, [screenCutoff]);

  const handleEmail = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    setEmail(target.value);
  };
  const handlePassword = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    setPassword(target.value);
  };
  const toast = useToast();
  const submitLogin = async (event: SyntheticEvent) => {
    event.preventDefault();
    const res = await login(DOMPurify.sanitize(email), DOMPurify.sanitize(password));
    console.log(res);
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    } else {
      console.log('good');
    }
  };
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
            <form onSubmit={submitLogin}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input onChange={handleEmail} mb = '5' type='email' />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input onChange={handlePassword} type='password' />
              </FormControl>
              <Button colorScheme='purple' mt = '5' w='100%' type='submit'>Login</Button>
              <Button mt = '5' w='100%'>Forgot Password?</Button>
            </form>
        </Flex>
      </Flex>
    </>
  );
}

export default Login;
