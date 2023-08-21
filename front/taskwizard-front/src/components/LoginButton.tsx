import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
const LoginButton = ({ color, fontSize, padding }: {color: string, fontSize: string, padding: string}) => {
  return (
    <Link to='/login'>
      <Button fontSize={fontSize} colorScheme={color} size='md' p={padding}>
        Login
      </Button>
    </Link>
  );
};

export default LoginButton;
