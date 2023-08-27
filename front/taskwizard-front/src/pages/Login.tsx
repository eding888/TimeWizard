import React, { useState, useEffect, SyntheticEvent } from 'react';
import '../index.css';

import { useToast, Button, FormControl, Input, FormLabel, Flex, Heading, Image, useMediaQuery } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import NavBar1 from '../components/NavBar1';
import { useNavigate } from 'react-router-dom';
import { login, loginResponse } from '../utils/routing';
import { checkToken } from '../utils/checkToken';
import Loader from '../components/Loader';
import { useDispatch } from 'react-redux';
import { setCsrf } from '../redux/sessionSlice';

function Login () {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [screenHeightCutoff] = useMediaQuery('(min-height: 450px)');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const dispatch = useDispatch();
  const submitLogin = async (event: SyntheticEvent) => {
    event.preventDefault();
    const res: loginResponse = await login(email, password);
    if (res.status !== 'OK') {
      toast({
        title: res.status,
        status: 'error',
        isClosable: true
      });
    } else {
      dispatch(setCsrf(res.token));
      window.localStorage.setItem('logged', 'true');
      navigate('/dashboard');
    }
  };
  const resetPassword = (event: SyntheticEvent) => {
    event.preventDefault();
    navigate('/resetPassword');
  };
  return (
    <>
      {isNotLoaded && <Loader/>}
      <NavBar1/>
      <Flex onLoad = {handleLoad} alignItems='center' justifyContent='center' direction={screenCutoff ? 'row' : 'column'} height = 'calc(82vh - 95px)' gap = '30px'>
        <Image
          src= 'https://cdn-icons-png.flaticon.com/512/477/477103.png'
          height={!screenCutoff ? 'clamp(50px, 25%, 300px)' : 'clamp(100px, 40%, 300px)'}
          animation="bounce 2s ease-in-out infinite"
        />
        <Flex flexWrap = 'wrap' justifyContent='center' direction='column' width = 'clamp(100px, 50%, 300px)'>
          <Heading mb = '5' textAlign='left'>Login</Heading>
            <form onSubmit={submitLogin}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input onChange={handleEmail} mb = '5' type='email' autoComplete='email'/>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input onChange={handlePassword} type='password' autoComplete='password'/>
              </FormControl>
              <Button colorScheme='purple' mt = '5' w={ screenHeightCutoff ? '100%' : '40%' } ms= {screenHeightCutoff ? '0' : '5%'} type='submit'>Login</Button>
              <Button onClick= {resetPassword} mt = '5' w={ screenHeightCutoff ? '100%' : '40%' } ms= {screenHeightCutoff ? '0' : '5%'} fontSize={screenHeightCutoff ? 'md' : 'xs'} >Forgot Password?</Button>
            </form>
        </Flex>
      </Flex>
    </>
  );
}

export default Login;
