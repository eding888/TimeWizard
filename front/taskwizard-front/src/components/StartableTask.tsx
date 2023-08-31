import React, { useRef, SyntheticEvent } from 'react';
import { Progress, useToast, useMediaQuery, Flex, Box, Heading, useDisclosure, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Card, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TaskInterface } from '../../../../back/src/models/task';
import { formatTime } from '../utils/time';
import { DeleteIcon } from '@chakra-ui/icons';
import { deleteTask } from '../utils/routing';
const StartableTask = ({ task }: { task: TaskInterface }) => {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const toast = useToast();
  const handleDeleteTask = async () => {
    const res = await deleteTask(task.id);
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    }
  };
  return (
    <>
      <Card w={screenCutoff ? '400px' : '100%'} h='400px' justifyContent='center'>
        <Heading fontSize = 'xl' w= '80%' textAlign='center' position= 'absolute' top= '30px' left= '50%' transform= 'translate(-50%, -50%)'>{task.name}</Heading>
        <DeleteIcon onClick = {onOpen} cursor='pointer' position ='absolute' left = '90%' top = '20px'></DeleteIcon>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Confirm Deletion
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete task '{task.name}'?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={() => { onClose(); handleDeleteTask(); }} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Flex mt = '10' direction = 'column' alignItems='center' justifyContent='center'>
        {
          task.deadlineOptions
            ? <>
                <Box>Deadline: {`${task.deadlineOptions.deadline.month}/${task.deadlineOptions.deadline.day}/${task.deadlineOptions.deadline.year}`}</Box>
                <Box>{task.discrete ? `Count Remaining: ${task.deadlineOptions.timeRemaining}` : `Time Remaining: ${formatTime(task.deadlineOptions.timeRemaining)}`}</Box>
              </>
            : <>
                <Box fontWeight='semibold'>{task.discrete ? `Count Allotted Per Week: ${task.recurringOptions.timePerWeek}` : `Time Allotted Per Week: ${formatTime(task.recurringOptions.timePerWeek)}`}</Box>
                <Box fontWeight='semibold' color='red'>{task.discrete ? `Count in Debt: ${task.recurringOptions.debt}` : `Time in Debt: ${formatTime(task.recurringOptions.debt)}`}</Box>
              </>
        }
        <Progress w='70%' borderRadius='lg' value={30}></Progress>
        </Flex>
      </Card>
    </>
  );
};

export default StartableTask;
