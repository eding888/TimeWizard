import React, { useState, useEffect, SyntheticEvent } from 'react';
import '../index.css';

import { useToast, FormControl, Input, FormLabel, FormErrorMessage, Flex, Heading, Image, useMediaQuery, Button } from '@chakra-ui/react';
import DarkModeToggle from '../components/DarkModeToggle';
import NavBar1 from '../components/NavBar1';
import DOMPurify from 'dompurify';
import { newUser, login } from '../utils/routing';
import { useNavigate } from 'react-router-dom';
function Signup () {
  interface TextAndError {
    text: string,
    error: string
  }
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [username, setUsername] = useState({ text: '', error: '' });
  const [email, setEmail] = useState({ text: '', error: '' });
  const [password, setPassword] = useState({ text: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ text: '', error: '' });

  function hasCapitalLetter (inputString: string): boolean {
    for (let i = 0; i < inputString.length; i++) {
      if (inputString[i] !== inputString[i].toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  function hasNumber (inputString: string): boolean {
    for (let i = 0; i < inputString.length; i++) {
      if (!isNaN(parseInt(inputString[i]))) {
        return true;
      }
    }
    return false;
  }

  const handleUsername = (event: SyntheticEvent): void => {
    const pattern = /^[a-zA-Z0-9]*$/;
    const target = event.target as HTMLInputElement;
    const newUsername = target.value;
    const newData: TextAndError = {
      text: newUsername,
      error: ''
    };
    if (newUsername !== '' && newUsername.length < 3) {
      newData.error = 'Username must be at least 3 characters.';
    }
    if (!pattern.test(newUsername)) {
      newData.error = 'Username cannot contain special characters';
    }
    setUsername(newData);
  };

  const handleEmail = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    const newEmail = target.value;
    const newData: TextAndError = {
      text: newEmail,
      error: ''
    };
    setEmail(newData);
  };

  const handlePassword = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    const newPassword = target.value;
    const newData: TextAndError = {
      text: newPassword,
      error: ''
    };
    if (newPassword !== '') {
      if (newPassword.length < 6) {
        newData.error += 'Password must be at least 6 characters.\n';
      }
      if (newPassword.includes(' ')) {
        newData.error += 'Password must not have spaces.\n';
      }
      if (!hasCapitalLetter(newPassword)) {
        newData.error += 'Password must contain capital letter.\n';
      }
      if (!hasNumber(newPassword)) {
        newData.error += 'Password must contain a number.\n';
      }
    }
    setPassword(newData);
  };

  const handleConfirmPassword = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    const newPassword = target.value;
    const newData: TextAndError = {
      text: newPassword,
      error: ''
    };
    if (newPassword !== '' && newPassword !== password.text) {
      newData.error += 'Passwords do not match.\n';
    }
    setConfirmPassword(newData);
  };

  const toast = useToast();
  const navigate = useNavigate();
  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (username.error === '' && email.error === '' && password.error === '' && confirmPassword.error === '') {
      const res = await newUser(DOMPurify.sanitize(username.text), DOMPurify.sanitize(email.text), DOMPurify.sanitize(password.text));
      if (res !== 'OK') {
        toast({
          title: res,
          status: 'error',
          isClosable: true
        });
      } else {
        const res = await login(DOMPurify.sanitize(email.text), DOMPurify.sanitize(password.text));
        if (res !== 'CONFIRMATION') {
          toast({
            title: res,
            status: 'error',
            isClosable: true
          });
        } else {
          navigate(`/confirm/${username.text}`);
        }
      }
    }
  };
  useEffect(() => {
    ; // eslint-disable-line
  }, [screenCutoff]);
  return (
    <>
      <NavBar1/>
      <Flex alignItems='center' justifyContent='center' direction={screenCutoff ? 'row-reverse' : 'column'} height = 'calc(82vh - 95px)' gap = '30px'>
        <Image
          src= 'https://cdn-icons-png.flaticon.com/512/477/477103.png'
          height={!screenCutoff ? 'clamp(50px, 20%, 300px)' : 'clamp(100px, 40%, 300px)'}
          position='relative'
          top= { screenCutoff ? '0px' : '100px' }
          left={ screenCutoff ? '0px' : '60px' }
          animation="bounce 2s ease-in-out infinite"
        />
        <Flex justifyContent='center' direction='column' width = 'clamp(100px, 50%, 300px)'>
          <Heading mb = '5' textAlign={screenCutoff ? 'right' : 'left'}>Sign Up</Heading>
            <form onSubmit={submit}>
              <FormControl isRequired isInvalid={username.error !== ''}>
                <FormLabel>Username</FormLabel>
                <Input onChange={handleUsername} type='text' />
                <FormErrorMessage>{username.error}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired>
                <FormLabel mt = '5'>Email</FormLabel>
                <Input onChange={handleEmail} type='email' />
              </FormControl>
              <FormControl isRequired isInvalid={password.error !== ''}>
                <FormLabel mt = '5'>Password</FormLabel>
                <Input onChange={handlePassword} type='password' />
                {password.error.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    <FormErrorMessage>{line}</FormErrorMessage>
                  </React.Fragment>
                ))}
              </FormControl>
              <FormControl isRequired isInvalid={confirmPassword.error !== ''}>
                <FormLabel mt = '5'>Confirm Password</FormLabel>
                <Input onChange={handleConfirmPassword} type='password' />
                <FormErrorMessage>{confirmPassword.error}</FormErrorMessage>
              </FormControl>
              <Button colorScheme='purple' mt = '5' w='100%' type='submit'>Create Account</Button>
            </form>
        </Flex>
      </Flex>
    </>
  );
}

export default Signup;
