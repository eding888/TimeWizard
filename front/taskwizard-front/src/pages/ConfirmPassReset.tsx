import React, { useState, useEffect, SyntheticEvent } from 'react';
import '../index.css';

import { FormErrorMessage, useToast, Button, FormControl, Input, FormLabel, Flex, Heading, Image, useMediaQuery } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import NavBar1 from '../components/NavBar1';
import { useNavigate, useParams } from 'react-router-dom';
import { confirmResetPassword } from '../utils/routing';
import { checkToken } from '../utils/checkToken';
import Loader from '../components/Loader';
import { hasCapitalLetter, hasNumber, TextAndError } from '../utils/formValidation';
function ConfirmPasswordReset () {
  const { email } = useParams();
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [screenHeightCutoff] = useMediaQuery('(min-height: 450px)');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState({ text: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ text: '', error: '' });
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

  const handleCode = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    const newCode = target.value.slice(0, 6);
    setCode(newCode);
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
  const submitPassReset = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (email === undefined) {
      return false;
    }
    const res = await confirmResetPassword(email, code, password.text);
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
          <Heading mb = '5' textAlign='left'>Reset Password</Heading>
            <form onSubmit={submitPassReset}>
              <FormControl isRequired>
                <FormLabel>Code</FormLabel>
                <Input onChange={handleCode} mb = '5' type='number' />
              </FormControl>
              <FormControl isRequired isInvalid={password.error !== ''}>
                <FormLabel>New Password</FormLabel>
                <Input onChange={handlePassword} type='password' />
                {password.error.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    <FormErrorMessage>{line}</FormErrorMessage>
                  </React.Fragment>
                ))}
              </FormControl>
              <FormControl isRequired isInvalid={confirmPassword.error !== ''}>
                <FormLabel mt = '5'>Confirm New Password</FormLabel>
                <Input onChange={handleConfirmPassword} type='password' />
                <FormErrorMessage>{confirmPassword.error}</FormErrorMessage>
              </FormControl>
              <Button colorScheme='purple' mt = '5' w={ screenHeightCutoff ? '100%' : '40%' } ms= {screenHeightCutoff ? '0' : '5%'} type='submit'>Reset Password</Button>
            </form>
        </Flex>
      </Flex>
    </>
  );
}

export default ConfirmPasswordReset;
