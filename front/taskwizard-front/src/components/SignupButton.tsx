import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
const SignupButton = ({ color, fontSize, size, padding }: {color: string, fontSize: string, size: string, padding: string}) => {
  return (
    <Link to='/signup'>
      <Button colorScheme={color} fontSize = {fontSize} size={size} p={padding}>
        Sign Up
      </Button>
    </Link>
  );
};

export default SignupButton;
