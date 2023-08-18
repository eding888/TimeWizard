import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
const LoginButton = ({ color }: {color: string}) => {
  return (
    <Link to='/login'>
      <Button colorScheme={color} size='md'>
        Login
      </Button>
    </Link>
  );
};

export default LoginButton;
