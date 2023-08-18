import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
const SignupButton = ({ color, size }: {color: string, size: string}) => {
  return (
    <Link to='/signup'>
      <Button colorScheme={color} size={size}>
        Sign Up
      </Button>
    </Link>
  );
};

export default SignupButton;
