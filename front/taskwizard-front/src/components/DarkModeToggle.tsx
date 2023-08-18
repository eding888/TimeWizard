import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useColorMode, IconButton } from '@chakra-ui/react';
const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      colorScheme='teal'
      aria-label='toggle dark/light mode'
      icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />} // Toggle sun/moon icon based on color mode
      onClick={toggleColorMode}
    />
  );
};

export default DarkModeToggle;
