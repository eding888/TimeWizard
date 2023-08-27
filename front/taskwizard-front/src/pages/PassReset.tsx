import React, { useState, useEffect, SyntheticEvent } from 'react';
import '../index.css';

import { useToast, Text, Button, Input, Flex, Heading, Image, useMediaQuery } from '@chakra-ui/react';
import NavBar1 from '../components/NavBar1';
import { confirm, confirmResetPassword, resetPassword } from '../utils/routing';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
function PassReset () {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [screenHeightCutoff] = useMediaQuery('(min-height: 450)');
  const [isNotLoaded, setIsNotLoaded] = useState(true);
  const handleLoad = () => {
    setIsNotLoaded(false);
  };
  useEffect(() => {
    ; // eslint-disable-line
  }, [screenCutoff]);
  const [email, setEmail] = useState('');
  const handleEmail = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    setEmail(target.value);
  };
  const toast = useToast();
  const navigate = useNavigate();
  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const res = await resetPassword(email);
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    } else {
      navigate(`/confirmReset/${email}`);
    }
  };
  return (
    <>
      {isNotLoaded && <Loader/>}
      <NavBar1/>
      <Flex onLoad={handleLoad} alignItems='center' justifyContent='center' direction='column' height = 'calc(82vh - 95px)' gap = '30px'>
        <Image
          src= 'https://cdn-icons-png.flaticon.com/512/477/477103.png'
          height={!screenCutoff ? 'clamp(50px, 25%, 300px)' : 'clamp(100px, 40%, 300px)'}
          mt = {screenHeightCutoff ? '0' : '20%'}
          animation="bounce 2s ease-in-out infinite"
        />
        <Heading>Reset Password</Heading>
        <Text textAlign='center' fontSize='xl'>Enter the email linked to your TaskWizard account.</Text>
        <form onSubmit = {submit}>
          <Flex justifyContent='center'>
            <Input value = {email} onChange = {handleEmail} width = {screenCutoff ? '500px' : '80%'} textAlign = 'center' fontWeight= 'bold' height = '40px' fontSize= '2xl' type='text'/>
          </Flex>
          <Button type = 'submit' mt = '5' w='100%'>Submit</Button>
        </form>
      </Flex>
    </>
  );
}

export default PassReset;
