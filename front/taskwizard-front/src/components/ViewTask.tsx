import React, { useRef, SyntheticEvent } from 'react';
import { useMediaQuery, Flex, Box, Heading, useDisclosure, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Card } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TaskInterface } from '../../../../back/src/models/task';
import { formatTime } from '../utils/time';
const ViewTask = ({ task }: { task: TaskInterface }) => {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  return (
    <>
      <Card w={screenCutoff ? '400px' : '100%'} h='150px' justifyContent='center'>
        <Heading textAlign='center' position= 'absolute' top= '30px' left= '50%' transform= 'translate(-50%, -50%)'>{task.name}</Heading>
        <Flex mt = '10' direction = 'column' alignItems='center' justifyContent='center'>
        {
          task.deadlineOptions
            ? <>
                <Box>Deadline: {`${task.deadlineOptions.deadline.month}/${task.deadlineOptions.deadline.day}/${task.deadlineOptions.deadline.year}`}</Box>
                <Box>Time Remaining: {formatTime(task.deadlineOptions.timeRemaining)}</Box>
              </>
            : <>
                <Box fontWeight='semibold'>Time Allotted Per Week: {formatTime(task.recurringOptions.timePerWeek)}</Box>
                <Box fontWeight='semibold' color='red'>Time in Debt: {formatTime(task.recurringOptions.debt)}</Box>
              </>
        }
        </Flex>
      </Card>
    </>
  );
};

export default ViewTask;
