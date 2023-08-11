import { Button } from '@chakra-ui/react';
const LoginButton = ({ color }: {color: string}) => {
  return (
    <Button colorScheme={color} size='md'>
      Login
    </Button>
  );
};

export default LoginButton;
