import React, { useRef, SyntheticEvent } from 'react';
import { useDisclosure, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
const LogoutButton = ({ color }: {color: string}) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const handleLogout = async (event: SyntheticEvent) => {
    event.preventDefault();
    window.localStorage.setItem('logged', 'false');
    navigate('/');
  };
  return (
    <>
      <Button onClick={onOpen} colorScheme={color} size='md'>
        Logout
      </Button>
      <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Confirm Logout
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to logout?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={handleLogout} ml={3}>
              Logout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  </>
  );
};

export default LogoutButton;
