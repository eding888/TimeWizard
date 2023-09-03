import '../index.css';
import { useToast, Flex, Box, Drawer, DrawerContent, DrawerOverlay, DrawerCloseButton, DrawerHeader, DrawerBody, Input, Button, DrawerFooter } from '@chakra-ui/react';
import { useState, SyntheticEvent } from 'react';
import { sendFriendRequest, acceptFriendRequest, removeFriend } from '../utils/routing';
import { FriendsData } from '../../../../back/src/models/user';
import { CheckIcon, SmallCloseIcon } from '@chakra-ui/icons';
const FriendsList = ({ isOpen, onClose, friendsData }: { isOpen: boolean, onClose: () => void, friendsData: FriendsData }) => {
  const [user, setUser] = useState('');

  const handleUserInput = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    setUser(target.value);
  };

  const toast = useToast();
  const handleSendFriendRequest = async () => {
    const res = await sendFriendRequest(user);
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    } else {
      toast({
        title: 'Friend request sent.',
        status: 'success',
        isClosable: true
      });
    }
  };

  const handleAcceptFriendRequest = async (user: string) => {
    const res = await acceptFriendRequest(user);
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    } else {
      toast({
        title: 'Friend request accepted.',
        status: 'success',
        isClosable: true
      });
    }
  };

  const handleRemoveFriend = async (user: string) => {
    const res = await removeFriend(user);
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    } else {
      toast({
        title: 'Friend removed.',
        status: 'success',
        isClosable: true
      });
    }
  };

  return (
    <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Friends</DrawerHeader>

          <DrawerBody>
            <Flex mb = '5' gap='10px' direction='column'>
              <Box>Add a Friend</Box>
              <Input onChange={handleUserInput} placeholder='Username' />
              <Button onClick={handleSendFriendRequest}>Add</Button>
            </Flex>
            <Box mb='1'>Friend Requests</Box>
            <Flex h='30%' overflow='auto' direction='column' ml='3'>
              {
                friendsData.friendRequests.map(request => {
                  return (
                    <Flex alignItems='center' justifyContent='space-between'>
                      <Box>{request}</Box>
                      <Flex gap='20px'>
                        <CheckIcon cursor='pointer' onClick={() => { handleAcceptFriendRequest(request); }}color='lime' />
                        <SmallCloseIcon color='red' />
                      </Flex>
                    </Flex>
                  );
                })
              }
            </Flex>
            <Box mb='1'>Friends</Box>
            <Flex h='30%' overflow='auto' direction='column' ml='3'>
              {
                friendsData.friends.map(friend => {
                  return (
                    <Flex alignItems='center' justifyContent='space-between'>
                      <Box>{friend}</Box>
                      <Flex gap='20px'>
                        <Button color='lime' size='xs'>View</Button>
                        <Button color='red' onClick={() => { handleRemoveFriend(friend); }} size='xs'>Un-add</Button>
                      </Flex>
                    </Flex>
                  );
                })
              }
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  );
};

export default FriendsList;
