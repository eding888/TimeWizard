import React, { useEffect, useState } from 'react';
import '../index.css';
import { Image, Flex, Button, Heading, Box, useMediaQuery } from '@chakra-ui/react';
import NavBar1 from '../components/NavBar1';
import SignupButton from '../components/SignupButton';
import { checkToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
const Info = () => {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  return (
    <>
      <NavBar1/>
      <Flex overflow='auto' justifyContent={screenCutoff ? 'center' : ''} alignItems='center' direction='column' height = 'calc(85vh - 50px)'>
        <Heading size='md'>About TaskWizard</Heading>
        <Box textAlign='center' w='50%'> TaskWizard is a project I made independtly over the course of a month or so as I found other ways of managing my time inconvenient and inefficient. I also wanted to make time management social and shareable with TaskWizard's friend adding fuctionality. TaskWizard utilizes React on the frontend and Node/Express/MongoDB for the backend, all of which utilizes TypeScript.</Box>
        <Heading size='md' mt = '8'>About Me</Heading>
        <Box textAlign='center' w='50%'>I am currently a student studying computer science in college. I am very interesting in software development, especially web development. I've always enjoyed being creative while also having a quantitative mindset, which is what drew me to programming.</Box>
        <Heading size='md' mt = '8'>How to Use TaskWizard?</Heading>
        <Box textAlign='center' w='50%'>The awesome thing about TaskWizard is that not only is it effective, it is very easy to use. Everything should be explained in the 'TaskWizard: At a Glance' video. You can view it here.</Box>
        <Heading size='md' mt = '8'>How to Use Contribute?</Heading>
        <Box textAlign='center' w='50%'>If you are developer, please feel free to submit a pull request at the github repo for this website. This can be found on my github profile at the link down below.</Box>
        <Heading size='md' mt = '8'>Image Sources</Heading>
        <Box textAlign='center' w='50%'>Cartoon Wizard: Designed by FreePik https://www.freepik.com/icon/wizard_477103</Box>
      </Flex>
    </>
  );
};

export default Info;
