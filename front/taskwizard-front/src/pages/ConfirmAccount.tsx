import React, { useState, useEffect, SyntheticEvent } from 'react';
import '../index.css';

import { useToast, Text, Button, FormControl, Input, FormLabel, FormHelperText, Flex, Heading, Image, useMediaQuery } from '@chakra-ui/react';
import DarkModeToggle from '../components/DarkModeToggle';
import NavBar1 from '../components/NavBar1';
import { confirm, getUser } from '../utils/routing';
function ConfirmAccount () {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  useEffect(() => {
    ; // eslint-disable-line
  }, [screenCutoff]);
  const [code, setCode] = useState('');
  const handleCode = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    const newCode = target.value.slice(0, 6);
    setCode(newCode);
  };
  const toast = useToast();
  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const res = await confirm(code, getUser());
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    } else {
      toast({
        title: 'Success! You may now log in.',
        status: 'success',
        isClosable: true
      });
    }
  };
  return (
    <>
      <NavBar1/>
      <Flex alignItems='center' justifyContent='center' direction='column' height = 'calc(82vh - 95px)' gap = '30px'>
        <Image
          src= 'https://cdn-icons-png.flaticon.com/512/477/477103.png'
          height={!screenCutoff ? 'clamp(50px, 25%, 300px)' : 'clamp(100px, 40%, 300px)'}
          animation="bounce 2s ease-in-out infinite"
        />
        <Heading>Confirm your Account</Heading>
        <Text fontSize='xl'>Enter the six digit code sent to your email.</Text>
        <form onSubmit = {submit}>
          <Flex justifyContent='center'>
            <Input value = {code} onChange = {handleCode} width = '315px' textAlign = 'center' fontWeight= 'bold' height = '80px' letterSpacing='29px' fontSize= '4xl' type='number' maxLength={4}/>
          </Flex>
          <Button type = 'submit' mt = '5' w='100%'>Submit</Button>
        </form>
      </Flex>
    </>
  );
}

export default ConfirmAccount;
