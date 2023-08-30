import { useColorMode, Box, Image, Flex, IconButton, useMediaQuery, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';
import DarkModeToggle from './DarkModeToggle';
import SignupButton from './SignupButton';
import { InfoIcon } from '@chakra-ui/icons';
const NavBar1 = () => {
  const logoVariants = {
    small: 'https://i.ibb.co/bFJxNkL/logo-no-background.png',
    large: 'https://i.ibb.co/5F9p1T9/logo-no-background.png'
  };
  const { colorMode } = useColorMode();
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [screenHeightCutoff] = useMediaQuery('(min-height: 450px)');
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
      <Box w='100%' p={4} mb={5} boxShadow='sm' bg={darkAndLightModeColor} color= 'white' borderBottom='1px' borderBottomColor= {darkAndLightModeBorderColor}>
        <Flex align="center" justifyContent="space-around">
          <Link to='/'>
            <Image
              src= {variant}
              objectFit='cover'
              height="50px"
            />
          </Link>
          <Flex gap="20px">
            <IconButton aria-label='info'>
              <InfoIcon/>
            </IconButton>
            <LoginButton color = "purple" padding = {screenCutoff ? 'md' : '3'} fontSize = {screenCutoff ? 'md' : 'xs'}/>
            <SignupButton color='purple' padding = {screenCutoff ? 'md' : '3'} fontSize = {screenCutoff ? 'md' : 'xs'} size='md'/>
            <DarkModeToggle/>
          </Flex>
        </Flex>
      </Box>
      <Flex display={ screenHeightCutoff ? 'flex' : 'none' } onClick = {() => { window.location.href = 'https://github.com/eding888'; }}cursor='pointer' gap='6px' alignItems='center' fontWeight='light' fontSize='xs' position='fixed' top = 'calc(100% - 35px)' left="50%" transform="translateX(-50%)">
        <Image filter={colorMode === 'dark' ? 'invert(100%)' : ''}src='https://cdn-icons-png.flaticon.com/512/25/25231.png' height='20px'></Image>
        eding888
      </Flex>
    </>
  );
};

export default NavBar1;
